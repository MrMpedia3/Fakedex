import React, { useState, useMemo } from 'react';
import { analyzeTeam } from '../utils/teamAnalyzer'; 
import TeamAnalysisPanel from './TeamAnalysisTable.jsx';
import FakemonSearchModal from './FakemonSearchModal.js';
// Puxando os dados de onde seu comparador puxa:
import allFakemons from '../public/data/fakemon.json';

const MAX_TEAM_SIZE = 6;

export default function TeamAnalyzerComponent() {
    const [team, setTeam] = useState([]);
    const [showFullAnalysis, setShowFullAnalysis] = useState(false);
    
    // Estados para controle do Modal de Busca
    const [isSelecting, setIsSelecting] = useState(false);
    const [currentSlotIndex, setCurrentSlotIndex] = useState(null);

    // 1. Análise em Tempo Real (Otimizado com useMemo)
    const liveAnalysis = useMemo(() => {
        return analyzeTeam(team);
    }, [team]);
    
    // Função para adicionar/substituir um Fakémon no slot (Lógica do Comparador adaptada)
    const handleFakemonSelect = (fakemonData) => {
        if (currentSlotIndex === null) return;

        setTeam(prevTeam => {
            let newList = [...prevTeam];
            
            // 1. Remove duplicatas (Se o Fakémon já estava no time, ele será movido)
            newList = newList.filter(f => f.number !== fakemonData.number);
            
            // 2. Preenche os slots vazios com 'null' para garantir MAX_TEAM_SIZE slots
            const displayList = Array(MAX_TEAM_SIZE).fill(null);
            newList.forEach((f, i) => {
                 // Coloca os Fakémons existentes da esquerda para a direita
                displayList[i] = f;
            });

            // 3. Coloca o novo Fakémon no slot desejado
            displayList[currentSlotIndex] = fakemonData;

            // 4. Salva apenas os Fakémons (remove os 'null')
            return displayList.filter(f => f); 
        });
        
        setShowFullAnalysis(false); 
        setIsSelecting(false);
        setCurrentSlotIndex(null);
    };

    // Função para remover um Fakémon pelo número
    const removeFakemon = (number) => {
        setTeam(prevTeam => prevTeam.filter(f => f.number !== number));
        setShowFullAnalysis(false);
    };

    // Função para limpar o time
    const clearTeam = () => {
        setTeam([]);
        setShowFullAnalysis(false);
    };

    // Renderiza os 6 slots visuais
    const renderSlots = useMemo(() => {
        // Criar uma lista visual que preenche da esquerda para a direita
        const displayList = Array(MAX_TEAM_SIZE).fill(null);
        team.forEach((fakemon, i) => {
            displayList[i] = fakemon;
        });
        
        return Array.from({ length: MAX_TEAM_SIZE }).map((_, i) => {
            const item = displayList[i];
            
            if (item) {
                // SLOT COM FAKÉMON SELECIONADO (Botão de remover e imagem)
                return (
                    <div 
                        key={item.number} 
                        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg flex flex-col items-center w-full shadow-xl relative transition transform hover:scale-105"
                    >
                        <img 
                            src={item.image || `/images/${item.number}.png`} 
                            alt={item.name} 
                            className="w-12 h-12 object-contain bg-white rounded-full p-1 mb-1" 
                        />
                        <h3 className="font-bold text-gray-800 dark:text-white text-xs truncate w-full text-center">{item.name}</h3>
                        
                        <button 
                            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700 font-bold"
                            onClick={() => removeFakemon(item.number)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                );
            } else {
                // SLOT VAZIO (Botão "+")
                return (
                    <button 
                        key={i} 
                        className="bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-3xl h-20 w-full rounded-lg flex items-center justify-center transition duration-150 hover:bg-gray-400 dark:hover:bg-gray-600 shadow-lg border-2 border-dashed border-gray-500 dark:border-gray-600"
                        onClick={() => {
                            setCurrentSlotIndex(i); 
                            setIsSelecting(true); 
                        }}
                    >
                        +
                    </button>
                );
            }
        });
    }, [team]);


    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Coluna Principal: Seleção e Botões */}
            <div className="lg:w-2/3">
                <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">
                    Monte seu Time ({team.length}/{MAX_TEAM_SIZE})
                </h2>
                
                {/* Visualização dos Slots (6 colunas) */}
                <div className="grid grid-cols-6 gap-3 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
                    {renderSlots}
                </div>
                
                {/* Botões de Ação */}
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={() => setShowFullAnalysis(true)} 
                        disabled={team.length < 1}
                        className={`w-1/2 py-3 text-lg font-bold rounded-lg transition duration-200 shadow-md
                                   ${team.length > 0 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    >
                        Analisar Time Estrategicamente
                    </button>
                    <button 
                        onClick={clearTeam} 
                        disabled={team.length === 0}
                        className={`w-1/2 py-3 text-lg font-bold rounded-lg transition duration-200 border-2 
                                   ${team.length > 0 ? 'border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' : 'text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-700'}`}
                    >
                        Limpar Time
                    </button>
                </div>
                
                {team.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-10 p-6 border border-dashed rounded-lg">
                        Use o botão **+** nos slots acima para adicionar Fakémons e iniciar a análise.
                    </div>
                )}
            </div>
            
            {/* Coluna Lateral: Painel de Análise */}
            <div className="lg:w-1/3 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-xl h-fit sticky top-4">
                <TeamAnalysisPanel 
                    analysis={liveAnalysis} 
                    teamSize={team.length}
                    showFullAnalysis={showFullAnalysis}
                />
            </div>

            {/* Modal de Busca */}
            {isSelecting && (
                <FakemonSearchModal 
                    onSelect={handleFakemonSelect}
                    onClose={() => setIsSelecting(false)}
                    allFakemons={allFakemons} 
                />
            )}
        </div>
    );
}