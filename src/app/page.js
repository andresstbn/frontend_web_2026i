"use client";

import { useState, useEffect } from "react";
import { RadioButton } from "@/components";
import { Input } from "@/components";
import { Button } from "@/components";
import Image from "next/image";


const url = "https://api.nasa.gov/planetary/apod";
const api_key = "6SGciaiHKgKKgCCZ5tgHcC5HN3aKbF1ECuUec2U2";


export default function Home() {
  const hoy = new Date();
  const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  //estos para mis tres radiobutton. 
  const [modo, setModo] = useState(""); //modo= fecha de hoy(today), especifica(date), aleatorio(count)
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState(1); //cantidad del 1 al 10 para las fotos aleatorias

  //
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false); //"cargando"
  const [error, setError] = useState(null); //arrojar un mss de error
  const [consultar, setConsultar] = useState(false);  //el q sirve cuando le de click a los radiobutton

  useEffect(() => {
    if (!consultar) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setResultados([]); //para limpiar la pantalla
      try {
        let url_final = `${url}?api_key=${api_key}`;
        if (modo === "today") {
          url_final += `&date=${fechaHoy}`;
        } else if (modo === "date") {
          url_final += `&date=${fecha}`;
        } else if (modo === "count") {
          url_final += `&count=${cantidad}`;
        }

        const response = await fetch(url_final);
        if (!response.ok) throw new Error("Error al consultar la API de NASA");
        const data = await response.json();

        setResultados(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message); //esto es por si falla, arroja el mss de error
      } finally {
        setLoading(false);
        setConsultar(false);
      }
    };

    fetchData();
  }, [consultar]);

  return (
    <div className="mx-8 my-5 py-6 px-4 bg-zinc-50 font-sans border-2 rounded-3xl border-gray-300 text-2xl">
      <h1 className="font-bold">Ejercicio React: NASA APOD</h1>
      <div className="border-gray-300 rounded-3xl border-2 text-xl my-8 py-6 px-4">
        <h2 className="font-bold">1. Modo de Consulta</h2>
        <ul className="flex gap-6">
          <li>
            <RadioButton
              name="modo"
              value="today"
              label="Foto de hoy"
              checked={modo === "today"}
              onChange={(e) => setModo(e.target.value)}>
            </RadioButton>
          </li>
          <li>
            <RadioButton
              name="modo"
              value="date"
              label="Fecha especifica"
              checked={modo === "date"}
              onChange={(e) => setModo(e.target.value)}>
            </RadioButton>
          </li>
          <li>
            <RadioButton
              name="modo"
              value="count"
              label="Aleatorias (count)"
              checked={modo === "count"}
              onChange={(e) => setModo(e.target.value)}>
            </RadioButton>
          </li>
        </ul>

        {modo === "today" && (
          <div className="my-4">
            <Input
              label="2. Fecha actual"
              type="date"
              value={fechaHoy}
              disabled //para q no pueda modificarse la cajita de la fecha
            />
          </div>
        )}

        {modo === "date" && (
          <div className="my-4">
            <Input
              label="2. Selecciona la fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        )}

        {modo === "count" && (
          <div className="my-4 animate-fadeIn">
            <Input
              label="2. Cantidad de fotos (1-10)"
              type="number"
              min="1"
              max="10"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
        )}


        <div className="flex gap-4 mt-6">
          <button
            className="rounded-2xl bg-pink-400 hover:bg-pink-600 text-white font-medium px-6 py-3 transition-colors"
            onClick={() => {
              if (modo === "") return alert("Por favor, selecciona un modo primero");
              setConsultar(true);
            }}
          >
            Consultar NASA APOD
          </button>

          <button
            className="rounded-2xl bg-zinc-400 hover:bg-zinc-600 text-white font-medium px-6 py-3 transition-colors"
            onClick={() => {
              setResultados([]);
              setModo("");
              setFecha("");
              setCantidad(1);
              setError(null);
            }}
          >
            Limpiar resultado
          </button>
        </div>
      </div>

      <div className="border-gray-300 rounded-3xl border-2 text-xl my-8 py-6 px-4">
        {/* si sí hay algo para cargar se va a mostrar, y si es false no mostrara nada */}
        {loading && <p className="text-center text-pink-500">Cargando</p>}

        {error && (
          <div>
            {/* si hay un error muestra esto */}
            <strong className="font-bold">¡Ups! </strong>
            <span>{error}</span>
          </div>
        )}

        {/* como estoy trabajando resultados como array, cuando haya más de uno debo recorrer cada uno de ellos, el
        item va a mostrar la info como tal, el index ps el indice */}
        {resultados.length > 0 && resultados.map((item, index) => (
          <div key={index} >
            {/* nombre y fecha del objeto */}
            <h2 className="font-bold text-3xl mb-2">{item.title}</h2>
            <p className="text-gray-400 text-sm mb-4">{item.date}</p>

            <div className="my-6 flex justify-center">
              {/* esto es porque la NASA puede mandar video o imagen, así que hago este condicional para mostrar dependiendo de qué sea */}
              {item.media_type === "video" ? (
                <div>
                  {/* lo de target es para que se abra en una pestaña nueva */}
                  <a href={item.url} target="_blank">
                    Ver Video de la NASA
                  </a>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  
                />
              )}
            </div>

            <p className="text-xl leading-relaxed text-gray-700 text-justify">
              {item.explanation}
            </p>
          </div>
        ))}
      </div >
    </div>

  );
}