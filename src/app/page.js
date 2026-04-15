"use client";

import { useState, useEffect } from "react";

const API_KEY = "NiQAm9c6CJKtNRy5BHcdcDda5kyvj0TdwnhXvK8Q";
const BASE_URL = "https://api.nasa.gov/planetary/apod";


function RadioButton({ id, name, value, label, checked, onChange }) {
  return (
    <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
function ApodCard({ item }) {
  const isVideo = item.media_type === "video";
  return (
    <div>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.2rem" }}>{item.title}</h2>
      <p style={{ fontSize: "0.85rem", color: "#555", margin: "0 0 1rem" }}>{item.date}</p>

    {isVideo ? (
  <div style={{ marginBottom: "1rem" }}>
    <iframe
      src={item.url}
      title={item.title}
      width="100%"
      height="400"
      style={{ borderRadius: 8, border: "none" }}
      allowFullScreen
    />
  </div>
) : (
        <img src={item.hdurl || item.url} alt={item.title}
          style={{ width: "100%", maxHeight: 480, objectFit: "cover", borderRadius: 8, display: "block", marginBottom: "1rem" }}
        />
      )}

      <p style={{ fontSize: "0.93rem", lineHeight: 1.7, color: "#222", margin: 0 }}>{item.explanation}</p>
      {item.copyright && (
        <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.6rem", textAlign: "right" }}>© {item.copyright}</p>
      )}
    </div>
  );
}
export default function Home() {
  const [mode, setMode] = useState("today");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(3);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function buildUrl() {
    const params = new URLSearchParams({ api_key: API_KEY });
    if (mode === "date" && date) params.append("date", date);
    else if (mode === "count") params.append("count", count);
    return `${BASE_URL}?${params.toString()}`;
  }

  useEffect(() => {
    if (mode === "today") {
      fetchApod();
    }
  }, [mode]);

  async function fetchApod() {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || `Error ${res.status}`);
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || "Error al consultar la API.");
    } finally {
      setLoading(false);
    }
  }
  function handleClear() {
    setResults([]);
    setError(null);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
    setResults([]);
    setError(null);
  }
  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Ejercicio React: NASA APOD
      </h1>

      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: "1.25rem", marginBottom: "2rem", background: "#fafafa" }}>

        <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>1) Modo de consulta</p>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <RadioButton id="mode-today" name="mode" value="today" label="Foto de hoy"        checked={mode === "today"} onChange={handleModeChange} />
          <RadioButton id="mode-date"  name="mode" value="date"  label="Fecha específica"   checked={mode === "date"}  onChange={handleModeChange} />
          <RadioButton id="mode-count" name="mode" value="count" label="Aleatorias (count)" checked={mode === "count"} onChange={handleModeChange} />
        </div>

        {mode === "date" && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>2) Fecha</p>
            <input type="date" value={date}
              max={new Date().toISOString().split("T")[0]} min="1995-06-16"
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: "0.4rem 0.6rem", border: "1px solid #ccc", borderRadius: 4, fontSize: "0.95rem" }}
            />
          </div>
        )}

        {mode === "count" && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>2) Cantidad (1–10)</p>
            <input type="number" value={count} min={1} max={10}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{ padding: "0.4rem 0.6rem", border: "1px solid #ccc", borderRadius: 4, fontSize: "0.95rem", width: 80 }}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <button onClick={fetchApod}
            disabled={loading || (mode === "date" && !date)}
            style={{ padding: "0.5rem 1.25rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", opacity: (loading || (mode === "date" && !date)) ? 0.6 : 1 }}>
            {loading ? "Consultando..." : "Consultar NASA APOD"}
          </button>
          <button onClick={handleClear}
            style={{ padding: "0.5rem 1.1rem", background: "#e5e7eb", color: "#333", border: "1px solid #ccc", borderRadius: 6, fontSize: "0.95rem", cursor: "pointer" }}>
            Limpiar resultado
          </button>
        </div>

        <p style={{ fontSize: "0.78rem", color: "#555", wordBreak: "break-all", margin: 0 }}>
          <strong>URL actual:</strong> {buildUrl()}
        </p>
      </div>

      {error && (
        <div style={{ background: "#fff5f5", border: "1px solid #f87171", color: "#b91c1c", borderRadius: 8, padding: "0.9rem 1.1rem", marginBottom: "1.5rem" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && <p style={{ textAlign: "center", color: "#555" }}>Cargando...</p>}

      {!loading && results.length > 0 && (
        <section style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {results.map((item) => (
            <ApodCard key={`${item.date}-${item.title}`} item={item} />
          ))}
        </section>
      )}
    </main>
  );
}