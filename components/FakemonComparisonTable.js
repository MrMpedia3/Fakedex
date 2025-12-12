// components/ComparisonTable.js

import React, { useState, useMemo } from 'react';
// === CORREÇÃO DE CORE DE TIPO ===
import { typeSolid } from '../styles/typeColors'; 
// === NOVO IMPORT: LÓGICA DE VANTAGEM ===
// ATENÇÃO: AJUSTE O CAMINHO DE IMPORTAÇÃO SE NECESSÁRIO!
import { getDefensiveTypingScore } from '../utils/matchupCalculator'; 


// Função auxiliar para formatar 'GRASS' em 'Grass' para casar com a chave do seu objeto typeSolid
const formatTypeKey = (type) => {
    if (!type || typeof type !== 'string') return '';
    const lower = type.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};


// Conteúdo detalhado para o Tooltip (em JSX)
const PRESSURE_FACTOR_TOOLTIP = (
    <>
        <div className="font-semibold text-sm">Fator de Pressão (PF)</div>

        <div className="text-gray-300">
            Este índice mede o potencial global em batalha, sendo a soma de quatro componentes normalizados:
        </div>
        
        <div className="pt-1 mt-1 border-t border-gray-700">
            <ul className="list-disc list-inside space-y-1">
                <li className="text-xs">
                    Bulk Defensivo (Resistência): (HP x Média das Defesas) / 2000
                </li>
                <li className="text-xs">
                    Potência Ofensiva: Max(ATK, SPA) / 100
                </li>
                <li className="text-xs">
                    Velocidade: SPE / 100 (Bônus por agir primeiro)
                </li>
                <li className="text-xs">
                    Score Defensivo de Tipagem: Pontuação por imunidades e resistências.
                </li>
            </ul>
        </div>
    </>
);


// Métricas de comparação disponíveis
const COMPARISON_OPTIONS = [
    { key: 'bst', label: 'BST (Total)' },
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Ataque' },
    { key: 'defense', label: 'Defesa' },
    { key: 'special_attack', label: 'Ataque Sp.' },
    { key: 'special_defense', label: 'Defesa Sp.' },
    { key: 'speed', label: 'Velocidade' },
    { key: 'height_m', label: 'Altura (m)' },
    { key: 'weight_kg', label: 'Peso (kg)' },
    // === NOVA MÉTRICA com Tooltip ===
    { 
        key: 'pressure_factor', 
        label: 'Fator de Pressão',
        tooltip: PRESSURE_FACTOR_TOOLTIP 
    }
];

