"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, RadioButton } from "@/components";

const API_BASE = "https://api.nasa.gov/planetary/apod";
const API_KEY = "NaZAo6aiiDGDKhAtXgeQqTnsDYfTdmIou4SOxhMb";

export default function Home() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [mode, setMode] = useState("today");
  const [date, setDate] = useState(today);
  const [count, setCount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestUrl, setRequestUrl] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const url = useMemo(() => {
    const params = new URLSearchParams({ api_key: API_KEY });

    if (mode === "date") {
      params.set("date", date);
    }

    if (mode === "count") {
      params.set("count", String(count));
    }

    return `${API_BASE}?${params.toString()}`;
  }, [mode, date, count]);

  useEffect(() => {
    if (!requestUrl) {
      return;
    }

    async function fetchApod() {
      setLoading(true);
      setError("");
      setResult(null);

      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setResult(data);
      } catch (fetchError) {
        setError(
          fetchError?.message || "No fue posible obtener datos de la API de NASA."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchApod();
  }, [requestUrl, fetchTrigger]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (mode === "date" && !date) {
      setError("Debes seleccionar una fecha para la consulta.");
      return;
    }

    if (mode === "count") {
      const countValue = Number(count);
      if (!Number.isInteger(countValue) || countValue < 1 || countValue > 10) {
        setError("El valor de count debe ser un número entero entre 1 y 10.");
        return;
      }
    }

    setRequestUrl(url);
    setFetchTrigger((value) => value + 1);
  };

  const handleReset = () => {
    setMode("today");
    setDate(today);
    setCount(1);
    setResult(null);
    setError("");
    setRequestUrl("");
  };

  const renderMedia = (item) => {
    if (!item) return null;

    if (item.media_type === "video") {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-black">
          <iframe
            title={item.title || "NASA APOD video"}
            src={item.url}
            frameBorder="0"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    }

    return (
      <img
        src={item.url}
        alt={item.title || "NASA APOD"}
        className="h-auto w-full rounded-xl border border-gray-200 object-cover"
      />
    );
  };

  const renderResultCard = (item, index) => (
    <article
      key={`${item.date || index}-${item.title || index}`}
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">{item.title}</h2>
        <p className="text-sm text-slate-500">{item.date || "Fecha no disponible"}</p>
      </div>
      <div className="mb-6">{renderMedia(item)}</div>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{item.explanation}</p>
    </article>
  );

  const resolvedResults = Array.isArray(result) ? result : [result];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Ejercicio React: NASA APOD
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">
                1) Modo de consulta (radio)
              </p>
              <div className="flex flex-wrap gap-4">
                <RadioButton
                  name="apodMode"
                  value="today"
                  label="Foto de hoy"
                  checked={mode === "today"}
                  onChange={() => setMode("today")}
                />
                <RadioButton
                  name="apodMode"
                  value="date"
                  label="Fecha específica"
                  checked={mode === "date"}
                  onChange={() => setMode("date")}
                />
                <RadioButton
                  name="apodMode"
                  value="count"
                  label="Aleatorias (count)"
                  checked={mode === "count"}
                  onChange={() => setMode("count")}
                />
              </div>
            </div>

            {mode === "date" && (
              <div className="grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                <Input
                  id="apodDate"
                  label="2) Fecha"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  max={today}
                />
              </div>
            )}

            {mode === "count" && (
              <div className="grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                <Input
                  id="apodCount"
                  label="2) Cantidad de resultados"
                  type="number"
                  min={1}
                  max={10}
                  value={count}
                  onChange={(event) => setCount(Number(event.target.value))}
                />
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
              <Button type="submit" className="min-w-[180px]">
                Consultar NASA APOD
              </Button>
              <Button type="button" variant="secondary" onClick={handleReset}>
                Limpiar resultado
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              URL actual: <span className="font-medium text-slate-800">{requestUrl || url}</span>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>
        </section>

        {loading && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
            Cargando datos de la NASA...
          </section>
        )}

        {result && !loading && (
          <div className="space-y-6">
            {resolvedResults.map((item, index) => renderResultCard(item, index))}
          </div>
        )}
      </div>
    </main>
  );
}
