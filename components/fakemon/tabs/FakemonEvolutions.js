// components/FakemonDetalhes/FakemonEvolutions.js
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

// Este componente precisa da função de navegação para fazer a transição suave
export default function FakemonEvolutions({ currentFakemon, evolutions, setFakemonState }) {
  const router = useRouter();

  // Função que lida com o clique na evolução (usa o setF(null) e navega)
  const handleEvolutionClick = useCallback((newId) => {
    // 1. Reseta o estado (f = null) para mostrar "Carregando..."
    setFakemonState(null); 
    // 2. Navega para a nova página
    router.push(`/fakemon/${newId}`);
  }, [router, setFakemonState]);

  if (!evolutions || evolutions.length === 0) return null;

  return (
    <div className="mt-6">
      <hr />
      <br />
      <h3 className="font-bold text-lg mb-3">Linha Evolutiva</h3>

      <div className="flex flex-wrap items-center gap-6">
        {/* Fakemon Atual */}
        <div className="text-center">
          <Image src={currentFakemon.image} alt={currentFakemon.name} width={80} height={80} />
          <div className="font-semibold">{currentFakemon.name}</div>
          <div className="text-xs text-gray-500">#{currentFakemon.number}</div>
        </div>

        {/* Evoluções Mapeadas */}
        {evolutions.map((ev) => (
          <div key={ev.id} className="flex items-center gap-6">
            <div className="text-2xl animate-pulseArrow">➡️</div>

            <div
              className="text-center cursor-pointer hover:scale-105 transition"
              onClick={() => handleEvolutionClick(ev.id)}
            >
              <Image src={ev.image} alt={ev.name} width={80} height={80} />
              <div className="font-semibold">{ev.name}</div>
              <div className="text-xs text-gray-500">#{ev.number}</div>
              <div className="text-xs text-purple-600 mt-1">{ev.method}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}