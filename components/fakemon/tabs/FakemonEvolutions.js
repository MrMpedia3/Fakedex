import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, Fragment } from "react";

export default function FakemonEvolutions({ currentId, evolutionTree, setFakemonState }) {
    const router = useRouter();

    const handleNavigation = useCallback((id) => {
        if (String(id) === String(currentId)) return;
        setFakemonState(null);
        router.push(`/fakemon/${id}`);
    }, [currentId, router, setFakemonState]);

    const renderNode = (node) => {
        const isCurrent = String(node.id) === String(currentId);
        const hasChildren = node.children && node.children.length > 0;
        const numChildren = node.children ? node.children.length : 0;

        // Card do Pokémon
        const pokemonCard = (
            <div 
                className={`flex flex-col items-center p-3 rounded-xl transition-all min-w-[110px] ${
                    isCurrent 
                        ? "bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500 scale-105 z-10" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                }`}
                onClick={() => handleNavigation(node.id)}
            >
                <div className="w-20 h-20 relative mb-2">
                    <Image src={node.image} alt={node.name} fill className="object-contain" sizes="80px" />
                </div>
                <span className="font-bold text-sm leading-tight text-center">{node.name}</span>
                <span className="text-[10px] text-gray-500">#{node.number}</span>
                {node.method && (
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1 text-center max-w-[90px] leading-tight">
                        {node.method}
                    </span>
                )}
            </div>
        );

        if (!hasChildren) return pokemonCard;

        return (
            <div className={`flex flex-col md:flex-row items-center gap-4`}>
                {pokemonCard}
                
                {/* Container de Setas e Filhos */}
                <div className="flex flex-col md:flex-row items-center gap-2">
                    {/* Seta Adaptativa: Aponta para baixo no mobile e para a direita no desktop */}
                    <div className="text-xl animate-pulseArrow rotate-90 md:rotate-0">➡️</div>

                    {numChildren === 1 ? (
                        // CASO SEQUENCIAL (1 > 2)
                        <div className="flex items-center">
                            {renderNode(node.children[0])}
                        </div>
                    ) : (
                        // CASO RAMIFICADO (Ex: Lipony ou Fotonon stage 2)
                        <div className={`
                            grid gap-4 p-4 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-purple-200 dark:border-purple-800
                            ${numChildren > 2 
                                ? "grid-cols-2 lg:grid-cols-3" // Grade para casos como Lipony (6 evoluções)
                                : "grid-cols-1"              // Coluna simples para 2 evoluções
                            }
                        `}>
                            {node.children.map(child => (
                                <Fragment key={child.id}>
                                    {renderNode(child)}
                                </Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!evolutionTree) return null;

    return (
        <div className="mt-10 w-full border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="text-center font-bold text-lg mb-8 uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Linha Evolutiva
            </h3>
            {/* Scroll horizontal apenas se o conteúdo exceder a tela em desktops antigos */}
            <div className="flex justify-center items-start overflow-x-auto pb-8 px-4 custom-scrollbar">
                <div className="flex flex-col items-center">
                    {renderNode(evolutionTree)}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                @keyframes pulseArrow {
                    0%, 100% { transform: translateX(0) rotate(var(--tw-rotate)); opacity: 1; }
                    50% { transform: translateX(5px) rotate(var(--tw-rotate)); opacity: 0.5; }
                }
                .animate-pulseArrow {
                    animation: pulseArrow 2s infinite;
                }
            `}</style>
        </div>
    );
}