// components/FakemonSearchModal.js (Simplificado para o exemplo)
import React, { useState } from 'react';
// Importe seu array de todos os Fakémons aqui
// import allFakemons from '../data/allFakemons.json'; 

const FakemonSearchModal = ({ onSelect, onClose, allFakemons }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Simulação de Filtro (Você deve substituir isso pela sua lógica real)
    const filteredFakemons = allFakemons 
        ? allFakemons.filter(f => 
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.number.toString().includes(searchTerm)
          ).slice(0, 10) // Limita os resultados
        : [];

    const handleFakemonClick = (fakemon) => {
        // Envia o objeto Fakémon completo para o componente pai
        onSelect(fakemon); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" 
                onClick={(e) => e.stopPropagation()} // Impede que o clique feche o modal
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Selecionar Fakémon</h2>
                
                {/* Campo de Busca */}
                <input
                    type="text"
                    placeholder="Buscar por nome ou número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />

                {/* Lista de Resultados */}
                <div className="space-y-2">
                    {filteredFakemons.length > 0 ? (
                        filteredFakemons.map(f => (
                            <div 
                                key={f.number} 
                                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                onClick={() => handleFakemonClick(f)}
                            >
                                <img 
                                    src={f.image || `/images/${f.number}.png`} 
                                    alt={f.name} 
                                    className="w-8 h-8 object-contain mr-3" 
                                />
                                <span className="font-medium text-gray-800 dark:text-white">
                                    N°{f.number} - {f.name}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Nenhum resultado encontrado.</p>
                    )}
                </div>
                
                <button 
                    onClick={onClose} 
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-bold transition duration-200"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default FakemonSearchModal;