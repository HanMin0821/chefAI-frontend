import { Link } from 'react-router-dom';

function Welcome() {
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