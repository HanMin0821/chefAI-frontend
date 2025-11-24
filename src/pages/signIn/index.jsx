import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

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
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ width: '100px', textAlign: 'right' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ width: '100px', textAlign: 'right' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don&apos;t have an account? <Link to="/sign_up">Sign Up</Link>
            </p>
        </div>
    );
}

export default SignIn;