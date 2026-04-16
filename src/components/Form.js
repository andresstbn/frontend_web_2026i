"use client";
import Button from "./Button";
import Input from "./Input";
import RadioButton from "./RadioButton";
import Title from "./Title";
import { useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_API_KEY; //joTsS29PsAhmLhUyAOBO89ld0VGVbkIkv3Jst0bm

export default function Form({
  title,
  setResponse,
  error,
  setError,
  setLoading
})
{ 
  const [opcion, setOpcion] = useState("today")
  const [date, setDate] = useState("")
  const [count, setCount] = useState(1)
  
  async function consumirAPI(){
    setLoading(true)

    let urlAPI = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}` 
    if(opcion==="date")urlAPI+=`&date=${date}`
    else if(opcion==="count"){
      if(count<1 || count>10){
        setError("Usa el rango valido")
        setLoading(false)
        return
      }
      urlAPI+=`&count=${count}`
    }
            
    let response = await fetch(urlAPI)
    let data = await response.json()

    if(data.msg)setError(data.msg)
    else setError(null)

    setResponse(data)
    setLoading(false)
  }
  
  return(
    <div className="w-full p-3 bg-gray-100 dark:bg-stone-800 border-solid border-1 flex flex-col rounded-xl">
      <Title title={title}></Title>     
      <h3>1) Modo de Consulta (radio)</h3>
      
      <form>
        <div className="flex my-3 gap-2">
          <RadioButton
            id="mode-today"
            name="mode"
            value="today"
            label="Foto de hoy"
            checked={opcion === 'today'}
            onChange={() => setOpcion('today')}
          /> 
          <RadioButton
            id="mode-date"
            name="mode"
            value="date"
            label="Fecha especifica"
            checked={opcion === 'date'}
            onChange={() => setOpcion('date')}
          />
          <RadioButton
            id="mode-count"
            name="mode"
            value="count"
            label="Aleatorias (count)"
            checked={opcion === 'count'}
            onChange={() => setOpcion('count')}
          />
        </div>

        {opcion==="date" && 
          <Input
            label='Fecha:'
            type ="date"    
            className="mb-5"
            onChange={(e) => setDate(e.target.value)}
            error={error}
          />
        }

        {opcion==="count" && 
          <Input
            label='Cantidad(1-10):'
            type ="number"    
            className="mb-5"
            onChange={(e) => setCount(Number(e.target.value))}  
            error={error}
          />
        }

        <div className="flex gap-2">
          <Button children={"Consultar NASA APOD"} onClick={consumirAPI}/>
          <Button children={"Limpiar resultado"} variant="secondary" onClick={() => setResponse(null)}/>
        </div>
      </form>
    </div>
  );
}

