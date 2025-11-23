import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/signup', { username, email, password });
            if (response.status === 201) {
                alert('Registration successful! Please login.');
                navigate('/sign_in');
            }
        } catch (err) {
            console.error('Signup failed:', err);
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignUp}>
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
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/sign_in">Sign In</Link>
            </p>
        </div>
    );
}

export default SignUp;