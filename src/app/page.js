"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const STROKE_COLOR = "#1f2937";
  const STROKE_WIDTH = 4;

  // Preparamos el contexto del canvas una vez al montar la pagina.
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = STROKE_WIDTH;
  }, [STROKE_COLOR, STROKE_WIDTH]);

  const getMousePosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // Inicio del dibujo: cuando se presiona el mouse dentro del canvas.
  const handleMouseDown = (event) => {
    const startPoint = getMousePosition(event);
    lastPointRef.current = startPoint;
    setIsDrawing(true);
  };

  // Movimiento del dibujo: trazamos una linea mientras el mouse se mueve presionado.
  const handleMouseMove = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const currentPoint = getMousePosition(event);

    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(currentPoint.x, currentPoint.y);
    context.stroke();

    lastPointRef.current = currentPoint;
  };

  // Fin del dibujo: se detiene al soltar el mouse o al salir del canvas.
  const handleMouseUpOrLeave = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // TODO: Permitir cambiar el color del trazo.
  // TODO: Permitir cambiar el grosor del trazo.
  // TODO: Agregar un borrador.
  // TODO: Soportar dibujo táctil para pantallas touch.

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Mini Paint</h1>

        <p className="text-slate-700">
          Presiona el mouse sobre el canvas para iniciar el trazo, mueve el cursor para dibujar y suelta para
          detener.
        </p>

        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-full rounded-lg border border-slate-300 bg-white"
        />

        <div>
          <button
            type="button"
            onClick={clearCanvas}
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            Limpiar canvas
          </button>
        </div>
      </section>
    </main>
  );
}
