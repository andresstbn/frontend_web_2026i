function Form({
  id,
  className,
  children,
  onSubmit = (e) => e.preventDefault(),
  ...props
})
{ 
  
  return(
    <form 
      id={id}
      className={className}
      onSubmit={onSubmit}
      {...props}
    >
      {children}      
    </form>
  );
}

export {Form}