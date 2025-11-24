import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../../api';

function Welcome() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get('/api/check_session');
                if (response.data?.logged_in) {
                    navigate('/main_page');
                }
            } catch (e) {
                // ignore - keep user on welcome page if check fails
            }
        };
        checkSession();
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to ChefAI</h1>
            <p>Your smart recipe generator.</p>
            <div style={{ marginTop: '30px' }}>
                <Link to="/sign_in">
                    <button style={{ marginRight: '20px', padding: '10px 20px' }}>Sign In</button>
                </Link>
                <Link to="/sign_up">
                    <button style={{ padding: '10px 20px' }}>Sign Up</button>
                </Link>
            </div>
        </div>
    );
}

export default Welcome;