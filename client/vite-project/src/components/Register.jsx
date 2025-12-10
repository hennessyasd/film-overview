import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios-config";
import "../static/CSS/Auth.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/api/v1/auth/register", formData);
            navigate("/login");
        } catch (e) {
            setError("Registration failed. Username might be taken.");
            console.error(e);
        }
    };

    return (
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <h2>Register</h2>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="auth-btn">Sign Up</button>
                    </form>
                    <p className="auth-redirect">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
                <button className="back-button" onClick={() => navigate("/")}>
                    ← Back to movies
                </button>
            </div>
    );
};

export default Register;