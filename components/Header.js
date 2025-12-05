import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="
      fixed top-0 left-0 w-full z-50
      flex items-center justify-between
      // CORREÇÃO: Reduzindo o padding vertical de py-4 para py-2
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

      {/* CORREÇÃO: Adicionando gap-3 para separar o botão Fakédle do ThemeToggle */}
      <div className="flex items-center gap-3">
        
        {/* 🎮 BOTÃO DO FAKÉDLE AGORA É UM LINK 🎮 */}
        <Link href="/fakedle" passHref>
          <button
            className="
              // CORREÇÃO: Reduzindo o padding vertical (py-1) para diminuir a altura do botão
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
        
        {/* ThemeToggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}