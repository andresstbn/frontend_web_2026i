"use client";

import Button from "../components/Button";
import FotoHoy from "./FotoHoy";
import { useEffect, useState } from "react";
import RadioButton from "../components/RadioButton";
import Input from "../components/Input";
import FotoEspecifica from "./FotoEspecifica";
import FotoAleatoria from "./FotoAleatoria";

export default function Home() {
  const api_key = "PhdLWZYYBEbWGL4W4BoSspD4iEh9CrACKPKVtqhB"
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");
  const [number, setNumber] = useState();
  const [data, setData] = useState(null);
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);


  const getApiKey = async () => {
    setData(null);
    setDatos(null);
    setLoading(true);
    setError(false)
    let resul
    try {
      if (tipo === "hoy") {
        const respuesta = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}`)
        resul = await respuesta.json()
        setData(resul)
      } else if (tipo === "especifica") {
        const respuesta = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}&date=${fecha}`)
        resul = await respuesta.json()
        setData(resul)
      } else if (tipo === "aleatorias") {
        const respuesta = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${api_key}&count=${number}`)
        resul = await respuesta.json()
        if (!Array.isArray(resul)) {
          resul = [resul];
        }

        setDatos(resul);
        console.log(datos)
      }
    } catch (err) {
      setError(true);
    } finally {
      console.log("hice consulta")
      setLoading(false);
      console.log(data)
    }
  }



  return (
    <>
      <div className="border border-gray-300 m-10 rounded-xl">
        <h1 className="mx-10 mt-5 font-semibold text-2xl ">Ejercicio React: NASA APOD</h1>
        <div className="mx-10 mt-5 font-semibold text-2xl bg-gray-100 border rounded-xl border-gray-300">
          <h1 className="mx-5 mt-5 font-semibold text-xs ">1) Modo de consulta(radio)</h1>
          <div className="text-xs mx-5 mt-3">
            <RadioButton label="Foto de hoy" name="tipoFoto" onChange={(e) => (setTipo("hoy"), setMostrar(false))} className="pr-2"></RadioButton>

            <RadioButton label="Foto específica" name="tipoFoto" onChange={(e) => (setTipo("especifica"), setMostrar(false))} className="pr-2"></RadioButton>

            <RadioButton label="Aleatorias" name="tipoFoto" onChange={(e) => (setTipo("aleatorias"), setMostrar(false))}></RadioButton>

            {tipo === "especifica" && (
              <div className="py-4">
                <Input type="date" onChange={(e) => setFecha(e.target.value)}></Input>
              </div>
            )}

            {tipo === "aleatorias" && (
              <div className="py-4">
                <Input type="number" onChange={(e) => setNumber(e.target.value)}></Input>
              </div>
            )}

            <div className="flex gap-10 py-4">
              <Button children={"Consultar NASA APOD"} onClick={() => {
                getApiKey();
                setMostrar(true);
              }}></Button>
              <Button children={"Limpiar Resultado"} variant="secondary" onClick={() => setMostrar(false)}></Button>
            </div>
            <div>
              {tipo === "hoy" && (
                <div className="mt-10">
                  <p className="opacity-50 my-5">https://api.nasa.gov/planetary/apod?api_key={api_key}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {loading && <p>Cargando...</p>}

          {error && (
            <p className="text-red-500">
              Error al consultar la API. Vuelve a intentar.
            </p>
          )}

          {data && mostrar && tipo === "hoy" && <FotoHoy data={data} />}
          {data && mostrar && tipo === "especifica" && <FotoEspecifica data={data} />}
          {datos && mostrar && tipo === "aleatorias" && <FotoAleatoria data={datos} />}


        </div>
      </div>
    </>
  );
}
