import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

/**
 * Componente principal que recebe a árvore de evolução e inicia a renderização.
 * @param {object} currentFakemon - Dados do Fakemon atual.
 * @param {object} evolutionTree - A estrutura hierárquica (árvore) de toda a linha.
 * @param {function} setFakemonState - A função setF(null) passada do [id].js.
 */
export default function FakemonEvolutions({ currentFakemon, evolutionTree, setFakemonState }) {
    if (!evolutionTree || !evolutionTree.id) return null;

    // --- COMPONENTE NÓ RECURSIVO ---
    const EvolutionNode = ({ node, isBaseNode = false, displayType = "SEQUENTIAL" }) => {
        const router = useRouter();

        const handleEvolutionClick = useCallback((newId) => {
            setFakemonState(null); 
            router.push(`/fakemon/${newId}`);
        }, [router, setFakemonState]);

        const isCurrent = String(node.id) === String(currentFakemon.id);
        const hasChildren = node.children && node.children.length > 0;
        
        // Função para renderizar o cartão de um único Fakémon
        const renderCard = (methodText) => (
            <div
                className={`text-center transition ${
                    isCurrent
                        ? "scale-110 border-2 border-purple-500 rounded-xl p-2 shadow-lg ring-4 ring-purple-300 dark:ring-purple-700"
                        : "cursor-pointer hover:scale-105"
                } min-w-max`}
                onClick={() => {
                    if (!isCurrent) {
                        handleEvolutionClick(node.id);
                    }
                }}
            >
                <div className="w-20 h-20 mx-auto relative">
                    <Image 
                        src={node.image} 
                        alt={node.name} 
                        fill
                        className="object-contain" 
                        sizes="80px" 
                    />
                </div>

                <div className="font-semibold">{node.name}</div>
                <div className="text-xs text-gray-500">#{node.number}</div>
                
                {methodText && (
                    <div className="text-xs text-purple-600 mt-1">{methodText}</div>
                )}
            </div>
        );

        // O nó atual é renderizado
        const currentCard = renderCard(isBaseNode ? null : node.method);
        
        if (!hasChildren) return currentCard;

        // --- LÓGICA DE SEQUÊNCIA / RAMIFICAÇÃO ---

        // 1. SEQUENCIAL (A -> B -> C)
        // Usamos SEQUENTIAL se a flag estiver assim OU se houver apenas 1 filho (padrão)
        const isSequential = displayType === "SEQUENTIAL" || node.children.length === 1;

        if (isSequential) {
            // O nó atual é o pai e o próximo é o único filho (sequência horizontal)
            return (
                <div className="flex items-center gap-4">
                    {currentCard}
                    <div className="text-2xl animate-pulseArrow">➡️</div>
                    {/* Chama o componente recursivamente, propagando a flag SEQUENTIAL */}
                    <EvolutionNode 
                        node={node.children[0]} 
                        displayType="SEQUENTIAL" 
                    />
                </div>
            );
        }
        
        // 2. RAMIFICAÇÃO (A -> [B, C])
        if (displayType === "BRANCHING") {
            return (
                <div className="flex items-center gap-4">
                    {currentCard}
                    
                    {/* Linha vertical que segura as ramificações */}
                    <div className="flex flex-col items-center gap-4 py-2">
                        {node.children.map((childNode) => (
                            <div key={childNode.id} className="flex items-center gap-4">
                                <div className="text-2xl animate-pulseArrow">➡️</div>
                                {/* Chama o componente recursivamente, propagando a flag BRANCHING */}
                                <EvolutionNode 
                                    node={childNode} 
                                    displayType="BRANCHING" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Fallback: Se não for SEQUENTIAL nem BRANCHING, exibe o cartão final.
        return currentCard; 
    };

    // --- RENDERIZAÇÃO PRINCIPAL ---
    return (
        <div className="mt-6 justify-items-center">
            <hr />
            <br />
            <h3 className="font-bold text-lg mb-3 text-center">Linha Evolutiva</h3>

            {/* Inicia a renderização da árvore a partir do nó raiz, lendo a flag do JSON */}
            <div className="flex justify-center p-4">
                <EvolutionNode 
                    node={evolutionTree} 
                    isBaseNode={true} 
                    displayType={evolutionTree.evolution_display_type || "SEQUENTIAL"} 
                />
            </div>
        </div>
    );
}