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
        setError("");

        try {
            const response = await api.post("/api/signup", {
                username,
                email,
                password,
            });

            if (response.data.success) {
                // 保存 token 和 user
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
        <div style={{ padding: '20px' , maxWidth: '400px', margin: '0 auto' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSignUp}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ width: '100px', textAlign: 'right'}}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ width: '100px', textAlign: 'right'}}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ width: '100px', textAlign: 'right'}}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ flex: 1 }}
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