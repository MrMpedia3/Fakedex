import { TypeChart, allTypes } from './TypeChartData'; 

const CHART_DATA = TypeChart;
const ALL_TYPES = allTypes;

// Função auxiliar para padronizar strings de tipo para Title Case (ex: 'ghost' -> 'Ghost')
const normalizeType = (type) => {
    if (!type || typeof type !== 'string') return '';
    const lower = type.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

/**
 * Analisa as forças e fraquezas de um time de Fakémons.
 * @param {Array<Object>} team - Array de Fakémons (máx. 6).
 * @returns {Object} A análise completa com métricas.
 */
export function analyzeTeam(team) {
    const analysis = {
        defensiveVulnerabilities: {}, // Ex: { 'GHOST': { weakness: 3, resistance: 1, immunity: 0 } }
        offensiveCoverage: new Set(), // Tipos que o time consegue acertar Super Efetivo (SE)
        balance: { bulk: 0, power: 0, speed: 0 },
    };

    if (!team || team.length === 0) {
        return analysis;
    }

    // Inicializa as contagens defensivas
    ALL_TYPES.forEach(type => {
        // Usamos UPPERCASE na chave interna para consistência, mas consultamos o chart em Title Case
        analysis.defensiveVulnerabilities[type.toUpperCase()] = { weakness: 0, resistance: 0, immunity: 0 };
    });

    let totalBulk = 0;
    let totalPower = 0;
    let totalSpeed = 0;

    team.forEach(fakemon => {
        const stats = fakemon.base_stats || {};
        const types = fakemon.types || []; // Tipos defensivos (Ex: ['Ghost'])
        const moves = fakemon.moves || [];  // Lista de ataques
        
        // --- 1. Balanço de Stats ---
        const hp = stats.hp || 0;
        const def = stats.def || 0;
        const spd = stats.spd || 0;
        const atk = stats.atk || 0;
        const spa = stats.spa || 0;
        const spe = stats.spe || 0;

        totalBulk += hp * ((def + spd) / 2); 
        totalPower += Math.max(atk, spa);
        totalSpeed += spe;

        // --- 2. Análise Defensiva (Vulnerabilidades Comuns) ---
        ALL_TYPES.forEach(attackingType => {
            const normalizedAttackingType = normalizeType(attackingType); // Ex: 'Ghost'
            const keyAttackingType = normalizedAttackingType.toUpperCase(); // Ex: 'GHOST'
            let totalMultiplier = 1;
            
            // O mapa de efetividade do tipo atacante (Ex: CHART_DATA['Ghost'])
            const matchupMap = CHART_DATA[normalizedAttackingType];
            if (!matchupMap) return;

            // Calcula o multiplicador total de dano contra o Fakémon
            types.forEach(defendingType => {
                const normalizedDefendingType = normalizeType(defendingType); // Ex: 'Normal'
                
                // Busca o fator no CHART_DATA[Atacante][Defensor]
                const factor = matchupMap[normalizedDefendingType];

                totalMultiplier *= factor !== undefined ? factor : 1;
            });

            // Classificação e Contagem
            if (totalMultiplier === 0) {
                analysis.defensiveVulnerabilities[keyAttackingType].immunity += 1;
            } else if (totalMultiplier < 1) {
                analysis.defensiveVulnerabilities[keyAttackingType].resistance += 1;
            } else if (totalMultiplier > 1) {
                analysis.defensiveVulnerabilities[keyAttackingType].weakness += 1;
            }
        });
        
        // --- 3. Análise Ofensiva (Cobertura de Tipos) ---
        moves.forEach(move => {
            // move.type é Title Case (Ex: 'Ghost')
            const moveType = normalizeType(move.type); 
            if (!CHART_DATA[moveType]) return;

            // Para cada movimento, verifica quais tipos ele acerta Super Efetivo (SE)
            ALL_TYPES.forEach(defendingType => {
                const normalizedDefendingType = normalizeType(defendingType); // Ex: 'Normal'
                
                const multiplier = CHART_DATA[moveType][normalizedDefendingType];
                
                // Se o multiplicador for 2 (SE), adiciona à cobertura
                if (multiplier && multiplier === 2) { 
                    analysis.offensiveCoverage.add(normalizedDefendingType.toUpperCase());
                }
            });
        });
    });

    // Finaliza o Balanço (Média e Normalização)
    const count = team.length || 1; 
    // Normalização (constantes usadas no Fator de Pressão)
    analysis.balance.bulk = (totalBulk / count) / 2000;
    analysis.balance.power = (totalPower / count) / 100;
    analysis.balance.speed = (totalSpeed / count) / 100;
    
    // Converte Set para Array
    analysis.offensiveCoverage = Array.from(analysis.offensiveCoverage);

    return analysis;
}