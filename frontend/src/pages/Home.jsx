import { useState, useEffect } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"
import "../styles/Home.css"
import Note from "../components/Note"
import "../styles/Home.css"

function Home() {
    const [notes, setNotes] = useState([])
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            navigate("/login")
            return
        }
        getNotes()
    }, [navigate])

    const getNotes = async () => {
        try {
            const response = await api.get("/api/notes/")
            setNotes(response.data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching notes:", error)
            setError("Failed to fetch notes")
            setLoading(false)
            if (error.response?.status === 401) {
                navigate("/login")
            }
        }
    }

    const deleteNote = async (id) => {
        try {
            console.log(`Deleting note with ID: ${id}`);
            const res = await api.delete(`/api/notes/delete/${id}/`);
            console.log('Delete response:', res);
            if (res.status === 204) {
                setNotes(notes.filter((note) => note.id !== id));
                alert("Note deleted successfully");
            } else {
                alert("Failed to delete note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            alert(`Error deleting note: ${error.message}`);
        }
    }

    const createNote = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post("/api/notes/", {
                title: title,
                content: content
            })
            if (res.status === 201) {
                setTitle("")
                setContent("")
                getNotes()
                alert("Note created successfully")
            }
        } catch (error) {
            console.error("Error creating note:", error)
            alert("Failed to create note")
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="home-container">
            <div className="notes-section">
                <h1>My Notes</h1>
                <div className="notes-list">
                    {notes.map((note) => (
                        <Note key={note.id} note={note} onDelete={deleteNote} />
                    ))}
                </div>
            </div>
            
            <div className="create-note-section">
                <h2>Create New Note</h2>
                <form onSubmit={createNote} className="create-note-form">
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="form-input"
                            rows="4"
                        />
                    </div>
                    
                    <button type="submit" className="form-button">
                        Create Note
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Home