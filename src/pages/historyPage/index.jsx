import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import api from "../../api";
import "./styles.css";

function normalizeArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeNutrition(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function HistoryPage() {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [recalcLoading, setRecalcLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const resp = await api.get("/api/history");
        if (resp.data.success) {
          setRecipes(resp.data.data);
          setSelected(resp.data.data[0] || null);
        } else {
          setError(resp.data.message || "Failed to load history");
        }
      } catch {
        setError("Failed to load history");
      }
    }
    fetchHistory();
  }, []);

  const parsedSelected = useMemo(() => {
    if (!selected) return null;
    return {
      ...selected,
      steps: normalizeArrayField(selected.steps),
      missing_ingredients: normalizeArrayField(selected.missing_ingredients),
      ingredients: selected.ingredients || [],
      nutrition: normalizeNutrition(selected.nutrition),
    };
  }, [selected]);

  const handleDownloadPdf = async () => {
    if (!parsedSelected) return;
    try {
      const resp = await api.post("/api/export_pdf", parsedSelected, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([resp.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${parsedSelected.title || "recipe"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  const handleRecalculateNutrition = async () => {
    if (!parsedSelected) return;
    setRecalcLoading(true);
    try {
      const resp = await api.post("/api/calculate_nutrition", {
        ingredients: parsedSelected.ingredients,
        servings: parsedSelected.servings || 1,
      });
      if (resp.data?.success) {
        const nutrition = resp.data.data.nutrition;
        setRecipes((prev) =>
          prev.map((r) => (r.id === parsedSelected.id ? { ...r, nutrition } : r))
        );
        setSelected((prev) => (prev ? { ...prev, nutrition } : prev));
      } else {
        setError(resp.data?.message || "Failed to recalculate nutrition");
      }
    } catch {
      setError("Failed to recalculate nutrition");
    } finally {
      setRecalcLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Header />

      <div className="main-container">
        <div className="header-row">
          <div>
            <h1 className="app-title">Recipe History</h1>
            <p className="subtitle">Browse what you generated earlier and export them anytime.</p>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className={`content-grid ${parsedSelected ? "content-grid--split" : ""}`}>
          <section className="card-box history-panel">
            <div className="panel-header">
              <h3 className="panel-title">Saved recipes</h3>
              <p className="panel-hint">{recipes.length} total</p>
            </div>

            <div className="history-list">
              {recipes.length === 0 && <p className="empty-state">No history yet.</p>}

              {recipes.map((r) => {
                const isActive = parsedSelected?.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelected(r)}
                    className={`history-chip ${isActive ? "history-chip--active" : ""}`}
                  >
                    <div>
                      <p className="chip-title">{r.title || "Untitled recipe"}</p>
                      <p className="chip-date">{new Date(r.created_at).toLocaleString()}</p>
                    </div>
                    <p className="chip-ingredients">
                      {(r.ingredients || []).slice(0, 3).join(", ")}
                      {(r.ingredients || []).length > 3 && " …"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card-box detail-panel">
            {parsedSelected ? (
              <>
                <div className="card-header">
                  <div>
                    <h3 className="card-title">{parsedSelected.title || "Recipe"}</h3>
                    <p className="chip-date">
                      {parsedSelected.created_at
                        ? new Date(parsedSelected.created_at).toLocaleString()
                        : ""}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button className="secondary-btn ghost-btn" type="button" onClick={handleDownloadPdf}>
                      Download PDF
                    </button>
                    <button
                      className="secondary-btn outline-btn"
                      type="button"
                      onClick={handleRecalculateNutrition}
                      disabled={recalcLoading}
                    >
                      {recalcLoading ? "Recalculating..." : "Recalculate Nutrition"}
                    </button>
                  </div>
                </div>

                <div className="meta-row">
                  <div className="meta-item">Time: {parsedSelected.time || "—"}</div>
                  <div className="meta-item">Difficulty: {parsedSelected.difficulty || "—"}</div>
                  <div className="meta-item">Servings: {parsedSelected.servings || "—"}</div>
                </div>

                <h4>Ingredients</h4>
                <ul>
                  {parsedSelected.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                {parsedSelected.steps.length > 0 && (
                  <>
                    <h4>Steps</h4>
                    <ol>
                      {parsedSelected.steps.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ol>
                  </>
                )}

                {parsedSelected.missing_ingredients.length > 0 && (
                  <>
                    <h4>Missing Ingredients</h4>
                    <ul>
                      {parsedSelected.missing_ingredients.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </>
                )}

                {parsedSelected.nutrition && (
                  <>
                    <h4>Nutrition</h4>
                    <div className="nutrition-grid">
                      <div className="nut-item">
                        Calories: <strong>{parsedSelected.nutrition.calories ?? "—"}</strong>
                      </div>
                      <div className="nut-item">Protein: {parsedSelected.nutrition.protein ?? "—"}</div>
                      <div className="nut-item">Fat: {parsedSelected.nutrition.fat ?? "—"}</div>
                      <div className="nut-item">Carbs: {parsedSelected.nutrition.carbs ?? "—"}</div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>Select a recipe on the left to view its full details.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;