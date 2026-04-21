import { Section, SubTitle, Title } from "@/components";

function Result({
    response
}){

    if(!response) return (null)

    return (
        <Section>
            <Title title={response.title}/>
            <SubTitle 
                title={response.date}   
                className="text-sm text-blue-700 dark:text-yellow-100"
            ></SubTitle>
            <p>{response.explanation}</p>

            {response.media_type === 'image' ? (
                <img
                    className="mx-10 my-5 max-h-120 object-cover"
                    src={response.url}
                    alt="Imagen NASA APOD"
                />
            ): (
                <span>URL Media: 
                    <a href={response.url} target="_blank" className="font-bold text-blue-600 dark:text-blue-200"> {response.url}</a>
                </span>
            )}

            <span className="text-xs text-end ml-10">
                <span className="font-bold">Copyright:</span> {response.copyright ? response.copyright : "Uso Libre"}
            </span>
        </Section>
    )
}

export { Result };
