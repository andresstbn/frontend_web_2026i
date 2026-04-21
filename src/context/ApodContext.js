import { useApod } from "@/hooks/useApod"
import React from "react"

const ApodContext = React.createContext()

function ApodProvider({children}){

    const apod = useApod()

    return(
        <ApodContext.Provider value={apod}>
            {children}
        </ApodContext.Provider>
    )
}

export {ApodContext, ApodProvider}