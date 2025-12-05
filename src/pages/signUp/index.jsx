import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import './index.css';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/signup", {
                username,
                email,
                password,
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));

                alert("Registration successful!");
                navigate("/main_page");
            } else {
                setError(response.data.message || "Registration failed");
            }
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Sign Up</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="submit-btn">Sign Up</button>
                </form>

                <p className="auth-footer">
                    Already have an account?
                    <Link to="/sign_in" className="auth-link">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;