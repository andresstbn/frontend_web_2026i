"use client"
import { useState } from 'react'

import Image from "next/image";
import RadioButton from "@/components/RadioButton";
import Button from "@/components/Button";

export default function Home() {
  const [opcion, setOpcion] = useState('today')
  const [fecha, setFecha] = useState('')
  const [count, setCount] = useState(1)
  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const consultar = () => {
    setLoading(true)
    setError(null)

    let url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`

    if (opcion === 'date') url += `&date=${fecha}`
    if (opcion === 'count') url += `&count=${count}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setResultados(Array.isArray(data) ? data : [data])
      })
      .catch(() => setError("Error al consultar la API"))
      .finally(() => setLoading(false))
  }

  return (
    <> 
      <main className="m-8">
        <h1 className="text-4xl">NASA APOD</h1>

        <section className="m-8 bg-gray-200 p-4">
          <h2 className="text-blue-950">1. Modo de consulta</h2>  

          <div id="division_1" className="m-2 flex gap-8">
            <RadioButton
              onChange={() => setOpcion('today')}
              checked={opcion === 'today'}
              label="Foto de hoy" 
            />

            <RadioButton
              onChange={() => setOpcion('date')}
              checked={opcion === 'date'}
              label="Fecha específica"
            />

            <RadioButton
              onChange={() => setOpcion('count')}
              checked={opcion === 'count'}
              label="Aleatorias (count)"
            />
          </div>

          
          <div className="m-2">
            {opcion === 'date' && (
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="border p-2 rounded"
              />
            )}

            {opcion === 'count' && (
              <input
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="border p-2 rounded"
              />
            )}
          </div>

          <div id="division_2" className="flex gap-8">
            <button
              onClick={consultar}
              className="bg-blue-600 text-white rounded-xl p-2 mt-4 font-bold"
            >
              Consultar NASA APOD
            </button>

            <button
              onClick={() => setResultados([])}
              className="bg-amber-50 rounded-xl p-2 mt-4 font-bold"
            >
              Limpiar Resultados
            </button>
          </div>
        </section>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
       
        <section className="m-8">
          {resultados.map((item, index) => (
            <div key={index} className="mb-8 border p-4 rounded bg-white">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-600">{item.date}</p>

              {item.media_type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-96 mt-2 rounded"
                />
              ) : (
                <iframe
                  src={item.url}
                  className="w-96 h-64 mt-2"
                ></iframe>
              )}

              <p className="mt-2">{item.explanation}</p>
            </div>
          ))}
        </section>

      </main>
    </>
  );
}