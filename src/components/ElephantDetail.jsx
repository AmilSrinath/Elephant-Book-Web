"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./ElephantDetail.css"

const ElephantDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [elephant, setElephant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeImage, setActiveImage] = useState(0)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        const fetchElephant = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/elephants/${id}`)
                setElephant(response.data)
                setLoading(false)
            } catch (err) {
                setError("Failed to fetch elephant data")
                setLoading(false)
                console.error(err)
            }
        }

        fetchElephant()
    }, [id])

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/elephants/${id}`)
            navigate("/elephants")
        } catch (err) {
            setError("Failed to delete elephant")
            console.error(err)
        }
    }

    if (loading) {
        return <div className="loading">Loading elephant data...</div>
    }

    if (error) {
        return <div className="error-message">{error}</div>
    }

    if (!elephant) {
        return <div className="not-found">Elephant not found</div>
    }

    return (
        <div className="elephant-detail-container">
            <div className="detail-header">
                <h2>{elephant.name}</h2>
                <div className="detail-actions">
                    <Link to={`/elephants/${id}/edit`} className="edit-button">
                        Edit
                    </Link>
                    <button onClick={() => setShowDeleteModal(true)} className="delete-button">
                        Delete
                    </button>
                </div>
            </div>

            <div className="detail-content">
                <div className="detail-images">
                    {elephant.images && elephant.images.length > 0 ? (
                        <>
                            <div className="main-image">
                                <img
                                    src={`${elephant.images[activeImage]}`}
                                    alt={`${elephant.name} - main view`}
                                />
                            </div>

                            {elephant.images.length > 1 && (
                                <div className="image-thumbnails">
                                    {elephant.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${index === activeImage ? "active" : ""}`}
                                            onClick={() => setActiveImage(index)}
                                        >
                                            <img src={`${image}`} alt={`${elephant.name} - thumbnail ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-image">No Images Available</div>
                    )}
                </div>

                <div className="detail-info">
                    <div className="info-section">
                        <h3>Basic Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Location:</span>
                                <span className="info-value">{elephant.location}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Gender:</span>
                                <span className="info-value">{elephant.gender}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Age:</span>
                                <span className="info-value">{elephant.age ? `${elephant.age} years` : "Unknown"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Date:</span>
                                <span className="info-value">{new Date(elephant.date).toLocaleDateString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Time:</span>
                                <span className="info-value">{elephant.time || "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Tusks</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Right Tusk:</span>
                                <span className="info-value">{elephant.rTusk || "Not specified"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Left Tusk:</span>
                                <span className="info-value">{elephant.lTusk || "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Ear Markings</h3>
                        <div className="ear-markings-grid">
                            <div className="ear-column">
                                <h4>Right Ear</h4>
                                <ul className="marking-list">
                                    <li className={elephant.rPromTear ? "present" : "absent"}>
                                        Prominent Tear: {elephant.rPromTear ? "Yes" : "No"}
                                    </li>
                                    <li className={elephant.rPromHole ? "present" : "absent"}>
                                        Prominent Hole: {elephant.rPromHole ? "Yes" : "No"}
                                    </li>
                                    <li className={elephant.rSecTear ? "present" : "absent"}>
                                        Secondary Tear: {elephant.rSecTear ? "Yes" : "No"}
                                    </li>
                                    <li className={elephant.rSecHole ? "present" : "absent"}>
                                        Secondary Hole: {elephant.rSecHole ? "Yes" : "No"}
                                    </li>
                                </ul>
                            </div>

                            <div className="ear-column">
                                <h4>Left Ear</h4>
                                <ul className="marking-list">
                                    <li className={elephant.lPromTear ? "present" : "absent"}>
                                        Prominent Tear: {elephant.lPromTear ? "Yes" : "No"}
                                    </li>
                                    <li className={elephant.lPromHole ? "present" : "absent"}>
                                        Prominent Hole: {elephant.lPromHole ? "Yes" : "No"}
                                    </li>
                                    <li className={elephant.lSecTear ? "present" : "absent"}>
                                        Secondary Tear: {elephant.lSecTear ? "Yes" : "No"}
                                    </li>
                                    <li className={elephant.lSecHole ? "present" : "absent"}>
                                        Secondary Hole: {elephant.lSecHole ? "Yes" : "No"}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Location Coordinates</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Latitude:</span>
                                <span className="info-value">{elephant.latitude || "Not recorded"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Longitude:</span>
                                <span className="info-value">{elephant.longitude || "Not recorded"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-footer">
                <Link to="/elephants" className="back-button">
                    Back to List
                </Link>
            </div>

            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete {elephant.name}? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteModal(false)} className="cancel-button">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="confirm-delete-button">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ElephantDetail

