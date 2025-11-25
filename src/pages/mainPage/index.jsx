// src/pages/mainPage/index.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api";
import "./styles.css";

function MainPage() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/welcome");
      return;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u?.username) setUsername(u.username);
      } catch {
        // ignore
      }
    }
  }, [navigate]);

  async function handleGenerate() {
    setError("");
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);

    try {
      const resp = await api.post("/api/generate_recipe", { ingredients });

      if (!resp.data?.success) {
        setError(resp.data?.message || "Failed to generate recipe");
        setLoading(false);
        return;
      }

      let r = resp.data.data;
      setRecipe(r);
    } catch {
      setError("Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPdf() {
    if (!recipe) return;

    try {
      const resp = await api.post("/api/export_pdf", recipe, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${recipe.title || "recipe"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Failed to export PDF");
    }
  }

  const sampleText = "chicken breast, broccoli, rice";
  const hasRecipe = Boolean(recipe);

  function handleUseSample() {
    setIngredients(sampleText);
    setError("");
  }

  return (
    <div className="page-shell">
      <Header />

      <div className="main-container">
        <div className="header-row">
          <div>
            <h1 className="app-title">ChefAI — Quick Recipe Generator</h1>
            {username && (
              <p className="subtitle">Welcome, {username}!</p>
            )}
          </div>
        </div>

        <div className={`content-grid ${hasRecipe ? "content-grid--split" : ""}`}>
          <section className="generator-panel card-box">
            <p className="lead">
              Tell us what ingredients you have on hand and we will craft a full recipe with steps and nutrition in seconds.
            </p>

            <div className="input-group">
              <input
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. chicken breast, broccoli, rice"
                className="ingredients-input"
              />
              <button
                className="primary-btn"
                onClick={handleGenerate}
                disabled={loading}
                type="button"
              >
                {loading ? "Generating..." : "Generate Recipe"}
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="sample-chip" type="button" onClick={handleUseSample}>
              <span>Try sample:</span>
              <code>{sampleText}</code>
            </button>
          </section>

          {hasRecipe && (
            <section className="recipe-panel">
              <div className="card-box recipe-card">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">{recipe.title || "Recipe"}</h3>
                  </div>
                  <div className="card-actions">
                    <button
                      className="secondary-btn ghost-btn"
                      onClick={handleExportPdf}
                      type="button"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
                <div className="meta-row">
                  <div className="meta-item">Time: {recipe.time || "—"}</div>
                  <div className="meta-item">
                    Difficulty: {recipe.difficulty || "—"}
                  </div>
                  <div className="meta-item">
                    Servings: {recipe.servings || "—"}
                  </div>
                </div>

                <h4>Ingredients</h4>
                <ul>
                  {(recipe.ingredients || []).map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                <h4>Steps</h4>
                <ol>
                  {(recipe.steps || []).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>

                <h4>Missing Ingredients</h4>
                <ul>
                  {(recipe.missing_ingredients || []).length === 0 ? (
                    <li>Nothing — you have everything!</li>
                  ) : (
                    recipe.missing_ingredients.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))
                  )}
                </ul>

                <h4>Nutrition</h4>
                <div className="nutrition-grid">
                  <div className="nut-item">
                    Calories:{" "}
                    <strong>
                      {recipe.nutrition?.calories ?? "—"}
                    </strong>
                  </div>
                  <div className="nut-item">
                    Protein: {recipe.nutrition?.protein ?? "—"}
                  </div>
                  <div className="nut-item">
                    Fat: {recipe.nutrition?.fat ?? "—"}
                  </div>
                  <div className="nut-item">
                    Carbs: {recipe.nutrition?.carbs ?? "—"}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;