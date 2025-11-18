import React from "react";

/**
 * Controlled Tabs component.
 * Props:
 * - active (number) : índice da aba ativa
 * - onChange (fn) : (index) => void
 * - tabs (array) : [{ label, content }]
 *
 * IMPORTANT: não remonta o conteúdo — apenas alterna classes para permitir animações.
 */
export default function Tabs({ active = 0, onChange = () => {}, tabs = [] }) {
  return (
    <div>
      <div className="flex gap-4 mb-4 border-b border-gray-300/30 dark:border-gray-700/30 pb-2">
        {tabs.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`relative px-4 py-2 rounded-t-lg font-semibold transition-all ${
                isActive
                  ? "bg-white/80 dark:bg-black/40 text-black dark:text-white shadow"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {t.label}
              {isActive && <span className="absolute left-0 -bottom-[2px] w-full h-[3px] bg-blue-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Painéis: todos montados, controlamos visibilidade para animação */}
      <div className="relative">
        {tabs.map((t, i) => {
          const visible = i === active;
          return (
            <div
              key={i}
              aria-hidden={!visible}
              className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"}`}
            >
              {t.content}
            </div>
          );
        })}
        {/* espaço reservado quando os painéis são position absolute */}
        <div aria-hidden="true" className="h-0" />
      </div>
    </div>
  );
}
