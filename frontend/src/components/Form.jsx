import {useState} from "react"
import api from "../api"
import {useNavigate} from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "../components/LoadingIndicator"

function Form({route, method}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(true)
        setError("")
        e.preventDefault()
        try{
            console.log('Submitting to:', route)  // Debug log
            const res = await api.post(route, {username, password})
            console.log('Response:', res)  // Debug log
            if (method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            }else{
                navigate("/login")
            }
        }catch(error){
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            })
            setError(
                error.response?.data?.detail || 
                error.response?.data?.message || 
                error.message || 
                'An error occurred'
            )
        }finally{
            setLoading(false)
        }
    }

    const title = method === "login" ? "Login" : "Register"

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{title}</h1>
            {error && <div className="error-message">{error}</div>}
            <input 
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input 
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {loading && <LoadingIndicator />}
            <button type="submit" className="form-button" disabled={loading}>
                {loading ? "Loading..." : title}
            </button>
        </form>
    )
}

export default Form