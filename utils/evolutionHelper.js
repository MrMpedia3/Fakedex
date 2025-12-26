export function buildEvolutionTree(currentId, allFakemons) {
    // 1. Encontrar o Pokémon Base (Stage 1) desta linha
    // Procuramos qual Pokémon de Stage 1 tem o currentId em sua linhagem
    const findRoot = (id) => {
        const poke = allFakemons.find(f => f.id === id);
        if (!poke) return null;
        if (poke.evolution_stage === 1) return poke;
        
        // Se não for stage 1, procura quem tem este poke nas evoluções
        const parent = allFakemons.find(f => f.evolutions?.some(e => e.id === id));
        return parent ? findRoot(parent.id) : poke;
    };

    const rootPoke = findRoot(currentId);
    if (!rootPoke) return null;

    // 2. Montar a árvore recursivamente
    const assembleNode = (poke) => {
        const immediateEvolutions = poke.evolutions || [];
        
        return {
            id: poke.id,
            name: poke.name,
            number: poke.number,
            image: poke.image,
            stage: poke.evolution_stage,
            // Filtramos apenas evoluções DIRETAS (Stage + 1)
            children: immediateEvolutions
                .map(evoRef => {
                    const fullData = allFakemons.find(f => f.id === evoRef.id);
                    if (!fullData || fullData.evolution_stage !== poke.evolution_stage + 1) return null;
                    
                    return {
                        ...assembleNode(fullData),
                        method: evoRef.method // O método vem da referência no pai
                    };
                })
                .filter(Boolean)
        };
    };

    return assembleNode(rootPoke);
}