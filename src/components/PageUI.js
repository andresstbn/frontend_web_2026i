import { Button, Form, Input, MainTitle, RadioButtonSection, Result, Section, SubTitle, Title } from "@/components";
import { ApodContext } from "@/context/ApodContext";
import { useContext } from "react";


export default function PageUI() {
    
    let {
        response,
        error,
        loading,
        opcion,
        setInputValue,
        consumirAPI,
        limpiarResultado
    } = useContext(ApodContext)

    return (
        <main className="w-full max-w-3xl py-8 px-12 flex flex-1 flex-col items-center bg-white dark:bg-black sm:items-start">
            <div className="w-full p-10 grow flex flex-col items-center gap-6 text-center border rounded-xl shadow-l sm:items-start sm:text-left dark:border-white">
                <MainTitle title="Ejercicio React: NASA APOD" />
                <Section>
                    <Title title="Consulta la API de NASA APOD" />
                    <SubTitle title="1) Modo de Consulta (radio)" />
                    <Form>
                        <RadioButtonSection
                            radioBotones={[
                                { name: "mode", value: "today", label: "Foto de hoy" },
                                { name: "mode", value: "date", label: "Fecha especifica" },
                                { name: "mode", value: "count", label: "Aleatorias (count)" },
                            ]}
                        />

                        {(opcion==="date" || opcion==="count") &&     
                            <Input
                            label={opcion==="date"?'Fecha:':'Cantidad(1-10):'}
                            type ={opcion==="date"?'date':'number'}
                            className="mb-5"
                            onChange={(e) => setInputValue(e.target.value)}
                            error={error}
                            />
                        }
                        
                        <div className="flex gap-2">
                            <Button onClick={consumirAPI}>Consultar NASA APOD</Button>
                            <Button variant="secondary" onClick={limpiarResultado}>Limpiar resultado</Button>
                        </div>
                    </Form>
                </Section>

                {loading && <Title title={"Cargando..."} />}
                
                {(!error && response) && (
                    Array.isArray(response)
                        ? response.map((res) => <Result key={res.date} response={res} />)
                        : <Result response={response} />
                )}
            </div>
        </main>
    )
}

