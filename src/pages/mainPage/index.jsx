import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FiClock, FiShoppingCart, FiActivity, FiUser } from "react-icons/fi";
import api from "../../api";
import "./styles.css";

function Card({ children, title }) {
    return (
        <div className="card-box">
            {title && <h3 className="card-title">{title}</h3>}
            <div>{children}</div>
        </div>
    );
}

function MainPage() {
    const navigate = useNavigate();

    const [ingredients, setIngredients] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState(null);

    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
            navigate("/welcome");
            return;
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // fallback: 如果未来你想从服务器获取用户数据，也可以在这里写
            navigate("/welcome");
        }
    }, [navigate]);

    async function handleGenerate() {
        setError(null);

        if (!ingredients.trim()) {
            setError("Please enter at least one ingredient.");
            return;
        }

        setLoading(true);
        try {
            const resp = await api.post("/api/generate_recipe", { ingredients });
            const r = resp.data.data;
            setRecipe(r);

        } catch (e) {
            if (e.response?.status === 401) {
                navigate("/welcome");
                return;
            }
            setError(e?.response?.data?.message || "Failed to generate recipe");
        } finally {
            setLoading(false);
        }
    }

    async function handleRecalcNutrition() {
        if (!recipe) return;
        setError(null);
        try {
            const nut = await api.post("/api/calculate_nutrition", { 
                ingredients: recipe.ingredients || ingredients, 
                servings: recipe.servings || 1 
            });
            setRecipe(prev => ({ ...prev, nutrition: nut.data.data.nutrition }));
        } catch (e) {
            console.error(e);
            setError("Failed to calculate nutrition");
        }
    }

    async function handleExportPdf() {
        if (!recipe) return;
        try {
            const resp = await api.post("/api/export_pdf", recipe, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([resp.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${recipe.title || 'recipe'}.pdf`);
            link.click();
        } catch (e) {
            console.error(e);
            setError("Failed to export PDF");
        }
    }

    async function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/welcome");
    }

    function handleViewHistory() {
        navigate("/history");
        setShowDropdown(false);
    }

    return (
        <div className="main-container">
            <div className="left">
                <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="app-title">ChefAI — Quick Recipe Generator</h1>
                        {user && <p className="subtitle" style={{ marginTop: '0.2rem' }}>Welcome, {user.username}!</p>}
                    </div>


                    <div style={{ position: 'relative' }}>

                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#f0f0f0',
                                transition: 'background 0.2s'
                            }}
                            title="User Menu"
                        >
                            <FiUser size={24} color="#333" />
                        </div>


                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '110%',
                                right: 0,
                                backgroundColor: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                borderRadius: '8px',
                                padding: '8px 0',
                                minWidth: '150px',
                                zIndex: 1000,
                                border: '1px solid #eee'
                            }}>
                                <div
                                    onClick={handleViewHistory}
                                    className="dropdown-item"
                                    style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '14px', color: '#333' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    View History
                                </div>
                                <div
                                    onClick={handleLogout}
                                    className="dropdown-item"
                                    style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '14px', color: '#d9534f' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    Log Out
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                <div className="input-group">
                    <input
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g. chicken breast, broccoli, rice"
                        className="ingredients-input"
                    />
                    <button className="primary-btn" onClick={handleGenerate} disabled={loading}>
                        {loading ? "Generating..." : "Generate Recipe"}
                    </button>
                </div>

                {error && <div className="error">{error}</div>}

                {recipe && (
                    <div className="actions-row">
                        <button className="secondary-btn" onClick={handleExportPdf}>Export PDF</button>
                        <button className="secondary-btn" onClick={handleRecalcNutrition} style={{ marginLeft: '0.5rem' }}>Recalculate Nutrition</button>
                    </div>
                )}
            </div>

            <div className="right">
                {!recipe && (
                    <Card title="Try a sample">
                        <p className="muted">Sample input: <code>chicken breast, broccoli, rice</code></p>
                    </Card>
                )}

                {recipe && (
                    <>
                        <Card title={recipe.title || 'Recipe'}>
                            <div className="meta-row">
                                <div className="meta-item"><FiClock /> {recipe.time || '—'}</div>
                                <div className="meta-item">Difficulty: {recipe.difficulty || '—'}</div>
                                <div className="meta-item">Servings: {recipe.servings || '—'}</div>
                            </div>
                            <h4>Ingredients</h4>
                            <ul>
                                {(recipe.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </Card>

                        <Card title="Steps">
                            <ol>
                                {(recipe.steps || []).map((s, i) => <li key={i}>{s}</li>)}
                            </ol>
                        </Card>

                        <Card title="Shopping List">
                            <ul>
                                {(recipe.missing_ingredients || []).length === 0 && <li>Nothing — you have what you need!</li>}
                                {(recipe.missing_ingredients || []).map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                        </Card>

                        <Card title="Nutrition">
                            <div className="nutrition-grid">
                                <div className="nut-item">Calories: <strong>{recipe.nutrition?.calories ?? '—'}</strong></div>
                                <div className="nut-item">Protein: {recipe.nutrition?.protein ?? '—'}</div>
                                <div className="nut-item">Fat: {recipe.nutrition?.fat ?? '—'}</div>
                                <div className="nut-item">Carbs: {recipe.nutrition?.carbs ?? '—'}</div>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}

export default MainPage;