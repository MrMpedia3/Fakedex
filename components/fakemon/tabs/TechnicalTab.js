// 1. Importar os componentes filhos
import { useState } from 'react';
import FakemonAbilities from './FakemonAbilities';
import FakemonStats from './FakemonStats';
import FakemonMoves from './FakemonMoves';
import FakemonRadarChart from './FakemonRadarChart';

/**
 * FakemonTechnicalDetails
 * Este componente monta toda a aba "Técnico", usando componentes menores
 * para Habilidades, Stats e Movimentos.
 */
export default function FakemonTechnicalDetails({ abilities, hidden_ability, base_stats, moves }) {
  const [displayMode, setDisplayMode] = useState('bars');
  
  const toggleDisplayMode = () => {
    setDisplayMode(prevMode => (prevMode === 'bars' ? 'radar' : 'bars'));
  };
  
  return (
    <div className="pt-2">
      
      {/* 1. HABILIDADES */}
      <FakemonAbilities 
        abilities={abilities} 
        hidden_ability={hidden_ability} 
      />

      {/* ======================================== 
        2. CONTROLE DE STATS
        ========================================
      */}
      <h4 className="mt-6 font-semibold mb-2">Base Stats</h4>
      
      {/* Botão de Alternância (Toggle) */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDisplayMode}
          className="px-3 py-1 text-sm rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
        >
          Ver em {displayMode === 'bars' ? 'Gráfico' : 'Barras'}
        </button>
      </div>

      {/* Renderização Condicional dos Stats */}
      {displayMode === 'bars' ? (
        // Se displayMode for 'bars', renderiza o componente de Barras
        <FakemonStats 
          base_stats={base_stats} 
          // O componente FakemonStats precisa ser atualizado para renderizar SÓ as barras
          // (Sem o <h4 className="mt-6 font-semibold mb-2">Base Stats</h4>)
        />
      ) : (
        // Se displayMode for 'radar', renderiza o componente de Gráfico de Radar
        <FakemonRadarChart 
          base_stats={base_stats} 
        />
      )}

      {/* 3. MOVIMENTOS */}
      <FakemonMoves 
        moves={moves} 
      />
    </div>
  );
}