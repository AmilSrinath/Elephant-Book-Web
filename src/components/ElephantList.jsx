"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./ElephantList.css"

const ElephantList = () => {
    const [elephants, setElephants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [filterGender, setFilterGender] = useState("")

    useEffect(() => {
        const fetchElephants = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/elephants")
                setElephants(response.data)
                setLoading(false)
            } catch (err) {
                setError("Failed to fetch elephants")
                setLoading(false)
                console.error(err)
            }
        }

        fetchElephants()
    }, [])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleFilterGender = (e) => {
        setFilterGender(e.target.value)
    }

    const filteredElephants = elephants.filter(
        (elephant) =>
            elephant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterGender === "" || elephant.gender === filterGender),
    )

    if (loading) {
        return <div className="loading">Loading elephants...</div>
    }

    if (error) {
        return <div className="error-message">{error}</div>
    }

    return (
        <div className="elephant-list-container">
            <div className="list-header">
                <h2>Elephant Database</h2>
                <Link to="/elephants/new" className="add-button">
                    Add New Elephant
                </Link>
            </div>

            <div className="filters">
                <div className="search-box">
                    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} />
                </div>

                <div className="filter-box">
                    <select value={filterGender} onChange={handleFilterGender}>
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unknown">Unknown</option>
                    </select>
                </div>
            </div>

            {filteredElephants.length === 0 ? (
                <div className="no-results">No elephants found</div>
            ) : (
                <div className="elephant-grid">
                    {filteredElephants.map((elephant) => (
                        <Link to={`/elephants/${elephant.id}`} key={elephant._id} className="elephant-card">
                            <div className="elephant-image">
                                {elephant.images && elephant.images.length > 0 ? (
                                    <img src={`http://localhost:5000${elephant.images[0]}`} alt={elephant.name} />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="elephant-info">
                                <h3>{elephant.name}</h3>
                                <p>
                                    <strong>Location:</strong> {elephant.location}
                                </p>
                                <p>
                                    <strong>Gender:</strong> {elephant.gender}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(elephant.date).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ElephantList

