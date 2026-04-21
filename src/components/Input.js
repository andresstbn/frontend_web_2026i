function Input({
  id,
  label,
  error,
  className = "",
  ...props
}) {
  // id es opcional, pero se recomienda para conectar el label con el input en formularios.
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id || undefined} className="mb-1 block text-sm font-medium text-gray-700 dark:text-yellow-100">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
        {...props}
      />

      {/* Mensaje corto para mostrar validaciones del formulario. */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export {Input}
