import Image from "next/image";

export default function FakemonSizeComparison({ height_m, image, name }) {
  // Define a altura máxima de exibição para dimensionar corretamente os elementos
  const maxDisplayHeight = Math.max(height_m || 0, 1.7);
  // Define o valor em pixels para a altura da régua (200px na sua implementação original)
  const RULE_HEIGHT_PX = 200; 

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg mb-4">
        Comparação de Tamanho
      </h3>

      <div className="flex items-end gap-8">
        {/* Régua */}
        <div className="flex flex-col justify-between h-52 border-l-2 border-gray-700 pr-3">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const value = (maxDisplayHeight - (maxDisplayHeight / 5) * i).toFixed(1);
            return (
              <span key={i} className="text-xs text-gray-600">
                {value}m
              </span>
            );
          })}
        </div>

        {/* Fakemon */}
        <div className="flex flex-col items-center">
          <Image
            src={image}
            alt={name}
            width={120}
            height={120}
            style={{
              // Calcula a altura do Fakemon em relação ao tamanho máximo de exibição
              height: `${(height_m / maxDisplayHeight) * RULE_HEIGHT_PX}px`,
              width: "auto",
            }}
          />
        </div>

        {/* Humano (1.7m como referência) */}
        <div className="flex flex-col items-center">
          <Image
            src="/images/person(resize).png"
            alt="Pessoa"
            width={120}
            height={120}
            style={{
              // Calcula a altura do humano em relação ao tamanho máximo de exibição
              height: `${(1.7 / maxDisplayHeight) * RULE_HEIGHT_PX}px`,
              width: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}