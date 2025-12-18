import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="
      fixed top-0 left-0 w-full z-50
      flex items-center justify-between
      py-2 px-6 shadow-md
      bg-red-600 text-white
      dark:bg-green-600 dark:text-white
      transition-colors duration-300
    ">
      <Link href="/">
        <h1 className="
          text-2xl font-bold cursor-pointer select-none
          animate-logoPulse
        ">
          Fakedex
        </h1>
      </Link>

      {/* Ajustando gap-3 para separar os botões de navegação e o ThemeToggle */}
      <div className="flex items-center gap-3">
        
        {/* 🎮 BOTÃO DO FAKÉDLE 🎮 */}
        <Link href="/fakedle" passHref>
          <button
            className="
              p-2 sm:px-3 sm:py-1 rounded-full font-bold transition duration-300
              bg-white text-red-600 hover:bg-gray-200 
              dark:bg-gray-100 dark:text-green-600 dark:hover:bg-gray-300
              flex items-center justify-center gap-1
            "
          >
            <span className="text-lg">🎮</span> 
            <span className="hidden sm:inline">Fakédle</span>
          </button>
        </Link>
        
        {/* ⚔️ BOTÃO DO COMPARADOR ⚔️ */}
        <Link href="/comparar" passHref>
          <button
            className="
              p-2 sm:px-3 sm:py-1 rounded-full font-bold transition duration-300
              bg-white text-red-600 hover:bg-gray-200 
              dark:bg-gray-100 dark:text-green-600 dark:hover:bg-gray-300
              flex items-center justify-center gap-1
            "
          >
            <span className="text-lg">⚔️</span> 
            <span className="hidden sm:inline">Comparar</span>
          </button>
        </Link>
        
        {/* 🧠 NOVO BOTÃO DE ANÁLISE DE TIME 🧠 */}
        <Link href="/analise-de-time" passHref>
          <button
            className="
              p-2 sm:px-3 sm:py-1 rounded-full font-bold transition duration-300
              bg-white text-red-600 hover:bg-gray-200 
              dark:bg-gray-100 dark:text-green-600 dark:hover:bg-gray-300
              flex items-center justify-center gap-1
            "
          >
            <span className="text-lg">🧠</span> 
            <span className="hidden sm:inline">Analisar Time</span>
          </button>
        </Link>
        
        {/* ThemeToggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}