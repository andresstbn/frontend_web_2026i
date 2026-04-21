function Section({
    className = "w-full p-3 bg-gray-100 dark:bg-stone-800 border-solid border-1 flex flex-col rounded-xl",
    children
}){ 
    return (
    <div 
        className={className}
    >
        {children}
    </div>)
}

export {Section}