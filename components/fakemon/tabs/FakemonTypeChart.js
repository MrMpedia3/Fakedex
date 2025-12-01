import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { typeChart, allTypes, effectivenessLabels } from '../../../utils/typeChartData';

/**
 * Calcula a efetividade defensiva do Fakémon contra todos os tipos.
 * @param {string[]} types - Array de tipos do Fakémon.
 * @returns {object} Um objeto onde a chave é o fator de dano (0, 0.25, 0.5, 1, 2, 4) e o valor é um array de tipos atacantes.
 */
const calculateDefenseEffectiveness = (types) => {
    // Inicializa o resultado com 1x dano para todos os tipos (o padrão)
    const effectivenessMap = allTypes.reduce((acc, type) => {
        acc[type] = 1;
        return acc;
    }, {});
    
    // Calcula a efetividade defensiva combinada
    allTypes.forEach(attackingType => {
        let finalMultiplier = 1;

        // Itera sobre cada tipo defensivo do Fakémon (máx. 2)
        types.forEach(defendingType => {
            const chartEntry = typeChart[attackingType];
            
            // LÓGICA DE CÁLCULO
            const damageFactor = (chartEntry && chartEntry[defendingType] !== undefined)
                ? chartEntry[defendingType]
                : 1;

            finalMultiplier *= damageFactor;
        });
        
        // Armazena o multiplicador final
        effectivenessMap[attackingType] = finalMultiplier;
    });
    
    // Organiza os resultados em categorias de dano (4x, 2x, 1x, 0.5x, 0.25x, 0x)
    const organizedResults = {
        4: [], 2: [], 1: [], 0.5: [], 0.25: [], 0: []
    };

    Object.entries(effectivenessMap).forEach(([type, multiplier]) => {
        
        // Arredonda o multiplicador para uma casa decimal (ou duas)
        // Se a multiplicação deu 0.24999, o arredondamento garantirá que seja 0.25
        const roundedMultiplier = parseFloat(multiplier.toFixed(2));

        if (roundedMultiplier === 4) {
             organizedResults[4].push(type);
        } else if (roundedMultiplier === 2) {
            organizedResults[2].push(type);
        } else if (roundedMultiplier === 1) {
            organizedResults[1].push(type);
        } else if (roundedMultiplier === 0.5) {
            organizedResults[0.5].push(type);
        } else if (roundedMultiplier === 0.25) {
            organizedResults[0.25].push(type);
        } else if (roundedMultiplier === 0) {
            organizedResults[0].push(type);
        } else {
             // fallback caso algo inesperado ocorra
             organizedResults[1].push(type);
             console.warn(`Multiplicador inesperado (${roundedMultiplier}) para o tipo ${type}. Classificado como 1x.`);
        }
    });

    return organizedResults;
};


export default function FakemonTypeChart({ types, typeColorMap }) {
    
    // Usa useMemo para recalcular apenas quando os tipos mudarem
    const defenseChart = useMemo(() => calculateDefenseEffectiveness(types), [types]);
    const [isOpen, setIsOpen] = useState(false);

    // Define a ordem de exibição (Fraquezas, Neutras, Resistências, Imunidades)
    const displayOrder = [4, 2, 1, 0.5, 0.25, 0];

    return (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left flex justify-between items-center pb-2 border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none"
            >
                <h3 className="text-xl font-bold">Efetividade Defensiva</h3>
                {/* Ícone de seta simples que gira com o estado */}
                <motion.span 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl"
                >
                    ▼
                </motion.span>
            </button>
            {/* CONTEÚDO ANIMADO */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        // Animação de Altura
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden pt-3" // Importante para ocultar o conteúdo
                    >
                        <div className="space-y-4">
                            {displayOrder.map(multiplier => {
                                const attackingTypes = defenseChart[multiplier];
                                
                                if (attackingTypes.length === 0) return null;

                                // Define o rótulo de dano (ex: '2x', '1/2x', '0x') e cor de destaque
                                const label = effectivenessLabels[multiplier];
                                let labelClass = "font-bold text-lg ";

                                if (multiplier === 4 || multiplier === 2) {
                                    labelClass += "text-red-600 dark:text-red-400"; // Fraqueza
                                } else if (multiplier === 0.5 || multiplier === 0.25) {
                                    labelClass += "text-green-600 dark:text-green-400"; // Resistência
                                } else if (multiplier === 0) {
                                    labelClass += "text-blue-600 dark:text-blue-400"; // Imunidade
                                }

                                return (
                                    <div key={multiplier} className="border-b pb-3">
                                        <div className={labelClass}>
                                            {label} Dano de:
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {attackingTypes.map(type => (
                                                <span
                                                    key={type}
                                                    className="px-3 py-1 rounded-full text-sm text-white shadow-md font-semibold"
                                                    style={{ backgroundColor: typeColorMap[type] || '#888' }} 
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {types.length === 0 && (
                            <p className="text-gray-500 italic">Tipos não definidos. O dano é neutro (1x) contra todos os tipos.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}