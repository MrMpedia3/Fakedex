import FakemonEvolutions from './FakemonEvolutions';

export default function FakemonBasicInfo({ entry, currentFakemon, evolutions, setFakemonState }) {
  return (
    <div className="pt-2">
      <p className="text-lg leading-relaxed">{entry}</p>
      
      <FakemonEvolutions 
        currentFakemon={currentFakemon}
        evolutions={evolutions} 
        setFakemonState={setFakemonState} // Passamos a função de reset de estado
      />
    </div>
  );
}