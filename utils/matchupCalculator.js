// utils/matchupCalculator.js (VERSÃO CORRIGIDA)

import { TypeChart } from './TypeChartData'; 

// Adiciona a camada de segurança: se TypeChart falhar na importação, usamos um objeto vazio
const CHART_DATA = TypeChart || {}; 

const ALL_ATTACKING_TYPES = Object.keys(CHART_DATA); // Agora seguro

export function getDefensiveTypingScore(types) {
    if (ALL_ATTACKING_TYPES.length === 0 || !types || types.length === 0) return 0;

    let score = 0;

    ALL_ATTACKING_TYPES.forEach(attackingType => {
        const matchupMap = CHART_DATA[attackingType];
        if (!matchupMap) return;

        let totalMultiplier = 1;
        types.forEach(defendingType => {
            const formattedDefendingType = defendingType.charAt(0).toUpperCase() + defendingType.slice(1).toLowerCase();
            totalMultiplier *= matchupMap[formattedDefendingType] !== undefined ? matchupMap[formattedDefendingType] : 1;
        });

        if (totalMultiplier === 0) {
            score += 3; 
        } else if (totalMultiplier < 1 && totalMultiplier > 0) {
            score += 1; 
        } else if (totalMultiplier > 1) {
            score -= 2; 
        }
    });

    return score;
}