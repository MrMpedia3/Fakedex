// FakedleHintRow.js

import React from 'react';

// ----------------------------------------------------------------------
// ColorBox (Lógica de status/cor unificada)
// ----------------------------------------------------------------------
const ColorBox = ({ status, content, isType, isBoolean }) => {
    let colorClass = 'bg-gray-400 dark:bg-gray-600'; 
    let symbol = content;
    
    // O status será: 'correct', 'partial' ou 'incorrect'
    
    if (status === 'correct') {
        colorClass = 'bg-green-500'; 
        symbol = isBoolean ? `${content} ✅` : content; 
    } else if (status === 'partial') {
        // Cor para "perto" (yellow)
        colorClass = 'bg-yellow-500'; 
        symbol = content;
    } else if (status === 'incorrect') { 
        colorClass = 'bg-red-500'; 
        
        if (isBoolean) {
            symbol = `${content} ❌`; 
        } else {
            // Para Altura/Peso/Estágio, o conteúdo (valor + seta) já está aqui
            symbol = content; 
        }
    }
    
    return (
        <span className={`
            w-full h-8 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-inner 
            ${colorClass}
            ${isType ? 'px-1 uppercase' : ''}
        `}>
            {symbol}
        </span>
    );
};

// ----------------------------------------------------------------------
// ArrowIndicator (Extrai o status e a direção do objeto)
// ----------------------------------------------------------------------
const ArrowIndicator = ({ hint, value, unit }) => {
    
    // 1. Determinação do Status e Direção
    const isObjectHint = typeof hint === 'object' && hint !== null;

    // Extrai status e direction do objeto, ou assume que a string é o valor (Fallback)
    const direction = isObjectHint ? hint.direction : hint;
    const finalStatus = isObjectHint ? hint.status : hint; 
    
    let symbol = '—'; 
    
    // 2. Formatação do Valor
    let displayValue;
    if (unit === "") {
        displayValue = Math.floor(value).toString(); 
    } else {
        displayValue = value.toFixed(1); 
    }

    // 3. Determinação da Seta/Símbolo
    if (direction === 'up') {
        symbol = '⬆️'; 
    } else if (direction === 'down') {
        symbol = '⬇️'; 
    } else if (direction === 'correct') {
        symbol = '✅'; 
    }
    
    // 4. Conteúdo Combinado (Valor + Unidade + Símbolo)
    const combinedContent = `${displayValue}${unit ? ' ' + unit : ''} ${symbol}`; 
    
    return (
        <div className="flex flex-col items-center w-full"> 
            {/* O ColorBox usa o status e o combinedContent para exibir a cor e o valor/seta */}
            <ColorBox status={finalStatus} content={combinedContent} isBoolean={false} />
        </div>
    );
};


// ----------------------------------------------------------------------
// FakedleHintRow (Chamadas dos componentes)
// ----------------------------------------------------------------------
export default function FakedleHintRow({ guessedFakemon, hints }) {
    if (!hints || !guessedFakemon) return null;

    const imageUrl = guessedFakemon.image;
    const guessTypes = guessedFakemon.types || [];
    
    return (
        <div className="p-3 border rounded-xl flex items-center bg-white dark:bg-gray-700 shadow-lg transition-all duration-300">
            
            {/* 1. Nome e Imagem do Fakémon Adivinhado (Inalterado) */}
            <div className="flex items-center w-1/3 space-x-3 pr-4">
                <img
                    src={imageUrl} 
                    alt={guessedFakemon.name} 
                    className="w-16 h-16 object-contain bg-gray-200 dark:bg-gray-600 rounded-full p-1"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }} 
                />
                <span className="font-semibold text-base truncate text-gray-800 dark:text-gray-200">
                    N°{guessedFakemon.number || '??'} - {guessedFakemon.name || 'Desconhecido'}
                </span>
            </div>
            
            {/* 2. DICAS / FEEDBACK */}
            <div className="flex flex-1 items-center gap-2 text-center">
                
                {/* Tipo 1 e 2 (Inalterados) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tipo 1</span>
                    <ColorBox status={hints.type1} content={guessTypes[0] || '—'} isType={true} />
                </div>
                
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tipo 2</span>
                    {guessTypes.length > 1 ? (
                        <ColorBox status={hints.type2} content={guessTypes[1] || '—'} isType={true} />
                    ) : (
                        <span className="w-full h-8 text-xs text-gray-500 flex items-center justify-center">—</span>
                    )}
                </div>

                {/* Altura - USANDO HINT (OBJETO) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Altura</span>
                    <ArrowIndicator hint={hints.height} value={guessedFakemon.height_m || 0} unit="m" />
                </div>
                
                {/* Peso - USANDO HINT (OBJETO) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Peso</span>
                    <ArrowIndicator hint={hints.weight} value={guessedFakemon.weight_kg || 0} unit="kg" />
                </div>

                {/* Estágio Evolutivo - USANDO HINT (OBJETO) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Estágio</span>
                    <ArrowIndicator 
                        hint={hints.stage} 
                        value={guessedFakemon.evolution_stage || 1} 
                        unit="" 
                    />
                </div>
                
                {/* Linha Final (Inalterado) */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">É Final?</span>
                    <ColorBox 
                        status={hints.isFinal} 
                        content={guessedFakemon.is_final_stage ? 'SIM' : 'NÃO'} 
                        isBoolean={true} 
                    />
                </div>
            </div>
        </div>
    );
}