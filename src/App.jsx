import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ElephantList from "./components/ElephantList"
import ElephantDetail from "./components/ElephantDetail"
import ElephantForm from "./components/ElephantForm"
import Navbar from "./components/Navbar"
import "./App.css"

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/elephants" replace />} />
                        <Route path="/elephants" element={<ElephantList />} />
                        <Route path="/elephants/new" element={<ElephantForm />} />
                        <Route path="/elephants/:id" element={<ElephantDetail />} />
                        <Route path="/elephants/:id/edit" element={<ElephantForm />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App

