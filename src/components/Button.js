function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };

  // Si el variant no existe, cae al estilo primary.
  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export {Button}