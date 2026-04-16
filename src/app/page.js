"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import RadioButton from "@/components/RadioButton";

const API_KEY = "penBPg1smov1ko3g1AHGVraEAAAPdW44reciaVjt";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

function buildApodUrl({ mode, date, count }) {
  const params = new URLSearchParams({ api_key: API_KEY });

  if (mode === "date") {
    params.append("date", date);
  } else if (mode === "count") {
    params.append("count", count);
  }

  return `${BASE_URL}?${params.toString()}`;
}

export default function Home() {
  const [mode, setMode] = useState("today");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [count, setCount] = useState("1");
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      return;
    }

    const controller = new AbortController();

    async function fetchApod() {
      setLoading(true);
      setError("");

      try {
        const url = buildApodUrl(query);
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setResults(Array.isArray(data) ? data : [data]);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setResults([]);
          setError(fetchError.message || "No se pudo consultar APOD.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchApod();

    return () => controller.abort();
  }, [query]);

  const handleConsult = () => {
    if (mode === "date") {
      if (!date) {
        setError("Selecciona una fecha válida.");
        return;
      }
    }

    if (mode === "count") {
      const countValue = Number(count);
      if (!count || Number.isNaN(countValue) || countValue < 1 || countValue > 10) {
        setError("Ingresa un número entre 1 y 10.");
        return;
      }
    }

    setError("");
    setQuery({ mode, date, count });
  };

  const handleClear = () => {
    setMode("today");
    setDate(new Date().toISOString().slice(0, 10));
    setCount("1");
    setQuery(null);
    setResults([]);
    setError("");
    setLoading(false);
  };

  const currentUrl = query ? buildApodUrl(query) : buildApodUrl({ mode, date, count });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-gray-200 bg-white/90 px-6 py-8 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Ejercicio React: NASA APOD</h1>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6">
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-slate-700">1) Modo de consulta (radio)</p>
              <div className="flex flex-wrap items-center gap-4">
                <RadioButton
                  name="apodMode"
                  value="today"
                  checked={mode === "today"}
                  onChange={() => setMode("today")}
                  label="Foto de hoy"
                />
                <RadioButton
                  name="apodMode"
                  value="date"
                  checked={mode === "date"}
                  onChange={() => setMode("date")}
                  label="Fecha específica"
                />
                <RadioButton
                  name="apodMode"
                  value="count"
                  checked={mode === "count"}
                  onChange={() => setMode("count")}
                  label="Aleatorias (count)"
                />
              </div>
            </div>

            {mode === "date" && (
              <div className="mb-6 max-w-sm">
                <Input
                  id="apod-date"
                  label="2) Fecha"
                  type="date"
                  value={date}
                  className="text-gray-900"
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            )}

            {mode === "count" && (
              <div className="mb-6 max-w-sm">
                <Input
                  id="apod-count"
                  label="2) Cantidad"
                  type="number"
                  min="1"
                  max="10"
                  className="text-gray-900"
                  value={count}
                  onChange={(event) => setCount(event.target.value)}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleConsult} disabled={loading}>
                Consultar NASA APOD
              </Button>
              <Button variant="secondary" onClick={handleClear}>
                Limpiar resultado
              </Button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-950/5 px-4 py-3 text-xs text-slate-600">
              URL actual: <span className="font-medium text-slate-900 break-words">{currentUrl}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Cargando información de NASA APOD...
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-6">
              {results.map((item) => (
                <article key={item.date || item.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">{item.title}</h2>
                      <p className="text-sm text-slate-600">{item.date}</p>
                    </div>
                    {item.copyright && <span className="text-sm text-slate-500">© {item.copyright}</span>}
                  </div>

                  {item.media_type === "video" ? (
                    <div className="aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-black">
                      <iframe
                        title={item.title}
                        src={item.url}
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-auto w-full rounded-3xl border border-slate-200 object-cover"
                    />
                  )}

                  <p className="mt-5 text-sm leading-7 text-slate-700">{item.explanation}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
