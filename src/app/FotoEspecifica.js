const FotoEspecifica = ({data}) => {
    return( 
        <>
        <div className="mx-10 mt-5 font-semibold text-2xl border rounded-xl border-gray-300">
            <h1 className="pt-5 px-5 font-semibold text-x2 ">{data?.title}</h1>
            <h1 className="pt-2 px-5 font-semibold text-xs ">{data?.date}</h1>
            {/* <img src={data?.url} className="h-100 pt-2 "/> */}
            <a href={data?.url} className="px-5 text-blue-400 pt-4 text-xl">Abrir imagen en una nueva pestaña</a>
            <p className="font-light text-xl pt-4 px-5">{data?.explanation}</p>
        </div>
        </>
    )
}

export default FotoEspecifica;