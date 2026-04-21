async function useAPODAPI({
    apiKey,
    opcion,
    inputValue,
    method = "GET"
}) {
    console.log(apiKey)
    let urlAPI = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
    
    if (opcion === "date") {
        urlAPI += `&date=${inputValue}`;
    }

    if (opcion === "count") {
        if (inputValue < 1 || inputValue > 10) {
        throw new Error("Usa el rango válido");
        }

        urlAPI += `&count=${inputValue}`;
    }
    
    let res
    try{ res = await fetch(urlAPI)}
    catch (err){ throw new Error("Error de Conexion")}

    let data = await res.json()
    if (data.msg)
        throw new Error(data.msg)
    
    return data
}

export { useAPODAPI }