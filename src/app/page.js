"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [count, setCount] = useState(1);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("today");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`;

      if (mode === "date" && date !== "") {
        url += `&date=${date}`;
      }

      if (mode === "cousnt") {
        url += `&count=${count}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      if (result.error) {
        setError(result.error.message);
        setData([]);
      } else {
        setData(Array.isArray(result) ? result : [result]);
      }
    } catch (err) {
      setError("Error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  const limpiar = () => {
    setData([]);
    setDate("");
    setCount(1);
    setError(null);
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", padding: "40px" }}>
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          maxWidth: "700px",
          margin: "auto",
          color: "#111827",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>
          CONSULTA API NASA 🚀
        </h1>

        {/* MODO */}
        <h3 style={{ marginTop: "20px" }}>1) Modo de consulta</h3>

        <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
          <label>
            <input
              type="radio"
              value="today"
              checked={mode === "today"}
              onChange={(e) => setMode(e.target.value)}
            />
            Foto de hoy
          </label>

          <label>
            <input
              type="radio"
              value="date"
              checked={mode === "date"}
              onChange={(e) => setMode(e.target.value)}
            />
            Fecha específica
          </label>

          <label>
            <input
              type="radio"
              value="count"
              checked={mode === "count"}
              onChange={(e) => setMode(e.target.value)}
            />
            Aleatorias
          </label>
        </div>

        {/* INPUT FECHA */}
        {mode === "date" && (
          <div style={{ marginTop: "20px" }}>
            <h3>2) Fecha</h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "5px"
              }}
            />
          </div>
        )}

        {/* INPUT COUNT */}
        {mode === "count" && (
          <div style={{ marginTop: "20px" }}>
            <h3>2) Cantidad</h3>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "5px"
              }}
            />
          </div>
        )}

        {/* BOTONES */}
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={fetchData}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Consultar NASA APOD
          </button>

          <button
            onClick={limpiar}
            style={{
              marginLeft: "10px",
              background: "#e5e7eb",
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Limpiar resultado
          </button>
        </div>

        {/* ESTADOS */}
        {loading && <p style={{ marginTop: "15px" }}>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* RESULTADOS */}
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginTop: "20px",
              borderRadius: "10px"
            }}
          >
            <h2>{item.title}</h2>
            <p>{item.date}</p>

            {item.media_type === "image" ? (
              <img src={item.url} alt={item.title} width="100%" />
            ) : (
              <a href={item.url} target="_blank">
                Abrir video en una nueva pestaña
              </a>
            )}

            <p>{item.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}