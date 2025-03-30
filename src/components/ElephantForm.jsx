"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import "./ElephantForm.css"

const ElephantForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditMode = !!id

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        gender: "Unknown",
        age: "",
        rTusk: "",
        lTusk: "",
        rPromTear: false,
        rPromHole: false,
        rSecTear: false,
        rSecHole: false,
        lPromTear: false,
        lPromHole: false,
        lSecTear: false,
        lSecHole: false,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().split(" ")[0].slice(0, 5),
        latitude: "",
        longitude: "",
    })

    const [images, setImages] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                    }))
                },
                (error) => {
                    console.error("Error getting location:", error)
                },
            )
        }

        // Fetch elephant data if in edit mode
        if (isEditMode) {
            const fetchElephant = async () => {
                try {
                    setLoading(true)
                    const response = await axios.get(`http://localhost:4000/api/elephants/${id}`)
                    const elephantData = response.data

                    setFormData({
                        name: elephantData.name || "",
                        location: elephantData.location || "",
                        gender: elephantData.gender || "Unknown",
                        age: elephantData.age || "",
                        rTusk: elephantData.rTusk || "",
                        lTusk: elephantData.lTusk || "",
                        rPromTear: elephantData.rPromTear || false,
                        rPromHole: elephantData.rPromHole || false,
                        rSecTear: elephantData.rSecTear || false,
                        rSecHole: elephantData.rSecHole || false,
                        lPromTear: elephantData.lPromTear || false,
                        lPromHole: elephantData.lPromHole || false,
                        lSecTear: elephantData.lSecTear || false,
                        lSecHole: elephantData.lSecHole || false,
                        date: elephantData.date ? new Date(elephantData.date).toISOString().split("T")[0] : "",
                        time: elephantData.time || "",
                        latitude: elephantData.latitude || "",
                        longitude: elephantData.longitude || "",
                    })

                    setExistingImages(elephantData.images || [])
                    setLoading(false)
                } catch (err) {
                    setError("Failed to fetch elephant data")
                    setLoading(false)
                    console.error(err)
                }
            }

            fetchElephant()
        }
    }, [id, isEditMode])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleImageChange = (e) => {
        setImages([...e.target.files])
    }

    const handleRemoveExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const formDataToSend = new FormData();

            // Append all form fields
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });

            // Append new images
            images.forEach((image) => {
                formDataToSend.append("newImages", image); // use newImages for the new uploads
            });

            // If in edit mode, append existing images
            if (isEditMode) {
                existingImages.forEach((img) => {
                    formDataToSend.append("existingImages", img); // handle existing images if necessary
                });
            }

            let response;
            if (isEditMode) {
                response = await axios.patch(`http://localhost:4000/api/elephants/${id}`, formDataToSend);
                setSuccess("Elephant updated successfully!");
            } else {
                response = await axios.post("http://localhost:4000/api/elephants", formDataToSend);
                setSuccess("Elephant added successfully!");
                setFormData({
                    // reset form data
                    name: "",
                    location: "",
                    gender: "Unknown",
                    age: "",
                    rTusk: "",
                    lTusk: "",
                    rPromTear: false,
                    rPromHole: false,
                    rSecTear: false,
                    rSecHole: false,
                    lPromTear: false,
                    lPromHole: false,
                    lSecTear: false,
                    lSecHole: false,
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toTimeString().split(" ")[0].slice(0, 5),
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                });
                setImages([]);
            }

            setLoading(false);
        } catch (err) {
            setError("Failed to save elephant data");
            setLoading(false);
            console.error(err);
        }
    };

    if (loading && isEditMode) {
        return <div className="loading">Loading elephant data...</div>
    }

    return (
        <div className="elephant-form-container">
            <h2>{isEditMode ? "Edit Elephant" : "Add New Elephant"}</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="elephant-form">
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender *</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="Unknown">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age (years)</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="0" max="100" />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="rTusk">Right Tusk</label>
                        <input type="text" id="rTusk" name="rTusk" value={formData.rTusk} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lTusk">Left Tusk</label>
                        <input type="text" id="lTusk" name="lTusk" value={formData.lTusk} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Ear Markings</h3>

                    <div className="ear-markings">
                        <div className="ear-column">
                            <h4>Right Ear</h4>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="rPromTear" checked={formData.rPromTear} onChange={handleChange} />
                                    Prominent Tear
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="rPromHole" checked={formData.rPromHole} onChange={handleChange} />
                                    Prominent Hole
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="rSecTear" checked={formData.rSecTear} onChange={handleChange} />
                                    Secondary Tear
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="rSecHole" checked={formData.rSecHole} onChange={handleChange} />
                                    Secondary Hole
                                </label>
                            </div>
                        </div>

                        <div className="ear-column">
                            <h4>Left Ear</h4>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="lPromTear" checked={formData.lPromTear} onChange={handleChange} />
                                    Prominent Tear
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="lPromHole" checked={formData.lPromHole} onChange={handleChange} />
                                    Prominent Hole
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="lSecTear" checked={formData.lSecTear} onChange={handleChange} />
                                    Secondary Tear
                                </label>
                            </div>
                            <div className="checkbox-group">
                                <label>
                                    <input type="checkbox" name="lSecHole" checked={formData.lSecHole} onChange={handleChange} />
                                    Secondary Hole
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="latitude">Latitude</label>
                        <input type="text" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="longitude">Longitude</label>
                        <input type="text" id="longitude" name="longitude" onChange={handleChange} value={formData.longitude} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="images">Images (up to 5)</label>
                    <input type="file" id="images" name="images" onChange={handleImageChange} multiple accept="image/*" />
                    <div className="image-preview">
                        {images.map((image, index) => (
                            <div key={`new-${index}`} className="image-preview-item">
                                <img src={URL.createObjectURL(image) || "/placeholder.svg"} alt={`Preview ${index}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {isEditMode && existingImages.length > 0 && (
                    <div className="form-group">
                        <label>Existing Images</label>
                        <div className="image-preview">
                            {existingImages.map((image, index) => (
                                <div key={`existing-${index}`} className="image-preview-item">
                                    <img src={`http://localhost:4000${image}`} alt={`Elephant ${index}`} />
                                    <button type="button" className="remove-image" onClick={() => handleRemoveExistingImage(index)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button type="button" onClick={() => navigate("/elephants")} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? "Saving..." : isEditMode ? "Update Elephant" : "Save Elephant"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ElephantForm

