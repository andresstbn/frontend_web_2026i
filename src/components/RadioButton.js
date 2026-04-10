const RadioButton = ({ label, value, checked, onChange }) => {
  return (
    <label style={{ marginRight: "10px" }}>
      <input
        type="radio"
        name="apod-option"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default RadioButton;
