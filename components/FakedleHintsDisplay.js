import React from 'react';
import { TypeBadge } from './FakemonCard'; // Reutilizamos o TypeBadge

// Função auxiliar para censurar o nome do Fakémon na Dex Entry
const censorName = (text, fakemonName) => {
    if (!text || !fakemonName) return text;
    // Cria uma string de traços do mesmo tamanho do nome
    const censorship = '█'.repeat(fakemonName.length); 
    // Substitui o nome (case-insensitive)
    const regex = new RegExp(fakemonName, 'gi');
    return text.replace(regex, censorship);
};

// CONSTANTE DE CONFIGURAÇÃO DO INTERVALO
// Defina aqui quantos números o intervalo deve ter (ímpar é melhor para centralizar)
const WINDOW_SIZE = 7; 
const MARGIN = Math.floor(WINDOW_SIZE / 2); // 3 para um WINDOW_SIZE de 7

export default function FakedleHintsDisplay({ attempts, targetFakemon }) {
    
    // Garantir que temos o Fakémon alvo para as dicas
    if (!targetFakemon) return null;

    const { name, types, entry, id } = targetFakemon;
    const isFirstHint = attempts >= 5;
    const isSecondHint = attempts >= 10;
    const isThirdHint = attempts >= 15;

    // Dica 1: Entrada da Dex (Censurada)
    const hint1Content = isFirstHint 
        ? censorName(entry || "Entrada da Dex não disponível.", name)
        : `Dica da Dex (Disponível em 5 tentativas)`;

    // ----------------------------------------------------------------------
    // Dica 3: Range da Dex (AGORA DINÂMICO)
    // ----------------------------------------------------------------------
    
    // 1. Calcula o início do intervalo, garantindo que nunca seja menor que N° 1
    const rangeStart = Math.max(1, id - MARGIN); 
    
    // 2. Calcula o fim do intervalo
    const rangeEnd = id + MARGIN; 

    // 3. Monta o conteúdo da dica
    let hint3Content = `Entre N° ${rangeStart} e N° ${rangeEnd}`;
    
    // ----------------------------------------------------------------------

    return (
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">Dicas (Tentativas: {attempts})</h3>
            
            <div className="space-y-4">
                
                {/* DICA 1: DEX ENTRY */}
                <div className={`p-3 rounded-lg border transition-opacity duration-500 ${isFirstHint ? 'opacity-100 bg-yellow-50 dark:bg-gray-700 border-yellow-200' : 'opacity-40 bg-gray-50 dark:bg-gray-700 border-gray-300'}`}>
                    <h4 className="font-semibold mb-1">Dica 1: Entrada da Dex</h4>
                    <p className="text-sm italic">{hint1Content}</p>
                </div>

                {/* DICA 2: TIPOS */}
                <div className={`p-3 rounded-lg border transition-opacity duration-500 ${isSecondHint ? 'opacity-100 bg-yellow-50 dark:bg-gray-700 border-yellow-200' : 'opacity-40 bg-gray-50 dark:bg-gray-700 border-gray-300'}`}>
                    <h4 className="font-semibold mb-1">Dica 2: Tipos</h4>
                    {isSecondHint ? (
                        <div className="flex space-x-2 mt-1">
                            {types.map(type => (
                                <TypeBadge key={type} type={type} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm">Disponível em 10 tentativas.</p>
                    )}
                </div>

                {/* DICA 3: RANGE DA DEX */}
                <div className={`p-3 rounded-lg border transition-opacity duration-500 ${isThirdHint ? 'opacity-100 bg-yellow-50 dark:bg-gray-700 border-yellow-200' : 'opacity-40 bg-gray-50 dark:bg-gray-700 border-gray-300'}`}>
                    <h4 className="font-semibold mb-1">Dica 3: Range de N° da Dex</h4>
                    {isThirdHint ? (
                        <p className="text-sm font-mono">{hint3Content}</p>
                    ) : (
                        <p className="text-sm">Disponível em 15 tentativas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}