const FotoHoy = ({data}) => {
  console.log("SE HIZO EL COMPONENTE")
    return(
        <>
        
        <div className="mx-10 mt-5 font-semibold text-2xl border rounded-xl border-gray-300">
            <h1 className="pt-5 px-5 font-semibold text-xl ">{data?.title}</h1>
            <h1 className="pt-2 px-5 font-semibold text-xs ">{data?.date}</h1>
            <img src={data?.url} className="h-100 pt-2 "/>
        </div>
    
        </>
    )
    
}

export default FotoHoy;