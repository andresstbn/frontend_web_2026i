"use client";
import {Form, Result } from "@/components";
import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState(null)

  return (
      <main className="w-full max-w-3xl py-8 px-12 flex flex-1 flex-col items-center bg-white dark:bg-black sm:items-start">
        <div className="w-full p-10 grow flex flex-col items-center gap-6 text-center border rounded-xl shadow-l sm:items-start sm:text-left dark:border-white">
          <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Ejercicio React: NASA APOD 
          </h1>
          <Form title="Consulta la API de NASA APOD" setResponse={setResponse}></Form>
          <Result title="Resultado" response={response}></Result>
        </div>
      </main>
  );
}
