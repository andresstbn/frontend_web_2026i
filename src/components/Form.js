"use client";
import Button from "./Button";
import RadioButton from "./RadioButton";
import Title from "./Title";
import { useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_API_KEY; //joTsS29PsAhmLhUyAOBO89ld0VGVbkIkv3Jst0bm

export default function Form({
  title,
  setResponse,
  ...props
})
{ 
  const [opcion, setOpcion] = useState("today")
  
  async function consumirAPI(){
    if(opcion==="today"){
      console.log("a")
      let response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
      let data = await response.json()
      setResponse(data)
      console.log(data)
    }
    else if(opcion==="date"){
      console.log("b")
    }
    else if(opcion==="count"){
      console.log("c")
    }
  }
    return(
        <div className="w-full p-3 bg-gray-100 dark:bg-stone-800 border-solid border-1 flex flex-col rounded-xl">
          <Title title={title}></Title>
            <div>
                <h3 className="">1) Modo de Consulta (radio)</h3>
            </div>
          <form className="p-3">
            <div className="flex p-3 gap-2">
              <RadioButton
                id="mode-today"
                name="mode"
                value="today"
                label="Foto de hoy"
                checked={opcion === 'today'}
                onChange={() => setOpcion('today')}
                ></RadioButton> 
              <RadioButton
                id="mode-date"
                name="mode"
                value="date"
                label="Fecha especifica"
                checked={opcion === 'date'}
                onChange={() => setOpcion('date')}
                ></RadioButton>
              <RadioButton
                id="mode-count"
                name="mode"
                value="count"
                label="Aleatorias (count)"
                checked={opcion === 'count'}
                onChange={() => setOpcion('count')}
                ></RadioButton>
            </div>
            <div className="flex gap-2">
              <Button children={"Consultar NASA APOD"} onClick={consumirAPI}></Button>
              <Button children={"Limpiar resultado"} variant="secondary"></Button>
            </div>
          </form>
        </div>
    );
}

