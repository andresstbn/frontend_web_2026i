"use client";

import { useState, useEffect } from "react";
import RadioButton from "./RadioButton";
import Input from "./Input";
import Button from "./Button";

export default function APODViewer() {
  const [queryType, setQueryType] = useState("today");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
  const baseUrl = "https://api.nasa.gov/planetary/apod";

  const buildUrl = () => {
    let url = `${baseUrl}?api_key=${apiKey}`;

    if (queryType === "today") {
      return url;
    } else if (queryType === "date" && date) {
      return `${url}&date=${date}`;
    } else if (queryType === "count") {
      return `${url}&count=${Math.min(Math.max(parseInt(count) || 1, 1), 10)}`;
    }

    return null;
  };

  const fetchAPOD = async () => {
    const url = buildUrl();

    if (!url) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || "Error al consultar la API");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
    setDate("");
    setCount(5);
    setQueryType("today");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        NASA APOD Viewer
      </h1>

      {/* Query Type Selection */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Tipo de Consulta
        </h2>

        <div className="flex flex-col gap-4">
          <RadioButton
            id="today"
            name="queryType"
            value="today"
            label="Hoy"
            checked={queryType === "today"}
            onChange={(e) => setQueryType(e.target.value)}
          />

          <RadioButton
            id="date"
            name="queryType"
            value="date"
            label="Por Fecha"
            checked={queryType === "date"}
            onChange={(e) => setQueryType(e.target.value)}
          />

          <RadioButton
            id="count"
            name="queryType"
            value="count"
            label="Múltiples (1-10)"
            checked={queryType === "count"}
            onChange={(e) => setQueryType(e.target.value)}
          />
        </div>

        {/* Conditional Inputs */}
        <div className="mt-6 space-y-4">
          {queryType === "date" && (
            <Input
              id="date-input"
              type="date"
              label="Selecciona una fecha"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          )}

          {queryType === "count" && (
            <Input
              id="count-input"
              type="number"
              label="Cantidad de imágenes (1-10)"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="10"
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          onClick={fetchAPOD}
          disabled={loading}
          className="flex-1"
        >
          {loading ? "Cargando..." : "Consultar"}
        </Button>
        <Button
          onClick={clearResults}
          variant="secondary"
          className="flex-1"
        >
          Limpiar
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results && results.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resultados
          </h2>

          {results.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700"
            >
              {/* Title */}
              {item.title && (
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
              )}

              {/* Date */}
              {item.date && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Fecha:</strong> {new Date(item.date).toLocaleDateString("es-ES")}
                </p>
              )}

              {/* Copyright */}
              {item.copyright && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 italic">
                  © {item.copyright}
                </p>
              )}

              {/* Image or Video */}
              <div className="mb-4">
                {item.media_type === "video" ? (
                  <iframe
                    width="100%"
                    height="400"
                    src={item.url}
                    title={item.title}
                    className="rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full rounded-lg object-cover max-h-96"
                  />
                )}
              </div>

              {/* Description */}
              {item.explanation && (
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  <strong>Descripción:</strong>
                  <p className="mt-2">{item.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!results && !error && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Selecciona los parámetros y consulta para ver el APOD</p>
        </div>
      )}
    </div>
  );
}
