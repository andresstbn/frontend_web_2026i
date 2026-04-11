export default function RadioButton({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  )
}
