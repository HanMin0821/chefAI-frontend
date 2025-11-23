import { useState } from "react";
import { FiClock, FiShoppingCart, FiActivity } from "react-icons/fi";
import api from "../../services/api";
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
    const [ingredients, setIngredients] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState(null);

    async function handleGenerate() {
        setError(null);
        if (!ingredients.trim()) {
            setError("Please enter at least one ingredient.");
            return;
        }
        setLoading(true);
        try {
            // Try the spec endpoint first, fall back to existing API path
            let resp;
            try {
                resp = await api.post("/recipe/generate", { ingredients });
            } catch (e) {
                resp = await api.post("/api/generate_recipe", { ingredients });
            }
            const r = resp.data;
            setRecipe(r);

            // If nutrition missing, request a quick estimate
            if (!r.nutrition || Object.keys(r.nutrition).length === 0) {
                try {
                    const nut = await api.post('/nutrition/calculate', { ingredients: r.ingredients || ingredients, servings: r.servings || 1 });
                    setRecipe(prev => ({...prev, nutrition: nut.data.nutrition}));
                } catch (e) {
                    // ignore nutrition failure for now
                    console.warn('Nutrition estimate failed', e);
                }
            }
        } catch (e) {
            console.error(e);
            setError(e?.response?.data?.error || "Failed to generate recipe");
        } finally {
            setLoading(false);
        }
    }

    async function handleRecalcNutrition() {
        if (!recipe) return;
        setError(null);
        try {
            const nut = await api.post('/nutrition/calculate', { ingredients: recipe.ingredients || ingredients, servings: recipe.servings || 1 });
            setRecipe(prev => ({ ...prev, nutrition: nut.data.nutrition }));
        } catch (e) {
            console.error(e);
            setError('Failed to calculate nutrition');
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
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (e) {
            console.error(e);
            setError("Failed to export PDF");
        }
    }

    return (
        <div className="main-container">
            <div className="left">
                <h1 className="app-title">ChefAI — Quick Recipe Generator</h1>
                <p className="subtitle">Enter ingredients you have and get a recipe, shopping list, and nutrition estimate.</p>

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
                        <button className="secondary-btn" onClick={handleRecalcNutrition} style={{marginLeft: '0.5rem'}}>Recalculate Nutrition</button>
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