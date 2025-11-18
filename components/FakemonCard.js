import Link from "next/link";
import Image from "next/image";
import { typeColors } from "../styles/typeColors";

export default function FakemonCard({ f }) {
  if (!f) return null;

  return (
    <Link href={`/fakemon/${f.id}`} className="block">
      <div
        className="
          fakecard
          relative
          overflow-hidden
          rounded-lg
          shadow
          hover:shadow-lg
          transition
          p-4
          bg-white
          dark:bg-gray-900

          flex flex-col
          items-center
          gap-2
        "
      >
        {/* Número */}
        <div className="absolute left-3 top-3 text-xs font-mono bg-white/70 dark:bg-black/40 px-2 py-1 rounded">
          #{String(f.number).padStart(3, "0")}
        </div>

        {/* Nome */}
        <div className="text-center text-lg font-semibold leading-tight">
          {f.name}
        </div>

        {/* Container da imagem */}
        <div className="w-[150px] h-[150px] flex items-center justify-center">
          <Image
            src={f.image}
            alt={f.name}
            width={120}
            height={120}
            className="object-contain max-h-full max-w-full"
          />
        </div>

        {/* Tipos */}
        <div className="flex justify-center gap-2">
          {f.types.map((t) => (
            <span
              key={t}
              className={`
                px-2 py-1 
                rounded 
                text-xs 
                font-medium 
                shadow
                bg-gradient-to-r 
                ${typeColors[t] ?? "from-gray-400 to-gray-600"}
              `}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
