"use client";
import { useEffect, useState } from "react";
import { RadioButton } from "@/components";
import Image from "next/image";


export default function Home() {
  /***Define la categoría de búsqueda (Hoy, Fecha o Aleatorio). */
  const [modo, setModo] = useState("");
  const [fecha, setFecha] = useState("");
  const [aleatorio, setAleatorio] = useState("");
  /***Almacena la respuesta JSON de la API de la NASA. */
  const [datos, setDato] = useState(null);
  /***Actúa como interruptor para disparar la consulta al hacer clic. */
  const [enviar, setEnviar] = useState(false);
  /***visualización del mensaje de espera */
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (enviar) {
      const consultarApi = async () => {
        setCargando(true); /***muestra el mensaje de espera mientras la API trae la informacion  */
        /***direccion de la NASA  */
        const apiKey = "QPKPNROmnWVJ3aZmy2kFO3Bx56Vff5BSespUrwbr"
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        /***depende del modo se realiza la consulta en la API */
        if (modo === "fecha") {
          url = `${url}&date=${fecha}`
        }
        if (modo === "aleatorio") {
          url = `${url}&count=${aleatorio}`
        }
        /***conecta la aplicación con el servidor de la NASA para solicitar los datos y espera a que los traiga. */
        const res = await fetch(url);
        /***Transforma la respuesta que envía la NASA en un objeto de JavaScript */
        const datos = await res.json();
        /***depende de si me estan enviando un paquete o un objeto, si es objeto lo guardo en un arreglo */
        if (Array.isArray(datos)) {
          setDato(datos)
        } else {
          setDato([datos])
        }
        setEnviar(false); /***Apago el botón para que no se quede hundido pidiendo cosas infinitamente. */
        setCargando(false); /***Apago el circulito de espera */

      }
      consultarApi();

    }

  }, [enviar])
  return (
    <div className="mx-8 my-5 py-4 px-4 bg-white font-sans  border-2 rounded-2xl border-gray-300">
      <h1 className="font-bold">Ejercicio React: NASA APOD : KAREN REINA</h1>
      <div className="  mx-6 my-5 py-4 px-4 bg-zinc-50 font-sans  border-2 rounded-xl border-gray-300  space-y-4 mt-4">
        <h2 className="font-bold">1. Modo de consulta </h2>
        <ul className="flex gap-6">
          <li>
            {/* permite elegir entre las 3 opciones de modo  */}  
            <RadioButton
              name="modo"
              value="hoy"
              label="Foto de hoy"
              checked={modo === "hoy"}
              onChange={(e) => setModo(e.target.value)}
            ></RadioButton>
          </li>

          <li>
            <RadioButton
              name="modo"
              value="fecha"
              label="Fecha especifica"
              checked={modo === "fecha"}
              onChange={(e) => setModo(e.target.value)}
            ></RadioButton>
          </li>

          <li>
            <RadioButton
              name="modo"
              value="aleatorio"
              label="Aleatorios"
              checked={modo === "aleatorio"}
              onChange={(e) => setModo(e.target.value)}
            ></RadioButton>
          </li>
        </ul>
        {/*evalua que el modo sea igual a la fecha*/} 
        {modo === "fecha" && (     
          <div className="flex gap-9 col items-center py-2 my-2 ">
            <h3 className="text-gray-700 ">Fecha</h3>
        {/*  Campo de entrada tipo calendario. onChange: Captura el valor seleccionado por el usuario (e.target.value) y lo guarda inmediatamente en el estado setFecha. */}  
            <input type="date" className="border p-2 rounded-2xl  border-gray-400 text-gray-700 " onChange={(e) => setFecha(e.target.value)}></input>
          </div>
        )}
         {/*evalua que el modo sea igual a aleatorio*/} 
        {modo === "aleatorio" && (
          <div className="flex gap-9 col items-center py-2 my-2 ">
            <h3 className="text-gray-700 ">Numero</h3>
             {/*  Campo de entrada tipo numerico donde max y min es 10 1. onChange: Captura el valor seleccionado por el usuario (e.target.value) y lo guarda inmediatamente en el estado setaleatorio */}  
            <input type="number" min="1" max="10" className="border p-2 rounded-2xl  border-gray-400 text-gray-700 " onChange={(e) => setAleatorio(e.target.value)}></input>
          </div>
        )}
         {/*botones*/} 
        <div className=" mb-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white mx-2 my-8 py-2 px-4 rounded-2xl text-xs " id="buscar"
            onClick={() => {
              setEnviar(true);
            }}
          >Consultar NASA APOD</button>
          <button className="bg-gray-300 hover:bg-gray-400 mx-2 my-8 py-2 px-4 rounded-2xl text-xs" id="limpiar"
            onClick={() => {
              setDato("");
              setEnviar(false);

            }}>Limpiar resultado</button>
        </div>
          {/**Verifica si hay datos. uso .map para recorrer la lista  */}
        {datos && datos.map((item, index) => (
          <div key={index} className="flex flex-col items-center ">
            <h3 className="font-bold text-center">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.date}</p>
           {/*Si el recurso es un video, se crea un enlace en una pestaña nueva  */}
            {item.media_type === "video" && (
              <a href={item.url} target="_blank" className="text-blue-500 underline mb-4 block">
                Abrir video en una nueva pestaña
              </a>
            )}
            {/*depende del recurso obtenido si es video o imagen  */}
            {item.media_type === "video" ? (
              <div src={item.url} className="my-1"> </div>
            ) : (
              <img src={item.url} alt={item.title} width="50%" />
            )}
            <p className="mt-4 text-justify">
              {item.explanation}
            </p>
          </div>
        ))}
        {cargando && (
            <p className="mt-4 text-blue-600 font-medium">Conectando con la NASA...</p>
          
        )}
      </div>
    </div>
  );
}
