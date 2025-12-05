import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import './index.css';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post('/api/login', { username, password });

            if (response.data.success) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                navigate('/main_page');
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Sign In</h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleLogin}>
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="submit-btn">Login</button>
                </form>

                <p className="auth-footer">
                    Don&apos;t have an account?
                    <Link to="/sign_up" className="link-text">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;