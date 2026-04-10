"use client";

import { useState } from "react";
import RadioButton from "../components/RadioButton";

export default function Home() {
  const [option, setOption] = useState("today");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(1);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAPOD = async () => {
    setLoading(true);
    setError(null);

    let url = `https://api.nasa.gov/planetary/apod?api_key=tUyOGTVAZK5pgHm9vWHD0w3T483PCAbjk4JfTxgD`;

    if (option === "date") url += `&date=${date}`;
    if (option === "count") url += `&count=${count}`;

    try {
      const res = await fetch(url);
      const result = await res.json();
      setData(result);
    } catch {
      setError("Error al consultar la API");
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setDate("");
    setCount(1);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 NASA APOD</h1>

      <div style={styles.card}>
        {/* Radios */}
        <div style={styles.radioGroup}>
          <RadioButton label="Today" value="today" checked={option==="today"} onChange={()=>setOption("today")} />
          <RadioButton label="Date" value="date" checked={option==="date"} onChange={()=>setOption("date")} />
          <RadioButton label="Count" value="count" checked={option==="count"} onChange={()=>setOption("count")} />
        </div>

        {/* Inputs */}
        {option === "date" && (
          <input style={styles.input} type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        )}

        {option === "count" && (
          <input style={styles.input} type="number" min="1" max="10" value={count} onChange={(e)=>setCount(e.target.value)} />
        )}

        {/* Botones */}
        <div style={styles.buttons}>
          <button style={styles.buttonPrimary} onClick={fetchAPOD}>Consultar</button>
          <button style={styles.buttonSecondary} onClick={clearData}>Limpiar</button>
        </div>
      </div>

      {/* Estados */}
      {loading && <p style={styles.info}>Cargando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Resultados */}
      <div style={styles.results}>
        {data &&
          (Array.isArray(data) ? data : [data]).map((item, index) => (
            <div key={index} style={styles.resultCard}>
              <h2>{item.title}</h2>
              <p>{item.date}</p>

              {item.media_type === "image" ? (
                <img src={item.url} alt={item.title} style={styles.image} />
              ) : (
                <iframe src={item.url} title={item.title} style={styles.video}></iframe>
              )}

              <p>{item.explanation}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    background: "#0b0f19",
    color: "white",
    minHeight: "100vh",
    padding: "20px"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  card: {
    background: "#1c2333",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)"
  },
  radioGroup: {
    marginBottom: "15px"
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "none",
    marginBottom: "10px",
    width: "100%"
  },
  buttons: {
    display: "flex",
    gap: "10px"
  },
  buttonPrimary: {
    padding: "10px",
    background: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  buttonSecondary: {
    padding: "10px",
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  results: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  resultCard: {
    background: "#1c2333",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    maxWidth: "600px"
  },
  image: {
    width: "100%",
    borderRadius: "10px"
  },
  video: {
    width: "100%",
    height: "300px"
  },
  info: {
    textAlign: "center"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};
