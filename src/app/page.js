"use client";

import { useEffect, useMemo, useState } from "react";
import ApodCard from "@/components/apod";

const API_BASE = "https://api.nasa.gov/planetary/apod";

function hoyISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function construirUrl(modo, fecha, cantidad, apiKey) {
  const u = new URL(API_BASE);
  u.searchParams.set("api_key", apiKey || "DEMO_KEY");
  if (modo === "date") u.searchParams.set("date", fecha);
  if (modo === "count") u.searchParams.set("count", String(cantidad));
  return u.toString();
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "";
  const [modo, setModo] = useState("today");
  const [fecha, setFecha] = useState(hoyISO);
  const [cantidad, setCantidad] = useState(3);
  const [peticion, setPeticion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultados, setResultados] = useState(null);

  const urlMostrada = useMemo(
    () => construirUrl(modo, fecha, cantidad, apiKey),
    [modo, fecha, cantidad, apiKey]
  );

  useEffect(() => {
    if (!peticion) return;
    const ac = new AbortController();
    (async () => {
      setCargando(true);
      setError(null);
      try {
        const url = construirUrl(
          peticion.modo,
          peticion.fecha,
          peticion.cantidad,
          apiKey
        );
        const res = await fetch(url, { signal: ac.signal });
        const data = await res.json();
        if (!res.ok) {
          const msg =
            data?.error?.message ||
            data?.msg ||
            (typeof data?.error === "string" ? data.error : null) ||
            `Error ${res.status}`;
          throw new Error(msg);
        }
        setResultados(data);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message || "Error desconocido");
        setResultados(null);
      } finally {
        setCargando(false);
      }
    })();
    return () => ac.abort();
  }, [peticion, apiKey]);

  const consultar = () => {
    let c = cantidad;
    if (modo === "count") {
      c = Math.min(10, Math.max(1, Number(cantidad) || 1));
      setCantidad(c);
    }
    setPeticion((p) => ({
      id: (p?.id ?? 0) + 1,
      modo,
      fecha,
      cantidad: c,
    }));
  };

  const limpiar = () => {
    setResultados(null);
    setError(null);
    setCargando(false);
  };

  const opciones = [
    { value: "today", label: "Foto de hoy" },
    { value: "date", label: "Fecha específica" },
    { value: "count", label: "Aleatorias (count)" },
  ];

  const lista = Array.isArray(resultados) ? resultados : resultados ? [resultados] : [];

  return (
    <div className="min-h-dvh w-full box-border px-4 py-6 font-sans sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-full space-y-6 sm:max-w-2xl lg:max-w-4xl">
        <h1 className="text-center text-2xl font-bold tracking-tight">
          Ejercicio React: NASA APOD
        </h1>

        <section className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-base font-semibold">
            1) Modo de consulta (radio)
          </h2>
          <div className="mb-4 flex flex-wrap gap-3">
            {opciones.map((op) => (
              <label
                key={op.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-sky-400 ${
                  modo === op.value
                    ? "border-sky-600 bg-sky-50 text-sky-900 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="modo"
                  value={op.value}
                  checked={modo === op.value}
                  onChange={() => setModo(op.value)}
                  className="h-4 w-4 accent-sky-600"
                />
                {op.label}
              </label>
            ))}
          </div>

          {modo === "date" && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                2) Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:max-w-xs"
              />
            </div>
          )}

          {modo === "count" && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                2) Cantidad (1 a 10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:max-w-xs"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={consultar}
              disabled={cargando}
              className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? "Consultando…" : "Consultar NASA APOD"}
            </button>
            <button
              type="button"
              onClick={limpiar}
              className="rounded-lg bg-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
            >
              Limpiar resultado
            </button>
          </div>

          <p className="mt-4 break-all font-mono text-xs text-zinc-500">
            URL actual:{" "}
            <span className="text-zinc-700">{urlMostrada}</span>
          </p>
        </section>

        {error && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        )}

        {lista.length > 0 && (
          <section className="space-y-4">
            {lista.map((item, i) => (
              <ApodCard key={`${item.date}-${item.title}-${i}`} data={item} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
