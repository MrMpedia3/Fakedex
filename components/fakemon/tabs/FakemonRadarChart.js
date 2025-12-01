import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function FakemonRadarChart({ base_stats }) {
  if (!base_stats) return null;

  // Adaptar seus stats para o formato que o Recharts espera
  // Recharts espera um array de objetos, onde cada objeto tem:
  // - um nome de "eixo" (ex: "HP", "Ataque")
  // - o valor real do stat
  // - um valor máximo para o eixo (para dimensionar o gráfico)
  const data = [
    { stat: "HP", A: base_stats.hp, fullMark: 255 }, // 'A' é o valor do Fakemon, fullMark é o valor máximo
    { stat: "Atk", A: base_stats.atk, fullMark: 255 },
    { stat: "Def", A: base_stats.def, fullMark: 255 },
    { stat: "Sp. Atk", A: base_stats.spa, fullMark: 255 },
    { stat: "Sp. Def", A: base_stats.spd, fullMark: 255 },
    { stat: "Spe", A: base_stats.spe, fullMark: 255 },
  ];

  // Você pode ajustar o fullMark com base nos seus Fakemon mais fortes,
  // ou usar um valor fixo como 255 (máximo em Pokémon). 255 parece ser um bom valor
  // com base no cálculo da sua barra de stats.

  return (
    <div className="mt-8">
      <h5 className="font-semibold text-lg mb-4">Gráfico de Stats</h5>
      <div style={{ width: '100%', height: 300 }}> {/* Container com altura definida */}
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#666" /> {/* Cor da grade */}
            <PolarAngleAxis dataKey="stat" stroke="#888" /> {/* Nomes dos stats */}
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 255]} // Definir o domínio min/max do eixo
              stroke="#888" 
              tickFormatter={(value) => `${value}`} // Formato dos valores no eixo
            />
            <Radar
              name={base_stats.name || "Fakemon"} // Nome que aparece no tooltip
              dataKey="A" // Onde os dados estão (valor real do stat)
              stroke="#8884d8" // Cor da linha do radar
              fill="#8884d8" // Cor de preenchimento do radar
              fillOpacity={0.6} // Opacidade
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}