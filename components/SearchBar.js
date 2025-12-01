import { useState, useEffect } from "react";

export default function SearchBar({ data, onSearch }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function handleChange(e) {
    const text = e.target.value;
    setValue(text);
    onSearch(text);

    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }

    const s = data
      .filter(f =>
        f.name.toLowerCase().includes(text.toLowerCase())
      )
      .slice(0, 3); // Limita a 6 sugestões

    setSuggestions(s);
  }

  function selectSuggestion(name) {
    setValue(name);
    setSuggestions([]);
    onSearch(name);
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Pesquisar por nome..."
        value={value}
        onChange={handleChange}
        className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white mt-16"
      />

      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg z-50">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => selectSuggestion(s.name)}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {s.number} — {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