const ComparisonTable = ({ fakemons }) => {
    const [selectedMetric, setSelectedMetric] = useState('bst'); 
    
    // === CÁLCULO DE DADOS, BST E FATOR DE PRESSÃO ===
    const fakemonsWithStats = useMemo(() => {
        return fakemons.map(f => {
            const stats = f.base_stats || {}; 
            
            // Stats individuais
            const hp = stats.hp || 0;
            const def = stats.def || 0;
            const spd = stats.spd || 0;
            const atk = stats.atk || 0;
            const spa = stats.spa || 0;
            const spe = stats.spe || 0; 
            
            // Cálculo do BST
            const bst = hp + atk + def + spa + spd + spe;
            
            // 1. Bulk Defensivo 
            const defensiveBulk = hp * ((def + spd) / 2);
            
            // 2. Potência Ofensiva 
            const offensivePower = Math.max(atk, spa);
            
            // 3. Score de Tipagem Defensiva
            const defensiveScore = getDefensiveTypingScore(f.types);
            
            // 4. Fator de Pressão (PF)
            // Bulk/2000 + Ataque/100 + Score Tipagem + Velocidade/100
            const pressureFactor = (defensiveBulk / 2000) + 
                                   (offensivePower / 100) + 
                                   defensiveScore + 
                                   (spe / 100); 
            
            return { 
                ...f, 
                bst: bst,
                // Mapeamento de Stats
                hp: hp,
                attack: atk,
                defense: def,
                special_attack: spa,
                special_defense: spd,
                speed: spe,
                height_m: f.height_m, 
                weight_kg: f.weight_kg,
                pressure_factor: pressureFactor, 
                ability: f.ability || 'N/A' // Adicionando a habilidade
            };
        });
    }, [fakemons]);

    // LÓGICA DE DESTAQUE
    const comparisonResult = useMemo(() => {
        if (fakemonsWithStats.length === 0) {
            return { winner: [], loser: [] };
        }
        
        const values = fakemonsWithStats.map(f => f[selectedMetric] || 0);
        
        const winnerValue = Math.max(...values);
        const loserValue = Math.min(...values);

        const winner = fakemonsWithStats.filter(f => (f[selectedMetric] || 0) === winnerValue);
        const loser = fakemonsWithStats.filter(f => (f[selectedMetric] || 0) === loserValue);
        
        return { winner, loser };
    }, [fakemonsWithStats, selectedMetric]);

    const { winner, loser } = comparisonResult;

    const getCellClasses = (fakemon) => {
        const isWinner = winner && winner.some(w => w.number === fakemon.number);
        const isLoser = loser && loser.some(l => l.number === fakemon.number);

        if (isWinner && winner.length < fakemonsWithStats.length) { 
            return 'bg-green-500/80 font-extrabold text-white';
        }
        if (isLoser && loser.length < fakemonsWithStats.length) {
            return 'bg-red-500/80 font-extrabold text-white';
        }
        return 'text-gray-800 dark:text-gray-200';
    };


    return (
        <div className="mt-8">
            {/* Seletor de Métricas */}
            <div className="mb-4 flex items-center flex-wrap gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
                <span className="font-semibold mr-2 text-gray-800 dark:text-white">Comparar por:</span>
                {COMPARISON_OPTIONS.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => setSelectedMetric(opt.key)}
                        // Adicionando 'group relative' para o Tooltip
                        className={`
                            px-4 py-2 text-sm rounded-full font-bold transition duration-150 
                            ${selectedMetric === opt.key 
                                ? 'bg-red-600 text-white shadow-md' 
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'}
                            ${opt.tooltip ? 'group relative' : ''} 
                        `}
                    >
                        {opt.label}
                        
                        {/* Renderiza o Tooltip se houver conteúdo */}
                        {opt.tooltip && (
                            <span className="relative inline-block ml-1 cursor-help">
                                {/* Ícone de Informação */}
                                <span className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition duration-150 text-sm">
                                    ⓘ
                                </span>
                                
                                {/* Conteúdo do Tooltip - Usando sua lógica de classes (bottom-full, scale-95) */}
                                <div
                                    className="absolute left-1/2 bottom-full -translate-x-1/2 mb-1 w-max max-w-xs 
                                             p-2 text-xs rounded-md bg-gray-800 dark:bg-gray-700 text-white shadow 
                                             opacity-0 scale-95 pointer-events-none 
                                             transition-all duration-200 
                                             group-hover:opacity-100 group-hover:scale-100 z-50"
                                >
                                    {opt.tooltip}
                                </div>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tabela de Comparação */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow-xl">
                    {/* Cabeçalho */}
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                            <th className="py-3 px-4 text-left text-sm font-semibold uppercase w-40">Métrica</th>
                            {fakemonsWithStats.map(f => (
                                <th key={f.number} className="py-3 px-4 text-center text-sm font-bold uppercase w-48">
                                    {f.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Corpo da Tabela */}
                    <tbody>
                        {/* Linha da Imagem e N° */}
                        <tr className="border-b border-gray-300 dark:border-gray-600">
                            <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fakémon</td>
                            {fakemonsWithStats.map(f => (
                                <td key={f.number} className="py-2 px-4 text-center">
                                    <img 
                                        src={f.image || `/images/${f.number}.png`} 
                                        alt={f.name} 
                                        className="w-16 h-16 object-contain mx-auto mb-1 rounded-full bg-white p-1" 
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">N°{f.number}</p>
                                </td>
                            ))}
                        </tr>
                        
                        {/* Linha do Stat Selecionado */}
                        <tr className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                            <td className="py-3 px-4 font-extrabold uppercase text-gray-800 dark:text-white">{COMPARISON_OPTIONS.find(opt => opt.key === selectedMetric).label}</td>
                            {fakemonsWithStats.map(f => (
                                <td key={f.number} className={`py-3 px-4 text-center text-lg transition-colors duration-300 ${getCellClasses(f)}`}>
                                    {/* Condicional para o Fator de Pressão */}
                                    {selectedMetric === 'pressure_factor' ? (
                                        // Mostra o Fator de Pressão com 1 casa decimal e sinal de +
                                        (f[selectedMetric] > 0 ? '+' : '') + (f[selectedMetric] || 0).toFixed(1)
                                    ) : (
                                        // Formatação para Stats (inteiro) vs Altura/Peso (decimal)
                                        selectedMetric === 'height_m' || selectedMetric === 'weight_kg' 
                                            ? (f[selectedMetric] || 0).toFixed(1) 
                                            : Math.floor(f[selectedMetric] || 0)
                                    )} 
                                </td>
                            ))}
                        </tr>

                        {/* Linha do Tipo 1 */}
                        <tr className="border-b border-gray-300 dark:border-gray-600">
                            <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Tipo 1</td>
                            {fakemonsWithStats.map(f => (
                                <td key={f.number} className="py-3 px-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase text-white ${typeSolid[formatTypeKey(f.types[0])] || 'bg-gray-500'}`}>
                                        {f.types[0] || '—'}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Linha do Tipo 2 */}
                         <tr className="border-b border-gray-300 dark:border-gray-600">
                            <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Tipo 2</td>
                            {fakemonsWithStats.map(f => (
                                <td key={f.number} className="py-3 px-4 text-center">
                                    {f.types[1] ? (
                                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase text-white ${typeSolid[formatTypeKey(f.types[1])] || 'bg-gray-500'}`}>
                                            {f.types[1]}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">—</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;