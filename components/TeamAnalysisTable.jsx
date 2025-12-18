import React from 'react';
// Certifique-se que o caminho de importação das cores está correto:
import { typeSolid } from '../styles/typeColors'; 
import { allTypes } from '../utils/TypeChartData'; 

// Função auxiliar para padronizar strings de tipo para Title Case (ex: 'GHOST' -> 'Ghost')
const formatType = (type) => {
    if (!type) return '';
    const lower = type.toLowerCase();
    // Garante que o tipo exista no allTypes para evitar erros no map
    if (!allTypes.map(t => t.toLowerCase()).includes(lower)) return type; 
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

// ==========================================================
// FUNÇÃO CRÍTICA: GERAÇÃO DO TEXTO DE FEEDBACK
// ==========================================================
const generateFeedbackText = (analysis, teamSize) => {
    if (teamSize === 0) {
        return { 
            balanceText: null, 
            defensiveText: null, 
            coverageText: "Adicione Fakémons ao seu time para iniciar a análise estratégica.",
            weaknessText: [], 
            immunityText: [] 
        };
    }
    
    // --- Lógica de Balanço (Média) ---
    const { bulk, power, speed } = analysis.balance;
    let balanceText = "";
    
    const HIGH = 1.2; 
    const LOW = 0.8;

    if (bulk < LOW) {
        balanceText += "O time tende a ser **frágil** e focado em ofensiva. Sua capacidade de levar golpes é baixa. ";
    } else if (bulk > HIGH) {
        balanceText += "O time é **extremamente resistente** (Alto Bulk). Excelente para tankar, mas pode ser lento. ";
    } else {
        balanceText += "O Bulk do time está **balanceado** e saudável. ";
    }
    
    if (speed > HIGH && power > HIGH) {
        balanceText += "É uma estratégia de **Hyper Offense**, que ataca forte e rápido. ";
    } else if (speed < LOW && power < LOW) {
        balanceText += "A equipe é **lenta e conservadora** (Stall), dependendo mais de dano residual. ";
    } else {
        balanceText += "O balanço geral entre velocidade e poder ofensivo é **sólido**. ";
    }

    // --- Lógica de Vulnerabilidades Defensivas ---
    let weaknessText = [];
    let immunityText = [];
    
    // analysis.defensiveVulnerabilities usa UPPERCASE
    allTypes.forEach(type => {
        const typeKey = type.toUpperCase();
        const vuln = analysis.defensiveVulnerabilities[typeKey] || { weakness: 0, resistance: 0, immunity: 0 };
        
        if (vuln.weakness >= 3) {
            weaknessText.push(formatType(typeKey));
        }
        if (vuln.immunity >= 1) {
            immunityText.push(formatType(typeKey));
        }
    });

    let defensiveText = "";
    if (weaknessText.length > 0) {
        defensiveText = `⚠️ **Buraco Defensivo:** O time é criticamente frágil contra os tipos **${weaknessText.join(', ')}** (3 ou mais fraquezas em comum). Prepare um bom counter para esses atacantes.`;
    } else if (teamSize >= 4 && weaknessText.length === 0) {
        defensiveText = "✅ **Defesa Sólida:** Não há fraquezas compartilhadas por muitos Fakémons. A tipagem defensiva está bem coberta.";
    } else {
        defensiveText = "A cobertura defensiva parece razoável, mas monitore as fraquezas individuais.";
    }

    // --- Lógica de Cobertura Ofensiva ---
    const coveredTypesCount = analysis.offensiveCoverage.length;
    // analysis.offensiveCoverage também usa UPPERCASE
    const missingTypes = allTypes.filter(type => !analysis.offensiveCoverage.includes(type.toUpperCase()));
    const missingTypesCount = missingTypes.length;
    let coverageText = "";

    if (missingTypesCount === 0) {
        coverageText = "👑 **Cobertura Perfeita!** Você consegue acertar todos os 18 tipos com dano Super Efetivo.";
    } else if (missingTypesCount <= 3) {
        coverageText = `⭐ **Excelente Cobertura:** Apenas ${missingTypesCount} tipo(s) não são atingidos por SE. Faltam ataques fortes contra: **${missingTypes.map(t => formatType(t)).join(', ')}**.`;
    } else {
        coverageText = `🔻 **Cobertura Limitada:** Faltam ataques SE contra ${missingTypesCount} tipos. É necessário diversificar os moves para lidar com: **${missingTypes.map(t => formatType(t)).join(', ')}**.`;
    }
    
    return { balanceText, defensiveText, coverageText, weaknessText, immunityText };
};


export default function TeamAnalysisPanel({ analysis, teamSize, showFullAnalysis }) {
    
    const feedback = generateFeedbackText(analysis, teamSize);

    if (teamSize === 0) {
        return (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <p className="text-xl font-semibold mb-2">Painel de Análise</p>
                <p>Adicione um Fakémon para começar a ver o balanço do seu time.</p>
            </div>
        );
    }
    
    // --- Renderização de Vulnerabilidades ---
    const vulnerabilityTypes = allTypes.filter(type => analysis.defensiveVulnerabilities[type.toUpperCase()]?.weakness > 0)
        .sort((a, b) => analysis.defensiveVulnerabilities[b.toUpperCase()].weakness - analysis.defensiveVulnerabilities[a.toUpperCase()].weakness);

    return (
        <div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Análise {showFullAnalysis ? 'Completa' : ' em Tempo Real'}</h3>
            
            {/* 1. VISUALIZAÇÃO EM TEMPO REAL (Fraquezas) */}
            <div className="p-3 mb-4 border rounded-lg dark:border-gray-600">
                <h4 className="font-bold mb-2 text-red-500 dark:text-red-400">🚨 Maiores Fraquezas Comuns ({teamSize})</h4>
                <p className="text-xs dark:text-gray-300 mb-2">Tipos que acertam mais de um Fakémon com dano Super Efetivo (SE):</p>
                
                <div className="flex flex-wrap gap-2">
                    {vulnerabilityTypes.length > 0 ? (
                        vulnerabilityTypes.slice(0, 6).map(type => {
                            const typeKey = type.toUpperCase();
                            const weaknesses = analysis.defensiveVulnerabilities[typeKey].weakness;
                            return (
                                <span 
                                    key={type} 
                                    className={`px-2 py-1 rounded text-xs font-bold text-white ${typeSolid[formatType(type)] || 'bg-gray-500'} shadow-sm`}
                                >
                                    {formatType(type)} ({weaknesses}x)
                                </span>
                            );
                        })
                    ) : (
                        <p className="text-sm text-green-600 dark:text-green-400">Nenhuma fraqueza em comum até agora.</p>
                    )}
                </div>
            </div>

            {/* 2. ANÁLISE COMPLETA (Somente quando o botão é clicado) */}
            {showFullAnalysis && (
                <div className="mt-4 space-y-4">
                    <hr className="dark:border-gray-600"/>
                    
                    <h4 className="font-bold text-lg dark:text-white">Feedback Estratégico Detalhado:</h4>
                    
                    {/* Feedback de Balanço de Stats */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <h5 className="font-semibold text-sm mb-1 dark:text-gray-200">⚖️ Balanço de Stats (Bulk, Potência, Speed)</h5>
                        <p className="text-sm dark:text-gray-300" dangerouslySetInnerHTML={{ __html: feedback.balanceText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                    </div>

                    {/* Feedback Defensivo */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <h5 className="font-semibold text-sm mb-1 dark:text-gray-200">🛡️ Vulnerabilidade Defensiva</h5>
                        <p className="text-sm dark:text-gray-300" dangerouslySetInnerHTML={{ __html: feedback.defensiveText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                        
                        {feedback.immunityText.length > 0 && (
                            <p className="text-xs mt-1 dark:text-gray-400">Imunidades do Time: {feedback.immunityText.map(t => formatType(t)).join(', ')}</p>
                        )}
                    </div>
                    
                    {/* Feedback de Cobertura Ofensiva */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <h5 className="font-semibold text-sm mb-1 dark:text-gray-200">⚔️ Cobertura Ofensiva</h5>
                        <p className="text-sm dark:text-gray-300" dangerouslySetInnerHTML={{ __html: feedback.coverageText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                        
                        <p className="text-xs mt-1 dark:text-gray-400">Tipos Cobertos ({analysis.offensiveCoverage.length}/{allTypes.length})</p>
                    </div>
                    
                </div>
            )}
        </div>
    );
}