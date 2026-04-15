"use client";

import { useState, useEffect } from "react";

// --- COMPONENTE REUTILIZABLE: RadioButton ---
const RadioButton = ({ label, value, selectedValue, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
    <input
      type="radio"
      name="modo"
      value={value}
      checked={selectedValue === value}
      onChange={() => onChange(value)}
      className="w-5 h-5 accent-blue-600"
    />
    {label}
  </label>
);

export default function NasaApodPage() {
  // --- ESTADOS ---
  const [modo, setModo] = useState("today");
  const [fecha, setFecha] = useState("2026-04-09");
  const [cantidad, setCantidad] = useState(1);
  const [resultados, setResultados] = useState([]); // arreglo []
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(0);

  const API_KEY = "ashA4BgQKxevaasZjqQ5dOcECYz9hGu9uprlFWh9";

  // --- CONSTRUCCIÓN DE URL ---
  const construirURL = () => {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
     if (modo === "date") url += `&date=${fecha}`;
    if (modo === "count") url += `&count=${cantidad}`;
    return url;
  };

  // --- USEEFFECT PARA CONSULTAS ---
  useEffect(() => {
    if (triggerFetch === 0) return;

    const consultarAPI = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(construirURL());
        if (!response.ok) throw new Error("Error en la respuesta de la NASA");
        const data = await response.json();

        setResultados(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
   
    }; 
    

    consultarAPI();
  }, [triggerFetch]);

  const handleConsultar = () => setTriggerFetch((prev) => prev + 1);
  const handleLimpiar = () => {
    setResultados([]);
    setError(null);
    setModo("today");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          Ejercicio React: NASA APOD
        </h1>

        {/* CONTENEDOR DE FILTROS */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-gray-700">
              1) Modo de consulta (radio)
            </h3>
            <div className="flex flex-wrap gap-6">
              <RadioButton
                label="Foto de hoy"
                value="today"
                selectedValue={modo}
                onChange={setModo}
              />
              <RadioButton
                label="Fecha específica"
                value="date"
                selectedValue={modo}
                onChange={setModo}
              />
              <RadioButton
                label="Aleatorias (count)"
                value="count"
                selectedValue={modo}
                onChange={setModo}
              />
            </div>
          </div>

          {modo === "date" && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-bold text-lg mb-2 text-gray-700">2) Fecha</h3>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full max-w-sm p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>
          )}

          {modo === "count" && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="font-bold text-lg mb-2 text-gray-700">
                2) Cantidad (1 a 10)
              </h3>
              <input
                type="number"
                min="1"
                max="10"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full max-w-[120px] p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleConsultar}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Consultando..." : "Consultar NASA APOD"}
            </button>
            <button
              onClick={handleLimpiar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all active:scale-95"
            >
              Limpiar resultado
            </button>
          </div>

          <p className="text-xs text-gray-400 font-mono break-all bg-white p-2 rounded border border-gray-100">
            URL actual: {construirURL()}
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium animate-bounce">
            ⚠️ Error: {error}
          </div>
        )}

        {/* RENDERIZADO DE RESULTADOS (MAP) */}
        <div className="space-y-8">
          {resultados.length > 0 &&
            !loading &&
            resultados.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <h2 className="text-2xl font-bold mb-1 text-gray-900">
                  {item.title}
                </h2>
                <p className="text-gray-500 mb-6 font-medium">{item.date}</p>

                {item.media_type === "image" ? (
                  <div className="rounded-2xl overflow-hidden shadow-lg mb-8 border border-gray-100 bg-gray-100">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline font-bold text-lg hover:text-blue-800 transition-colors"
                    >
                      Abrir video en una nueva pestaña
                    </a>
                  </div>
                )}

                <p className="text-gray-700 leading-relaxed text-lg text-justify">
                  {item.explanation}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
