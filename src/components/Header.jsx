import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/main_page");
    };

    const handleHistory = () => {
        navigate("/history");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/welcome");
    };

    return (
        <div className="header-container">
            <div className="header-left" onClick={handleHome}>
                <h2 className="header-title">ChefAI</h2>
            </div>
            <div className="header-right">
                <button onClick={handleHome} className="header-btn">Home</button>
                <button onClick={handleHistory} className="header-btn">History</button>
                <button onClick={handleLogout} className="header-btn logout-btn">Logout</button>
            </div>
        </div>
    );
}

export default Header;