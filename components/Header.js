import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="
      fixed top-0 left-0 w-full z-50
      flex items-center justify-between
      py-4 px-6 shadow-md
      bg-red-600 text-white
      dark:bg-green-600 dark:text-white
      transition-colors duration-300
    ">
      <Link href="/">
        {/* Logo com animação */}
        <h1 className="
          text-2xl font-bold cursor-pointer select-none
          animate-logoPulse
        ">
          Fakedex
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
