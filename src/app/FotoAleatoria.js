const FotoAleatoria = ({ data }) => {
    console.log("SE HIZO EL COMPONENTE")
    return (
        <>
            {data.map((dato) => (
                <div className="mx-10 mt-5 font-semibold text-2xl border rounded-xl border-gray-300">
                    <h1 className="pt-5 px-5 font-semibold text-xl ">{dato.title}</h1>
                    <h1 className="pt-2 px-5 font-semibold text-xs ">{dato.date}</h1>
                    <img src={dato?.url} className="h-100 pt-2 " />
                    <p className="font-light text-xl pt-4 px-5">{dato.explanation}</p>
                </div>
            ))}
        </>
    )
}

export default FotoAleatoria;