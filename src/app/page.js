"use client";

import { useState } from "react";
import { Button, Input, RadioButton } from "@/components";

export default function Home() {
  const [mode, setMode] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [apodData, setApodData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "qCtAH7vbZFpKaFOrvPSRtAi4WGRDN2S0jMfOTtpV";

  const fetchNasaData = async () => {
    setIsLoading(true);
    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    if (mode === "date" && selectedDate) {
      url += `&date=${selectedDate}`;
    } else if (mode === "random") {
      url += `&count=${count}`;
    }
    setCurrentUrl(url);

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (Array.isArray(result)) {
        setApodData(result);
      } else {
        setApodData([result]);
      }
    } catch (error) {
      console.error("Error al consultar la API:", error);
    }
    setIsLoading(false);
  };

  const clearData = () => {
    setApodData(null);
    setCurrentUrl("");
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg text-center mb-10">
          Ejercicio React: NASA APOD
        </h1>

        <section className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-4">
            <p className="font-semibold text-white/90 text-lg">1) Modo de consulta</p>
            <div className="flex flex-wrap gap-6 text-white">
              <RadioButton
                label="Foto de hoy"
                name="mode"
                checked={mode === "today"}
                onChange={() => setMode("today")}
              />
              <RadioButton
                label="Fecha específica"
                name="mode"
                checked={mode === "date"}
                onChange={() => setMode("date")}
              />
              <RadioButton
                label="Aleatorias (count)"
                name="mode"
                checked={mode === "random"}
                onChange={() => setMode("random")}
              />
            </div>
          </div>

          <div className="transition-all duration-300">
            {mode === "date" && (
              <div className="max-w-xs p-2 bg-white/5 rounded-xl">
                <Input
                  label="2) Selecciona la fecha"
                  type="date"
                  className="bg-white/80"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            )}

            {mode === "random" && (
              <div className="max-w-xs p-2 bg-white/5 rounded-xl">
                <Input
                  label="2) Cantidad de imágenes"
                  type="number"
                  min="1"
                  max="10"
                  value={count}
                  className="bg-white/80"
                  onChange={(e) => setCount(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={fetchNasaData} disabled={isLoading}
              className="shadow-lg hover:scale-105 transition-transform"
            >
              {isLoading ? "Consultando..." : "Consultar NASA APOD"}
            </Button>
            <Button 
              variant="secondary" 
              onClick={clearData}
              className="bg-white/20 text-white hover:bg-white/30 border-none"
            >
              Limpiar resultado
            </Button>
          </div>

          {currentUrl && (
            <div className="mt-4 p-3 bg-black/20 rounded-lg">
              <p className="text-[10px] text-blue-200 break-all font-mono">
                URL actual: {currentUrl}
              </p>
            </div>
          )}
        </section>

        <div className="space-y-8 pb-12">
          {apodData && apodData.map((item, index) => (
            <article 
              key={index} 
              className="backdrop-blur-xl bg-white/15 border border-white/20 p-6 rounded-3xl shadow-2xl space-y-4 animate-in fade-in zoom-in duration-500"
            >
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <p className="text-white/60 font-medium">{item.date}</p>

              <div className="relative group overflow-hidden rounded-2xl">
                {item.media_type === "image" ? (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-auto object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="bg-black/30 p-12 text-center rounded-2xl">
                    <a href={item.url} target="_blank" className="text-fuchsia-300 font-bold hover:text-white transition-colors">
                      🚀 Ver Video en NASA
                    </a>
                  </div>
                )}
              </div>

              <p className="text-white/80 leading-relaxed text-base italic">
                {item.explanation}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}