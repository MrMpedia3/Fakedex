import React, { useState, useMemo } from 'react';
import FakemonSearchModal from './FakemonSearchModal'; 
import ComparisonTable from './FakemonComparisonTable'; 
// --- IMPORTAÇÃO DOS SEUS DADOS ---
import allFakemons from '../public/data/fakemon.json';

const FakemonCompare = () => {
    // Estado principal: { number: N, name: 'X', ...data }
    const [comparedFakemons, setComparedFakemons] = useState([]); 
    const MAX_SLOTS = 3; // Limite de 3 Fakémons

    // Estados para controle do Modal de Busca
    const [isSelecting, setIsSelecting] = useState(false);
    // Armazena qual slot (índice 0, 1 ou 2) estamos preenchendo
    const [currentSlotIndex, setCurrentSlotIndex] = useState(null);

    // Função para adicionar/substituir um Fakémon no slot
    const handleFakemonSelect = (fakemonData) => {
        if (currentSlotIndex === null) return;

        setComparedFakemons(prevFakemons => {
            const newList = [...prevFakemons];
            
            // Verifica se o Fakémon já existe e o remove para evitar duplicatas
            const existingIndex = newList.findIndex(f => f.number === fakemonData.number);
            if (existingIndex !== -1) {
                newList.splice(existingIndex, 1);
            }

            // Garante que o Fakémon é adicionado no índice correto para manter a ordem visual
            // Usamos um placeholder nulo para manter o tamanho do array até 3
            while (newList.length < MAX_SLOTS) {
                newList.push(null);
            }
            
            // Coloca o novo Fakémon no slot desejado
            newList[currentSlotIndex] = fakemonData;
            
            // Filtra os nulos antes de salvar o estado, mas o renderSlots compensa isso
            return newList.filter(f => f); 
        });
        
        setIsSelecting(false);
        setCurrentSlotIndex(null);
    };

    // Função para remover um Fakémon
    const removeFakemon = (number) => {
        setComparedFakemons(prevFakemons => prevFakemons.filter(f => f.number !== number));
    };

    // Renderiza os slots: o card do Fakémon ou o botão "+"
    const renderSlots = useMemo(() => {
        // Criamos uma lista com até 3 slots, preenchida com os Fakémons ou null
        const displayList = Array(MAX_SLOTS).fill(null);
        
        // Preenche a lista de exibição com os Fakémons selecionados
        comparedFakemons.forEach((fakemon, index) => {
            // Mapeia o Fakémon para a posição mais à esquerda disponível
            const availableIndex = displayList.findIndex(item => item === null);
            if (availableIndex !== -1) {
                displayList[availableIndex] = { ...fakemon, originalIndex: availableIndex };
            }
        });
        
        return displayList.map((item, i) => {
            if (item) {
                // SLOT COM FAKÉMON SELECIONADO
                return (
                    <div 
                        key={item.number} 
                        className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center w-48 shadow-xl relative transition transform hover:scale-105"
                    >
                        <img 
                            src={item.image || `/images/${item.number}.png`} 
                            alt={item.name} 
                            className="w-20 h-20 object-contain mb-2 bg-white rounded-full p-1" 
                        />
                        <h3 className="font-bold text-gray-800 dark:text-white truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">N°{item.number}</p>
                        <button 
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                            onClick={() => removeFakemon(item.number)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                );
            } else {
                // SLOT VAZIO (BOTÃO "+")
                return (
                    <button 
                        key={i} 
                        className="bg-gray-300 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-5xl w-48 h-48 rounded-lg flex items-center justify-center transition duration-150 hover:bg-gray-400 dark:hover:bg-gray-600 shadow-lg border-2 border-dashed border-gray-500 dark:border-gray-600"
                        onClick={() => {
                            setCurrentSlotIndex(i); // Guarda o índice do slot
                            setIsSelecting(true); // Abre o modal
                        }}
                    >
                        +
                    </button>
                );
            }
        });
    }, [comparedFakemons]);

    return (
        <div className="p-4 sm:p-8 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">⚔️ Comparador de Fakémon</h1>

            {/* Slots de Seleção */}
            <div className="flex justify-start space-x-6 mb-12">
                {renderSlots}
            </div>

            {/* Tabela de Comparação */}
            {comparedFakemons.length >= 2 && (
                <ComparisonTable fakemons={comparedFakemons} />
            )}
            
            {/* Modal de Busca */}
            {isSelecting && (
                <FakemonSearchModal 
                    onSelect={handleFakemonSelect}
                    onClose={() => setIsSelecting(false)}
                    allFakemons={allFakemons} // Passando a lista completa
                />
            )}
            
            {comparedFakemons.length < 2 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10 p-6 border border-dashed rounded-lg">
                    Selecione pelo menos 2 Fakémons nos slots acima para iniciar a comparação detalhada.
                </div>
            )}
        </div>
    );
};

export default FakemonCompare;