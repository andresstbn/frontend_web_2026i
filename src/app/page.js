"use client";

import { RadioButton } from "@/components";
import { Input } from "@/components";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const hoyFecha = new Date().toLocaleDateString('en-CA') //CA ya tiene el formato año, mes y dia
  //para que ambas se vean en el mismo formoato 
  const formatearFechaVisual = (fechaISO) => {
    if (!fechaISO) return ""; //si aun no hay fecha no hace nada
    const [anio, mes, dia] = fechaISO.split("-"); //busca cada guion y corta la cadena ahi
    return `${dia}/${mes}/${anio}`; //lo une con /
  };
  const [modo, setModo] = useState(""); //empieza vacio para q nada esté marcado al inicio
  const [fecha, setFecha] = useState(""); //fecha para cuando elijan especifica
  const [cantidad, setCantidad] = useState(1);// para cuando elijan aleatoria

  const [resultados, setResultados] = useState([]);//guardar los resultados de la respuesta de la NASA
  const [cargando, setCargando] = useState(false);//para saber si la peticion esta en curso
  const [error, setError] = useState(null);//si la API falla 
  const [tarjetaExpandida, setTarjetaExpandida] = useState(null);

  const cambioModo = (e) => {
    const valor = e.target.value;
    setModo(valor);
    setError(null);

    if (valor === "hoy") {
      setFecha(hoyFecha);
    } else {
      // Si cambia a específica o aleatoria, limpiamos la fecha para que no arrastre datos viejos
      setFecha("");
    }
  }
  const consultarAPI = async () => {
    if (modo === "") { // Si consulta estando el modo vacio q salte un error para que no haga una carga innecesaria
      setError("Por favor, selecciona un modo de consulta antes de buscar.");
      return;// se detiene
    }
    setError(null);
    setCargando(true);//si no entra al if continua cargando

    //Definimos nuestra llave y la url final
    const API_KEY = "goLR3LVEoRfHY1yZnyvPhfwtm1aNIUcQJ25DVA9m";
    let urlFinal = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`; //aca es let porque cambia si selecccionamos fecha especifica o aleatoria

    if (modo === "especifica") {
      urlFinal += `&date=${fecha}`; //se concatena con la fecha que se elija
    }
    if (modo === "aleatoria") {
      urlFinal += `&count=${cantidad}`;//cantidad es el numero del 1 al 10
    }
    console.log("Dirección final lista para enviar:", urlFinal);//probar q esté bien
    //ahora para la respuesta
    try { //enviar la peticion. Le digo q await para que espere lo que tarde en responder
      const respuesta = await fetch(urlFinal);
      if (!respuesta.ok) {//Si la NASA nos dice que algo salió mal (ej. fecha inválida)
        throw new Error("No se pudo obtener la información de la NASA.");
      }
      const datos = await respuesta.json(); // Convertir los datos a un objeto JS (JSON)
      //Guardar el resultado en nuestro estado
      const listaResultados = Array.isArray(datos) ? datos : [datos]; //si es hoy o especifica crea una lista de 1 y si es aleatoria la manda tal cual
      setResultados(listaResultados);
    }
    catch (error) { // Si hubo un error por ej se queda sin interent
      setError(error.message);
    } finally { // se debe ejecutar siempre para quitar el cargando
      setCargando(false);
    }
  }
  const limpiarResultado = () => {
    setModo("");
    setFecha("");
    setCantidad("1");
    setResultados([]);
    setError(null);
    setTarjetaExpandida(null);
  };
  return (
    <div className="mx-8 my-5 py-6 px-4 bg-zinc-50 font-sans border-2 rounded-3xl border-gray-300 text-2xl">
      <h1 className="font-bold">Ejercicio React: NASA APOD</h1>
      <div className="border-gray-300 rounded-3xl border-2 text-xl my-8 py-6 px-4">
        <h2 className="font-bold">1. Modo de Consulta</h2>
        <ul className="flex gap-6">
          <li>
            <RadioButton
              name="modo"
              value="hoy"
              label="Foto de hoy"
              checked={modo === "hoy"}
              onChange={cambioModo}>
            </RadioButton>
          </li>
          <li>
            <RadioButton
              name="modo"
              value="especifica"
              label="Fecha especifica"
              checked={modo === "especifica"}
              onChange={cambioModo}>
            </RadioButton>
          </li>
          <li>
            <RadioButton
              name="modo"
              value="aleatoria"
              label="Aleatorias (count)"
              checked={modo === "aleatoria"}
              onChange={cambioModo}>
            </RadioButton>
          </li>
        </ul>
        {modo === "hoy" && (
          <div className="my-4">
            <Input
              label="2. Fecha de hoy"
              type="text"
              value={formatearFechaVisual(fecha)}
              onChange={() => { }}
            />
          </div>
        )}
        {modo === "especifica" && (
          <div className="my-4">
            <Input
              label="2. Fecha Especifica"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        )}
        {modo === "aleatoria" && (
          <div className="my-4">
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
        <button className="rounded-2xl bg-purple-400 hover:bg-purple-600 font-medium my-3 mx-3 px-6 py-3" id="Buscar" onClick={consultarAPI}>
          Consultar NASA APOD
        </button>
        <button className="rounded-2xl bg-gray-400 hover:bg-gray-600 font-medium my-3 mx-3 px-6 py-3" id="Borrar" onClick={limpiarResultado}>
          Limpiar resultado
        </button>
      </div>

      {/*carga de resultados, se ejecuta al consultar*/}
      {cargando && (
        <p className="text-center text-zinc-500 animate-pulse my-10">
          Viajando al espacio...🚀
        </p>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5 mx-4 rounded-r-xl">
          {error}
        </div>
      )}
      {/*aca muestra los resultados, si ya no esta cargando y tiene al menos un resultado*/}
      {!cargando && resultados && resultados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10 px-4">
          {resultados.map((foto, index) => (
            <div
              key={index}
              onClick={() => setTarjetaExpandida(tarjetaExpandida === index ? null : index)}
              className={`bg-white border rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${tarjetaExpandida === index ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >{/* en un div grande condicional de si es foto o video*/}
              <div className={`relative w-full overflow-hidden transition-all ${tarjetaExpandida === index ? 'h-96' : 'h-64'}`}>
                {foto.media_type === "video" ? (
                  <iframe
                    src={foto.url}
                    title={foto.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={foto.url}
                    alt={foto.title}
                    className="w-full h-full object-cover transition-all"
                  />
                )}
              </div>
              <div className="p-5 text-zinc-800">
                <h3 className="font-bold text-lg leading-tight">{foto.title}</h3>
                <p className="text-sm text-zinc-400 my-2 font-mono">{foto.date}</p>
                {/* Si esta expandida, no hay line-clamp */}
                <p className={`text-zinc-600 text-sm leading-relaxed ${tarjetaExpandida === index ? '' : 'line-clamp-3'}`}>
                  {foto.explanation}
                </p>
                <span className="text-purple-500 text-xs font-bold mt-2 block">
                  {tarjetaExpandida === index ? "↑ Ver menos" : "↓ Leer más..."}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
