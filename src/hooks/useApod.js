"use client";
import { useAPODAPI } from "@/services/useAPODAPI";
import { useState, useEffect } from "react";

function useApod(){

    const apiKey = process.env.NEXT_PUBLIC_API_KEY; //joTsS29PsAhmLhUyAOBO89ld0VGVbkIkv3Jst0bm
    
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [opcion, setOpcion] = useState("today")
    const [inputValue, setInputValue] = useState("")

    async function consumirAPI(){
        setLoading(true)
        setError(null)
        setResponse(null)

        try{
            let data = await useAPODAPI({
                apiKey,
                opcion,
                inputValue
            })
            setResponse(data)
        }
        catch(err){
            setError(err.message)
        }
        finally{
            setLoading(false)
        }
    }

    const limpiarResultado = () => {
        setResponse(null)
        setLoading(false)
    }

    useEffect(() => {
        async function fetchToday() {
            try {
                setLoading(true);

                const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
                const data = await res.json()

                setResponse(data)
                setError(null)
            } catch {
                setError("Error de Conexion")
            } finally {
                setLoading(false)
            }
        }

        fetchToday()
    }, [])

    return({
        response,
        error,
        loading,
        opcion,
        setOpcion,
        setInputValue,
        consumirAPI,
        limpiarResultado
    })
}

export {useApod}