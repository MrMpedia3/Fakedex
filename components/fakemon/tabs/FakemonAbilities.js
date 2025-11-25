export default function FakemonAbilities({ abilities, hidden_ability }) {
  if ((!abilities || abilities.length === 0) && !hidden_ability) return null;

  const renderTooltip = (name, desc, colorClass) => (
    <div className="relative inline-block">
      {/* Trigger do hover */}
      <span className={`px-3 py-1 text-sm rounded-md ${colorClass} cursor-help shadow group inline-block relative`}>
        {name}

        {/* Tooltip */}
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-1 w-max max-w-xs 
                     p-2 text-xs rounded-md bg-gray-800 dark:bg-gray-700 text-white shadow 
                     opacity-0 scale-95 pointer-events-none 
                     transition-all duration-200 
                     group-hover:opacity-100 group-hover:scale-100 z-50"
        >
          {desc}
        </div>
      </span>
    </div>
  );

  return (
    <>
      {/* HABILIDADES NORMAIS */}
      <h4 className="mt-4 font-semibold mb-2">Habilidades</h4>
      <div className="flex flex-wrap gap-3">
        {(abilities || []).map((ab, i) => (
          <span key={i}>
            {renderTooltip(ab.name, ab.desc, "bg-gray-600")}
          </span>
        ))}
      </div>

      {/* HABILIDADE OCULTA */}
      {hidden_ability && (
        <>
          <h4 className="mt-4 font-semibold mb-2 text-purple-600">
            Habilidade Oculta
          </h4>
          <div className="flex flex-wrap gap-3">
            {renderTooltip(hidden_ability.name, hidden_ability.desc, "bg-purple-600")}
          </div>
        </>
      )}
    </>
  );
}