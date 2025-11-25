export default function FakemonStats({ base_stats }) {
  if (!base_stats) return null;
  
  // O valor máximo para calcular a porcentagem da barra (180)
  const MAX_STAT_VALUE = 180; 

  return (
    <>
      <h5 className="mt-6 font-semibold mb-2">Barras de Stats</h5>
      <div className="mt-2 space-y-2">
        {Object.entries(base_stats).map(([stat, value]) => {
          let barColor =
            value <= 50
              ? "bg-red-500"
              : value <= 90
              ? "bg-yellow-400"
              : "bg-green-500";
          
          return (
            <div key={stat}>
              <span className="uppercase text-xs font-bold text-gray-600 dark:text-white">
                {stat}
              </span>
              <div className="w-full h-3 bg-gray-300 rounded overflow-hidden">
                <div
                  className={`${barColor} h-full transition-all`}
                  style={{ width: `${(value / MAX_STAT_VALUE) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-white">{value}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}