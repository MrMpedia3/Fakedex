import React from 'react';

// ----------------------------------------------------------------------
// ColorBox (CORRIGIDO: Exibe SIM/NÃO junto com ✅/❌ no caso isBoolean)
// ----------------------------------------------------------------------
const ColorBox = ({ status, content, isType, isBoolean }) => {
    let colorClass = 'bg-gray-400 dark:bg-gray-600'; 
    let symbol = content;
    
    if (status === 'correct') {
        colorClass = 'bg-green-500'; 
        // Se for um booleano (Final), mostra o texto ("SIM"/"NÃO") seguido por ✅
        symbol = isBoolean ? `${content} ✅` : content; 
    } else if (status === 'partial') {
        colorClass = 'bg-yellow-500'; 
        symbol = isType ? content : '🟨';
    } else if (status === 'incorrect') {
        colorClass = 'bg-red-500'; 
        
        // Se for booleano (Final), mostra o texto seguido por ❌
        if (isBoolean) {
            symbol = `${content} ❌`; 
        } else {
            // Para Altura/Peso/Estágio, mantém o conteúdo combinado (valor + seta)
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
// ArrowIndicator (Garante a seta no erro e o valor no acerto)
// ----------------------------------------------------------------------
const ArrowIndicator = ({ direction, value, unit }) => {
    let symbol = '—'; 
    let status = 'incorrect'; 
    
    // 1. Formatação do Valor
    let displayValue;
    if (unit === "") {
        displayValue = Math.floor(value).toString(); 
    } else {
        displayValue = value.toFixed(1); 
    }

    // 2. Determinação da Seta e Status
    if (direction === 'up') {
        symbol = '⬆️'; 
        status = 'incorrect';
    } else if (direction === 'down') {
        symbol = '⬇️'; 
        status = 'incorrect';
    } else if (direction === 'correct') {
        symbol = '✅'; 
        status = 'correct';
    }

    // 3. CONTEÚDO COMBINADO (Valor + Unidade + Símbolo)
    const combinedContent = `${displayValue}${unit ? ' ' + unit : ''} ${symbol}`; 
    
    return (
        <div className="flex flex-col items-center w-full"> 
            <ColorBox status={status} content={combinedContent} isBoolean={false} />
        </div>
    );
};


// ----------------------------------------------------------------------
// FakedleHintRow (Estrutura Principal)
// ----------------------------------------------------------------------
export default function FakedleHintRow({ guessedFakemon, hints }) {
    if (!hints || !guessedFakemon) return null;

    const imageUrl = guessedFakemon.image || `/images/${guessedFakemon.number}.png`; 
    const guessTypes = guessedFakemon.types || [];
    
    return (
        <div className="p-3 border rounded-xl flex items-center bg-white dark:bg-gray-700 shadow-lg transition-all duration-300">
            
            {/* 1. Nome e Imagem do Fakémon Adivinhado */}
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
                
                {/* Tipo 1 */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tipo 1</span>
                    <ColorBox status={hints.type1} content={guessTypes[0] || '—'} isType={true} />
                </div>
                
                {/* Tipo 2 */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tipo 2</span>
                    {guessTypes.length > 1 ? (
                        <ColorBox status={hints.type2} content={guessTypes[1] || '—'} isType={true} />
                    ) : (
                        <span className="w-full h-8 text-xs text-gray-500 flex items-center justify-center">—</span>
                    )}
                </div>

                {/* Altura */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Altura</span>
                    <ArrowIndicator direction={hints.height} value={guessedFakemon.height_m || 0} unit="m" />
                </div>
                
                {/* Peso */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Peso</span>
                    <ArrowIndicator direction={hints.weight} value={guessedFakemon.weight_kg || 0} unit="kg" />
                </div>

                {/* Estágio Evolutivo */}
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Estágio</span>
                    <ArrowIndicator 
                        direction={hints.stage} 
                        value={guessedFakemon.evolution_stage || 1} 
                        unit="" 
                    />
                </div>
                
                {/* Linha Final - AGORA COM SIM/NÃO E ACERTO/ERRO EXPLÍCITO */}
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