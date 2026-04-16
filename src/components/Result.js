import Title from "./Title";
//import Image from "next/image";

export default function Result({
    response,
    ...props}){

    if(!response) return (null)

    return (
        <div className="w-full p-3 bg-gray-100 dark:bg-stone-800 border-solid border-1 flex flex-col rounded-xl">
            <Title title={response.title}></Title>
            <h3 className="text-sm dark:text-yellow-100">{response.date}</h3>
            <p>{response.explanation}</p>
            <img
                className="mx-10 my-5 max-h-120 object-cover"
                src={response.hdurl}
                alt="Imagen NASA APOD"
            />
            <span className="text-xs text-end ml-50">
                <span className="font-bold">Copyright:</span> {response.copyright}
            </span>
        </div>
    )
}