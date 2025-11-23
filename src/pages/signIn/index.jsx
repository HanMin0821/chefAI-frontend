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
        try {

            const response = await api.post('/api/login', { username, password });

            if (response.status === 200) {
                console.log('Login successful:', response.data);

                navigate('/main_page');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/sign_up">Sign Up</Link>
            </p>
        </div>
    );
}

export default SignIn;