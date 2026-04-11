"use client"
import { useState, useEffect } from "react"
import RadioButton from "../components/RadioButton"

export default function Home() {

  //useState
  const [mode, setMode] = useState("today")
  const [date, setDate] = useState("")
  const [count, setCount] = useState(1)

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //armar la URL
  const buildUrl = () => {
    const base = "https://api.nasa.gov/planetary/apod"
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY

    if (mode === "today") {
      return `${base}?api_key=${apiKey}`
    }

    if (mode === "date") {
      return `${base}?api_key=${apiKey}&date=${date}`
    }

    if (mode === "count") {
      return `${base}?api_key=${apiKey}&count=${count}`
    }
  }

  //llamado API
  const fetchApod = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = buildUrl()
      const res = await fetch(url)

      if (!res.ok) throw new Error("Error en la API")

      const result = await res.json()
      setData(result)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  //limpiar
  const clearData = () => {
    setData(null)
    setError(null)
  }

  const results = Array.isArray(data) ? data : data ? [data] : []

  useEffect(() => {
  if (mode === "today") {
    fetchApod()
  }
}, [mode])

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow p-6">

        {/* TÍTULO */}
        <h1 className="text-3xl font-bold mb-6">
          Ejercicio React: NASA APOD
        </h1>

        {/* CARD DE FORMULARIO */}
        <div className="border rounded-xl p-5 mb-6">

          {/* MODO */}
          <p className="font-semibold mb-3">1) Modo de consulta (radio)</p>

          <div className="flex gap-6 mb-4">
            <RadioButton
              label="Foto de hoy"
              value="today"
              checked={mode === "today"}
              onChange={(e) => setMode(e.target.value)}
            />

            <RadioButton
              label="Fecha específica"
              value="date"
              checked={mode === "date"}
              onChange={(e) => setMode(e.target.value)}
            />

            <RadioButton
              label="Aleatorias (count)"
              value="count"
              checked={mode === "count"}
              onChange={(e) => setMode(e.target.value)}
            />
          </div>

          {/* FECHA */}
          {mode === "date" && (
            <div className="mb-4">
              <p className="mb-1">2) Fecha</p>
              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {/* COUNT */}
          {mode === "count" && (
            <div className="mb-4">
              <p className="mb-1">2) Cantidad</p>
              <input
                type="number"
                min="1"
                max="10"
                className="border rounded px-3 py-2 w-full"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
          )}

          {/* BOTONES */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={fetchApod}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Consultar NASA APOD
            </button>

            <button
              onClick={clearData}
              className="bg-gray-200 px-5 py-2 rounded-lg"
            >
              Limpiar resultado
            </button>
          </div>

        </div>

        {/* LOADING Y ERROR */}
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* RESULTADOS */}
        {results.map((item, i) => (
          <div key={i} className="border rounded-xl p-5 mb-6 bg-gray-50">

            <h2 className="text-2xl font-semibold mb-1">
              {item.title}
            </h2>

            <p className="text-gray-500 mb-3">{item.date}</p>

            {item.media_type === "image" ? (
              <img
                src={item.url}
                alt={item.title}
                className="w-full rounded-lg mb-3"
              />
            ) : (
              <a
                href={item.url}
                target="_blank"
                className="text-blue-600 underline mb-3 block"
              >
                Abrir video en una nueva pestaña
              </a>
            )}

            <p className="text-gray-700">{item.explanation}</p>
          </div>
        ))}

      </div>
    </div>
  )
}
