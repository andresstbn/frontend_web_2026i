function Title({
    title,
    className = "text-xl font-bold"
}){
    return(<h2 className={className}>{title}</h2>)
}

export {Title}
