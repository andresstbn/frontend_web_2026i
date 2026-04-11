"use client";
import { useState, useEffect } from "react";
import { RadioButton, Button, Input } from "../components";

export default function Home() {
  const [modo, setModo] = useState("today");
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buscar, setBuscar] = useState(false);

  const apiKey = "fQHv7ubFHVTDqAuZ0hqJP5GM5eAcot6ulyxJePsp";

  useEffect(() => {
    if (!buscar) return;
    const fetchData = async () => { 
      setLoading(true);
      setError(null);
      setResultados(null);

      let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

      if (modo === "date") {
        if (!fecha) {
          setError("Selecciona una fecha.");
          setLoading(false);
          setBuscar(false);
          return;
        }
        url += `&date=${fecha}`;
      } else if (modo === "count") {
        url += `&count=${cantidad}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setResultados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setBuscar(false);
      }
    };

    fetchData();
  }, [buscar]);

  const limpiar = () => {
    setResultados(null);
    setError(null);
    setFecha("");
    setCantidad(1);
    setModo("today");
  };

  const renderItem = (item) => (
    <div
      key={item.date}
      className="mb-8 bg-blue-100 p-6"
    >
      <h2 className="mb-1 text-xl font-bold text-gray-900">{item.title}</h2>
      <p className="mb-4 text-sm text-gray-500">{item.date}</p>

      {item.media_type === "image" ? (
        <img src={item.url} alt={item.title} className="mb-4 w-full object-cover" />
      ) : (
        <iframe src={item.url} title={item.title} className="w-full" height="400" allowFullScreen />
      )}

      <p className="text-sm leading-relaxed text-gray-700">{item.explanation}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <h1 className="mb-2 text-3xl font-bold text-gray-900"> NASA API </h1>
        <p className="mb-8 text-gray-500">Miguel Ángel Garcés Peñaranda - 1152432</p>

        <div className="mb-6 flex gap-6">
          <RadioButton name="modo" value="today" label="Hoy" checked={modo === "today"} onChange={() => setModo("today")} />
          <RadioButton name="modo" value="date" label="Por Fecha" checked={modo === "date"} onChange={() => setModo("date")} />
          <RadioButton name="modo" value="count" label="Por Cantidad" checked={modo === "count"} onChange={() => setModo("count")} />
        </div>

        {modo === "date" && (
          <div className="mb-6">
            <Input id="fecha" type="date" value={fecha} max={new Date().toISOString().split("T")[0]} onChange={(e) => setFecha(e.target.value)} className = "text-gray-900" />
          </div>
        )}

        {modo === "count" && (
          <div className="mb-6">
            <Input id="cantidad" label="Cantidad" type="number" value={cantidad} min={1} max={10} onChange={(e) => setCantidad(e.target.value)} className = "text-gray-900"/>
          </div>
        )}

        <div className="mb-8 flex gap-3">
          <Button onClick={() => setBuscar(true)}> Consultar </Button>
          <Button onClick={limpiar}> Limpiar </Button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-400 p-4 text-sm"> {error} </p>
        )}

        {resultados && (
          <div>
            {Array.isArray(resultados)
              ? resultados.map((item) => renderItem(item))
              : renderItem(resultados)}
          </div>
        )}
      </div>
    </main>
  );
}