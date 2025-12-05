import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';

function Welcome() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
            navigate("/main_page");
        }
    }, [navigate]);

    return (
        <div className="welcome-page">
            <h1>Welcome to ChefAI</h1>
            <p>Your smart recipe generator.</p>

            <div>
                <Link to="/sign_in">
                    <button className="welcome-btn btn-white">Sign In</button>
                </Link>
                <Link to="/sign_up">
                    <button className="welcome-btn btn-purple">Sign Up</button>
                </Link>
            </div>
        </div>
    );
}

export default Welcome;