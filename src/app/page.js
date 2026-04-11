"use client";

import Planeta from "@/components/Planeta/Planeta";
import { useEffect, useState } from "react";
import "../app/page.css";

export default function Home() {

  const [planeta, setPlaneta] = useState(null);

  const [modo, setModo] = useState("today");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(1);

  const [presionado, setPresionado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "tAZ1RVaXXqPMjGRgSr7bbBOgKjpnzyklWxWjlXas";

  // LIMPIEZA AUTOMÁTICA AL CAMBIAR MODO (UX MEJOR)
  useEffect(() => {
    setPlaneta(null);
    setError(null);
    setPresionado(false);
  }, [modo]);

  useEffect(() => {

    if (!presionado) return;

    setLoading(true);
    setError(null);

    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    if (modo === "date" && date) {
      url += `&date=${date}`;
    }

    if (modo === "count") {
      url += `&count=${count}`;
    }

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Error en la API , tiene alrededor de un limite de 3-5 imagenes antes de fallar, a veces se pierde las imagenes");
        // me demore mucho para entender esta parte 
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPlaneta(data[0]);
        } else {
          setPlaneta(data);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [presionado]);

  const fetchData = () => {
    setPresionado(true);
  };

  const limpiar = () => {
    setPlaneta(null);
    setError(null);
    setLoading(false);
    setDate("");
    setCount(1);
    setModo("today");
    setPresionado(false);
  };

  return (
    <main>

      <div className="Principal">

        <h1 className="titulo-Principal">NASA IMAGENES</h1>

        
        <label>
          <input
            type="radio"
            value="today"
            checked={modo === "today"}
            onChange={(e) => setModo(e.target.value)}
          />
          Hoy
        </label>

        <label>
          <input
            type="radio"
            value="date"
            checked={modo === "date"}
            onChange={(e) => setModo(e.target.value)}
          />
          Fecha
        </label>

        <label>
          <input
            type="radio"
            value="count"
            checked={modo === "count"}
            onChange={(e) => setModo(e.target.value)}
          />
          Contador
        </label>

  
        {modo === "date" && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        )}

        {modo === "count" && (
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        )}

        
        <button
          className="botonBuscar-Principal"
          onClick={fetchData}
        >
          Buscar
        </button>

        <button
          className="botonBuscar-Principal"
          onClick={limpiar}
        >
          Limpiar
        </button>

      </div>


      {loading && <p className="estado">Cargando...</p>}
      {error && <p className="estado error">{error}</p>}

  
      {planeta && (
        <Planeta
          titulo={planeta.title}
          fecha={planeta.date}
          descripcion={planeta.explanation}
          imagen={planeta.url}
          imagenHD={planeta.hdurl}
          autor={planeta.copyright}
        />
      )}

    </main>
  );
}