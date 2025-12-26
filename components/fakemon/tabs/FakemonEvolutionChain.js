import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, Fragment } from "react";

// --- Componente auxiliar para renderizar um Fakemon (com tratamento de imagem 80x80) ---
const EvolutionStep = ({ fakemon, method, isCurrent, onClick }) => {
    const isClickable = !!onClick;
    
    return (
        <div 
            className={`text-center ${isClickable && !isCurrent ? 'cursor-pointer hover:scale-105 transition' : ''}`}
            onClick={isClickable && !isCurrent ? () => onClick(fakemon.id) : null}
        >
            {/* Wrapper de 80x80px para o problema de altura da imagem */}
            <div className="w-20 h-20 mx-auto relative">
                <Image 
                    src={fakemon.image} 
                    alt={fakemon.name} 
                    fill 
                    className="object-contain" // Garante que a imagem se ajuste
                    sizes="80px"
                />
            </div>
            {/* Nome em destaque se for o Fakemon atual */}
            <div className={`font-semibold ${isCurrent ? 'text-purple-600' : ''}`}>{fakemon.name}</div>
            <div className="text-xs text-gray-500">#{fakemon.number}</div>
            {/* Método de evolução */}
            {method && <div className="text-xs text-purple-600 mt-1">{method}</div>}
        </div>
    );
};

// --- Componente principal ---
export default function FakemonEvolutionChain({ 
    sequentialChain, 
    currentFakemon, 
    setFakemonState 
}) {
    const router = useRouter();

    const handleEvolutionClick = useCallback((newId) => {
        setFakemonState(null); 
        router.push(`/fakemon/${newId}`);
    }, [router, setFakemonState]);

    if (!sequentialChain || sequentialChain.length === 0) return null;

    const currentId = currentFakemon.id;
    
    // Verifica se é o estágio base (Lipony) com ramificações (currentFakemon.is_branching = true)
    const isBranchingRoot = currentFakemon.is_branching && sequentialChain.length === 1;
    
    // Se for Lipony, a cadeia a ser renderizada é ele mesmo + suas evoluções do JSON
    const chainToRender = isBranchingRoot 
        ? [currentFakemon, ...currentFakemon.evolutions] 
        : sequentialChain;


    return (
        <div className="mt-6">
            <hr />
            <br />
            <h3 className="font-bold text-lg mb-3 text-center">Linha Evolutiva</h3>

            {/* Se for ramificação, usa 'flex-col' para listar Lipony -> EvoA, EvoB, EvoC */}
            <div className={`flex flex-wrap items-center justify-center gap-6 ${isBranchingRoot ? 'flex-col sm:flex-row' : ''}`}>
                
                {chainToRender.map((fakemon, index) => {
                    const isCurrent = fakemon.id === currentId;
                    let evoMethod = null;

                    if (isBranchingRoot && index > 0) {
                        // Caso Lipony: O método de evolução está no array 'evolutions' do Fakemon atual
                        evoMethod = currentFakemon.evolutions[index - 1].method;
                    }
                    
                    if (!isBranchingRoot && index > 0) {
                        // Caso Sequencial: O método de evolução está no Fakemon que o precede na sequentialChain
                        const prevFakemon = sequentialChain[index - 1];
                        evoMethod = prevFakemon?.evolutions?.find(ev => ev.id === fakemon.id)?.method;
                    }
                    

                    return (
                        <Fragment key={fakemon.id}>
                            {/* A. Seta (Sequencial) */}
                            {!isBranchingRoot && index > 0 && (
                                <div className="text-2xl animate-pulseArrow">➡️</div>
                            )}
                            
                            {/* B. Seta (Ramificação, após o Lipony) */}
                            {isBranchingRoot && index > 0 && (
                                <div className="w-full flex justify-center py-2">
                                    <div className="text-2xl animate-pulseArrow">⬇️</div>
                                </div>
                            )}

                            {/* C. Fakemon */}
                            <EvolutionStep 
                                fakemon={fakemon} 
                                method={evoMethod}
                                isCurrent={isCurrent}
                                onClick={handleEvolutionClick}
                            />
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}