import { motion } from "framer-motion";

// O valor máximo para calcular a porcentagem e a cor
const MAX_STAT_VALUE = 255;

/**
 * Mapeia o valor do stat para uma cor HSL na escala Vermelho (0) a Verde (120).
 * Isso permite um gradiente contínuo de cores.
 * @param {number} value - O valor do stat (0 a 255).
 * @returns {string} A cor em formato HSL.
 */
const getContinuousStatColor = (value) => {
    // Normaliza o valor para uma escala de 0 a 1
    const normalized = Math.min(value, MAX_STAT_VALUE) / MAX_STAT_VALUE;
    
    // Mapeia o valor normalizado para o Matiz (Hue) HSL,
    // onde 0 (vermelho) -> 120 (verde).
    // Para inverter a escala (baixo = vermelho, alto = verde):
    // Matiz = normalized * 120
    const hue = normalized * 120;
    
    // Saturation e Lightness são constantes para manter a intensidade da cor.
    return `hsl(${hue}, 80%, 50%)`;
};


export default function FakemonStats({ base_stats }) {
  if (!base_stats) return null;

  return (
    <>
      <h5 className="mt-6 font-semibold mb-2">Barras de Stats</h5>
      <div className="mt-2 space-y-2">
        {Object.entries(base_stats).map(([stat, value]) => {
          
          // 1. Calcula a largura final
          const finalWidth = `${(value / MAX_STAT_VALUE) * 100}%`;
          
          // 2. Calcula a cor final (HSL)
          const finalColor = getContinuousStatColor(value);

          // O HSL inicial (0) é o Vermelho
          const initialColor = 'hsl(0, 80%, 50%)'; 

          return (
            <div key={stat}>
              <span className="uppercase text-xs font-bold text-gray-600 dark:text-white">
                {stat}
              </span>
              <div className="w-full h-3 bg-gray-300 rounded overflow-hidden relative">
                
                {/* APLICAÇÃO DA ANIMAÇÃO */}
                <motion.div
                  // Animação de Largura (0% até o valor real)
                  initial={{ width: "0%", backgroundColor: initialColor }}
                  animate={{ 
                      width: finalWidth, 
                      backgroundColor: finalColor // Anima a cor de Vermelho para a cor final
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  
                  className={`h-full absolute`} 
                  // Usamos 'absolute' para que a div de cor não influencie o layout
                >
                    {/* O valor é colocado na barra, se quiser */}
                    <span className="absolute right-1 top-0 text-[10px] font-bold text-white leading-none">
                        {value}
                    </span>
                </motion.div>
              </div>
              
              {/* Mantemos o valor fora da barra para fallback (opcional) */}
              <span className="text-xs text-gray-500 dark:text-white">{value}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}