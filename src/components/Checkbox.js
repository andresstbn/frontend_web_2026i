function Checkbox({
  id,
  name,
  value,
  label,
  className = "",
  ...props
}) {
  // id y name son opcionales, pero se recomiendan en formularios para accesibilidad y envío de datos.
  return (
    <label htmlFor={id || undefined} className={`inline-flex cursor-pointer items-center gap-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        {...props}
      />
      {/* Texto opcional para explicar el propósito del checkbox. */}
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  );
}

export {Checkbox}