import Title from "./Title";
//import Image from "next/image";

export default function Result({
    response
}){

    if(!response) return (null)

    return (
        <div className="w-full p-3 bg-gray-100 dark:bg-stone-800 border-solid border-1 flex flex-col rounded-xl">
            <Title title={response.title}/>
            <h3 className="text-sm text-blue-700 dark:text-yellow-100">{response.date}</h3>
            <p>{response.explanation}</p>

            {response.media_type === 'image' ? (
                <img
                    className="mx-10 my-5 max-h-120 object-cover"
                    src={response.url}
                    alt="Imagen NASA APOD"
                />
            ): (
                <span>URL Media: 
                    <a href={response.url} target="blank" className="font-bold text-blue-600 dark:text-blue-200"> {response.url}</a>
                </span>
            )}

            <span className="text-xs text-end ml-50">
                <span className="font-bold">Copyright:</span> {response.copyright ? response.copyright : "Uso Libre"}
            </span>
        </div>
    )
}