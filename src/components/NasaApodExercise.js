'use client';

import { useEffect, useState } from 'react';
import { Button, Input, RadioButton } from '@/components';

const NASA_API_KEY = 'f5TLhikqS07F1I3XS4HWPonEvbH99CdV8Q6fMGdh'

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatApodDate(dateText) {
  if (!dateText) return 'Sin fecha';
  const [year, month, day] = dateText.split('-');
  return `${day}/${month}/${year}`;
}

export default function NasaApodExercise() {
  const [mode, setMode] = useState('today');
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [count, setCount] = useState(3);

  const [apods, setApods] = useState([]);
  const [error, setError] = useState('');

  function buildRequestUrl() {
    const params = new URLSearchParams({ api_key: NASA_API_KEY });

    if (mode === 'date') {
      params.set('date', selectedDate);
    }

    if (mode === 'count') {
      params.set('count', String(count));
    }

    return `https://api.nasa.gov/planetary/apod?${params.toString()}`;
  }

  async function fetchApod() {
    const requestUrl = buildRequestUrl();
    setError('');

    try {
      const response = await fetch(requestUrl);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.msg || 'No se pudo consultar la NASA API.');
      }

      const normalizedPayload = Array.isArray(payload) ? payload : [payload];
      setApods(normalizedPayload);
    } catch (fetchError) {
      setApods([]);
      setError(fetchError.message || 'Ocurrió un error inesperado.');
    }
  }

  const requestUrl = buildRequestUrl();

  useEffect(() => {
    fetchApod();
  }, [mode, selectedDate, count]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
      <main className="space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <section className="space-y-3">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            Ejercicio React: NASA APOD
          </h1>
        </section>

        <section className="grid gap-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-800">1) Modo de consulta (radio)</p>
            <div className="flex flex-wrap gap-4">
              <RadioButton
                id="mode-today"
                name="query-mode"
                label="Foto de hoy"
                value="today"
                checked={mode === 'today'}
                onChange={() => setMode('today')}
              />
              <RadioButton
                id="mode-date"
                name="query-mode"
                label="Fecha específica"
                value="date"
                checked={mode === 'date'}
                onChange={() => setMode('date')}
              />
              <RadioButton
                id="mode-count"
                name="query-mode"
                label="Aleatorias (count)"
                value="count"
                checked={mode === 'count'}
                onChange={() => setMode('count')}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {mode === 'date' && (
              <Input
                id="apod-date"
                label="2) Fecha"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            )}

            {mode === 'count' && (
              <Input
                id="apod-count"
                label="2) Cantidad (1 a 10)"
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={(event) => setCount(Number(event.target.value) || 1)}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={fetchApod}>Consultar NASA APOD</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setApods([]);
                setError('');
              }}
            >
              Limpiar resultado
            </Button>
          </div>

          <p className="text-xs text-zinc-500">
            URL actual: <code className="break-all">{requestUrl}</code>
          </p>
        </section>

        <section className="space-y-4">
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {!error && apods.length === 0 && (
            <p className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              Aún no hay resultados.
            </p>
          )}

          <div className="grid gap-5">
            {apods.map((item, index) => (
              <article
                key={`${item.date || 'apod'}-${index}`}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <h2 className="text-lg font-semibold text-zinc-900">{item.title}</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  {formatApodDate(item.date)}
                  {item.copyright ? ` - © ${item.copyright}` : ''}
                </p>

                <div className="mt-4">
                  {item.media_type === 'image' && (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="max-h-[420px] w-full rounded-lg object-contain"
                    />
                  )}

                  {item.media_type === 'video' && (
                    <div className="space-y-3">
                      {item.thumbnail_url && (
                        <img
                          src={item.thumbnail_url}
                          alt={`Miniatura de ${item.title}`}
                          className="max-h-[360px] w-full rounded-lg object-contain"
                        />
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-700 underline"
                      >
                        Abrir video en una nueva pestaña
                      </a>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-700">{item.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
