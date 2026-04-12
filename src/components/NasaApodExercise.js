"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, RadioButton } from "@/components";

const BASE = "https://api.nasa.gov/planetary/apod";

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function buildParams(mode, date, count) {
  const key = process.env.NEXT_PUBLIC_NASA_API_KEY ?? "";
  const params = new URLSearchParams({ api_key: key });
  if (mode === "date") params.set("date", date);
  if (mode === "count") {
    const n = Math.min(10, Math.max(1, Number(count) || 1));
    params.set("count", String(n));
  }
  return { key, params };
}

function displayUrl(mode, date, count) {
  const { key, params } = buildParams(mode, date, count);
  const q = params.toString().replace(key, "[YOUR_KEY]");
  return `${BASE}?${q}`;
}

function fetchUrl(mode, date, count) {
  const { params } = buildParams(mode, date, count);
  return `${BASE}?${params.toString()}`;
}

function formatEsDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("es-ES");
}

export default function NasaApodExercise() {
  const [mode, setMode] = useState("today");
  const [date, setDate] = useState(isoToday);
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [queryToken, setQueryToken] = useState(0);
  const paramsRef = useRef({ mode, date, count });
  paramsRef.current = { mode, date, count };

  useEffect(() => {
    if (queryToken === 0) return;

    const { mode: m, date: d, count: c } = paramsRef.current;
    const url = fetchUrl(m, d, c);
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      if (!apiKey) {
        setError("Falta NEXT_PUBLIC_NASA_API_KEY en el entorno.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(url);
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok) {
          const msg =
            data?.error?.message ||
            data?.msg ||
            `Error HTTP ${res.status}`;
          setError(msg);
          setResults(null);
          return;
        }
        if (data?.error) {
          setError(data.error.message || "Error de la API");
          setResults(null);
          return;
        }
        setResults(data);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Error de red");
          setResults(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [queryToken]);

  function handleConsultar() {
    setQueryToken((t) => t + 1);
  }

  function handleLimpiar() {
    setResults(null);
    setError(null);
    setLoading(false);
  }

  const items = results
    ? Array.isArray(results)
      ? results
      : [results]
    : [];

  const showResultsCard = loading || error || items.length > 0;

  return (
    <div className="min-h-full bg-zinc-100 px-4 py-10 font-sans text-gray-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Ejercicio React: NASA APOD
        </h1>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-800">
            1) Modo de consulta (radio)
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
            <RadioButton
              id="mode-today"
              name="queryMode"
              value="today"
              label="Foto de hoy"
              checked={mode === "today"}
              onChange={() => setMode("today")}
            />
            <RadioButton
              id="mode-date"
              name="queryMode"
              value="date"
              label="Fecha específica"
              checked={mode === "date"}
              onChange={() => setMode("date")}
            />
            <RadioButton
              id="mode-count"
              name="queryMode"
              value="count"
              label="Aleatorias (count)"
              checked={mode === "count"}
              onChange={() => setMode("count")}
            />
          </div>

          {mode === "date" && (
            <div className="mt-4">
              <Input
                id="apod-date"
                label="2) Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {mode === "count" && (
            <div className="mt-4">
              <Input
                id="apod-count"
                label="2) Cantidad (1 a 10)"
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isNaN(n)) setCount(1);
                  else setCount(Math.min(10, Math.max(1, n)));
                }}
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={handleConsultar}>
              Consultar NASA APOD
            </Button>
            <Button type="button" variant="secondary" onClick={handleLimpiar}>
              Limpiar resultado
            </Button>
          </div>

          <p className="mt-4 break-all font-mono text-xs text-gray-500">
            URL actual: {displayUrl(mode, date, count)}
          </p>
        </section>

        {showResultsCard && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {loading && (
              <p className="text-sm text-gray-600">Cargando…</p>
            )}
            {!loading && error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {!loading && !error && items.length === 0 && (
              <p className="text-sm text-gray-600">Sin datos.</p>
            )}
            {!loading &&
              !error &&
              items.map((item, i) => (
                <article
                  key={`${item.date}-${item.title}-${i}`}
                  className={i > 0 ? "mt-10 border-t border-gray-100 pt-10" : ""}
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatEsDate(item.date)}
                  </p>
                  <div className="mt-4">
                    {item.media_type === "video" ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
                      >
                        Abrir video en una nueva pestaña
                      </a>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title || "NASA APOD"}
                        className="max-h-[480px] max-w-full rounded-lg object-contain"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    {item.explanation}
                  </p>
                </article>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}
