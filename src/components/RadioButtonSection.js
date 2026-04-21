import { RadioButton } from "@/components"
import { ApodContext } from "@/context/ApodContext"
import { useContext } from "react"

function RadioButtonSection({
    radioBotones,
    className = "flex my-3 gap-2",
    ...props
}){

    let {opcion, setOpcion} = useContext(ApodContext)
    
    return(
        <div className={className} {...props}>
            {radioBotones.map(({value, label, name}) => (
                <RadioButton
                    key={`${name}-${value}`}
                    id={`${name}-${value}`}
                    name={`${name}`}
                    value={`${value}`}
                    label={`${label}`}
                    checked={opcion === `${value}`}
                    onChange={() => setOpcion(`${value}`)}
                />
            ))}
        </div>
    )
}

export {RadioButtonSection}