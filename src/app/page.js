"use client";

import { useEffect, useState } from "react";
import { RadioButton } from "@/components";

export default function Home() {

  const [apods, setApods] = useState([]);
  const [modoConsulta, setModoConsulta] = useState("hoy");
  const [fecha, setFecha] = useState("");
  const [param, setParam] = useState("");
  const [valParam, setValParam] = useState("");
  
  const BASE_URL = "https://api.nasa.gov/planetary/apod?api_key=KLyqkcfIQJ8QbdLrlU1VD1oQ9qSd43vYERG5ehGL";

  useEffect(() => {    
    fetch(`${BASE_URL}${(param != "")? "&" : ""}${param}${(param != "")? "=" : ""}${valParam}`)
    .then((response) => response.json())
    .then((data) => {
      if(Array.isArray(data)){
        setApods(data);
      } else{
        setApods([data]);
      }
      });
  }, [param])

  return (
    <main className="flex bg-white p-10">
      <div className="bg-white rounded-xl shadow w-full h-full p-10 color-black">
        <h1 className="font-bold text-3xl">Ejercicio React: NASA APOD</h1>

        <section id="seccion_consulta" className="flex flex-col bg-gray-200 rounded-xl shadow p-5 gap-2 mt-2">
          <h2 className="font-bold">1) modo de consulta(radio)</h2>
            
          <div className="flex gap-5 ">
            <RadioButton
            id = "hoy"
            name = "hoy"
            value = "hoy"
            label = "Foto de Hoy"
            onChange = {(e) => setModoConsulta(e.target.value)}
            checked = {modoConsulta === "hoy"}            
            ></RadioButton>

            <RadioButton
            id = "fecha"
            name = "fecha"
            value = "fecha"
            label = "Fecha especifica"
            onChange = {(e) => setModoConsulta(e.target.value)}
            checked = {modoConsulta === "fecha"}
            ></RadioButton>

            <RadioButton
            id = "aleatorias"
            name = "aleatorias"
            value = "aleatorias"
            label={"Aleatorias (count)"}
            onChange = {(e) => setModoConsulta(e.target.value)}
            checked = {modoConsulta === "aleatorias"}
            ></RadioButton>
          </div>

          <ul id="lista_consulta" className="mt-2">
            {modoConsulta==="fecha" && (
              <li>
                <h2>2) fecha</h2>
                <input 
                id = "fechaSeleccionada" 
                type = "date"
                value={fecha}
                className="shadow rounded-xl p-3 w-100 mt-2" 
                onChange={(e) => setFecha(e.target.value)}
                ></input>
              </li>
            )}
          </ul>

          <div className="flex gap-5">
            <button className="rounded-xl shadow bg-blue-400 p-2" onClick = {() => {
              if(modoConsulta === "hoy") {setParam(""); setValParam("");}
              if(modoConsulta === "fecha") {setParam("date"); setValParam(fecha);}
              if(modoConsulta === "aleatorias") {setParam("count"); setValParam(3);} 
            }}>Consultar NASA APOD</button>
            <button className="rounded-xl shadow bg-gray-300 p-2" onClick = {() => setApods([])}>Limpiar Resultados</button>
          </div>
          
           <p className="text-gray-400 font-sm">url actual {BASE_URL}{(param != "")? "&" : ""}{param}{(param != "")? "=" : ""}{valParam}</p>                  
        </section>

        <section id="seccion_resultados" className="flex flex-col bg-gray-200 rounded-xl shadow p-5 gap-2 mt-2">
          <ul id="lista_resultados">
            {apods.map((apod) => (
              <li key={apod.date}>
                <div className="flex flex-col gap-3 mt-3">
                  <h2 className="font-bold text-xl">{apod.title}</h2>

                  <p>{apod.date}</p>

                  <div className="flex justify-center">
                    {apod.media_type === "image" && (
                      <img src = {apod.url} width="700"></img>
                    )}
                  </div>
                  
                  <div className="flex justify-center">
                    {apod.media_type === "video" && (
                    <video src = {apod.url} type = "video/mp4" width= "700"></video>
                  )}
                  </div>
                  
                  <p>{apod.explanation}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

