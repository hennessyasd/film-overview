import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios-config";
import { AuthContext } from "../context/AuthProvider";
import "../static/CSS/Auth.css";

const Login = () => {
    const { login } = useContext(AuthContext);
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
            const response = await api.post("/api/v1/auth/login", formData);
            const token = response.data.token;
            const roles = response.data.roles;

            login(token, formData.username, roles);
            navigate("/");
        } catch (e) {
            setError("Invalid username or password");
            console.error(e);
        }
    };

    return (
        <>
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2>Login</h2>
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
                    <button type="submit" className="auth-btn">Sign In</button>
                </form>
                <p className="auth-redirect">
                    No account? <Link to="/register">Register here</Link>
                </p>
            </div>
            <button className="back-button" onClick={() => navigate("/")}>
                ← Back to movies
            </button>
        </div>
        </>
    );
};

export default Login;