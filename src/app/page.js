"use client";

import { useState, useEffect } from "react";

const API_KEY = "NiQAm9c6CJKtNRy5BHcdcDda5kyvj0TdwnhXvK8Q";
const BASE_URL = "https://api.nasa.gov/planetary/apod";


function RadioButton({ id, name, value, label, checked, onChange }) {
  return (
    <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}