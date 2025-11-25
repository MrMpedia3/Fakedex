import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Inicializa apenas no cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("fakedex-theme");
    if (saved) {
      setIsDark(saved === "dark");
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      // opcional: detectar preferência do sistema
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("fakedex-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
    }
  }

  return (
    <button onClick={toggle} aria-label="Alternar tema" className="px-3 py-2 rounded bg-gray-300 dark:bg-gray-800 text-black dark:text-white">
      {isDark ? "🌙 Escuro" : "☀️ Claro"}
    </button>
  );
}
