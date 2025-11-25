import { moveTypeColor } from "../../../styles/typeColors";

// --- Funções Utilitárias ---

// Função para calcular o contraste da cor do texto
const getTextColor = (hex) => {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000" : "#fff";
};

// --- Componente Principal ---

export default function FakemonMoves({ moves }) {
  if (!moves || moves.length === 0) return null;

  return (
    <>
      <h4 className="mt-6 font-semibold mb-2">Movimentos</h4>
      <div className="flex flex-wrap gap-3 mt-2">
        {(moves || []).map((m, i) => {
          // Lógica do ícone de categoria
          const categoryIcon =
            m.category === "physical"
              ? "⚔️"
              : m.category === "special"
              ? "✨"
              : "🌀";

          // Cor de fundo baseada no tipo do movimento
          const bg = moveTypeColor[m.type] || "#666";

          return (
            <div key={i} className="relative inline-block">
              {/* Trigger */}
              <span
                className="px-3 py-1 text-sm rounded-md shadow cursor-help flex items-center gap-1 group inline-flex relative"
                style={{ backgroundColor: bg, color: getTextColor(bg) }}
              >
                {categoryIcon} Lv {m.level}: {m.name}

                {/* Tooltip */}
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 mt-1 w-max max-w-xs 
                             p-2 text-xs rounded-md bg-gray-800 dark:bg-gray-700 text-white shadow 
                             opacity-0 scale-95 pointer-events-none 
                             transition-all duration-200 
                             group-hover:opacity-100 group-hover:scale-100 z-50"
                >
                  <div className="font-semibold text-sm">{m.name}</div>

                  <div className="text-gray-300">
                    {m.category === "physical"
                      ? "Físico"
                      : m.category === "special"
                      ? "Especial"
                      : "Status"}
                  </div>

                  {m.power && (
                    <div>
                      <span className="text-gray-400">Poder:</span> {m.power}
                    </div>
                  )}

                  {m.accuracy && (
                    <div>
                      <span className="text-gray-400">Precisão:</span> {m.accuracy}%
                    </div>
                  )}

                  {m.desc && (
                    <div className="pt-1 border-t border-gray-700">
                      {m.desc}
                    </div>
                  )}
                </div>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}