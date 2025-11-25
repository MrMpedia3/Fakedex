import FakemonSizeComparison from './FakemonSizeComparison';

export default function FakemonEncyclopedia({ description, height_m, weight_kg, image, name }) {
  return (
    <div className="pt-2">
      {/* Descrição em Enciclopédia */}
      <div className="space-y-3 leading-relaxed">
        {description.split("\n").map(
          (para, i) => para.trim() !== "" && <p key={i}>{para}</p>
        )}
      </div>

      <br />
      <hr />
      <br />

      <p><strong>Altura:</strong> {height_m} m</p>
      <p><strong>Peso:</strong> {weight_kg} kg</p>

      {/* Comparação de Tamanho (Componente Filho) */}
      <FakemonSizeComparison 
        height_m={height_m} 
        image={image} 
        name={name} 
      />
    </div>
  );
}