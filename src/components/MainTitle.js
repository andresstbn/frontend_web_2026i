function MainTitle({
    title,
    className = `max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50`
}){
    return(<h1 className={className}>{title}</h1>)
}

export {MainTitle}
