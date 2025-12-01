import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "../../components/Tabs";
import { moveTypeColor } from "../../styles/typeColors";
import FakemonTechnicalDetails from "../../components/fakemon/tabs/TechnicalTab";
import FakemonEncyclopedia from "../../components/fakemon/tabs/EncyclopediaTab";
import FakemonEvolutions from "../../components/fakemon/tabs/FakemonEvolutions";
import FakemonTypeChart from "../../components/fakemon/tabs/FakemonTypeChart";

// --- FUNÇÕES AUXILIARES DE BUSCA DA CADEIA ---

const findPreEvolution = (id, allFakemon) => {
    return allFakemon.find(f => 
        f.evolutions && f.evolutions.some(ev => String(ev.id) === String(id))
    );
};

const findEvolutionChainBase = (currentFakemon, allFakemon) => {
    let baseFakemon = currentFakemon;
    let preEvolution = findPreEvolution(baseFakemon.id, allFakemon);

    while (preEvolution) {
        baseFakemon = preEvolution;
        preEvolution = findPreEvolution(baseFakemon.id, allFakemon);
    }
    return baseFakemon;
};

// NOVO: Função para construir a Árvore de Evolução completa (hierarquia)
const buildEvolutionTree = (fakemonEntry, allFakemonData) => {
    if (!fakemonEntry || !fakemonEntry.evolutions || fakemonEntry.evolutions.length === 0) {
        // Se não há evoluções ou Fakemon é nulo, retorna o Fakémon atual sem filhos
        return {
            ...fakemonEntry,
            children: []
        };
    }

    // Para cada evolução listada no Fakémon atual...
    const children = fakemonEntry.evolutions.map(evo => {
        // Encontra o objeto completo da próxima evolução
        const nextFakemon = allFakemonData.find(f => String(f.id) === String(evo.id));
        
        // Se a próxima evolução existe, chama recursivamente para montar o restante da cadeia/ramo.
        if (nextFakemon) {
            // A chamada recursiva constrói o resto da linha/ramo
            const childNode = buildEvolutionTree(nextFakemon, allFakemonData);
            
            // Adiciona o método de evolução do pai para o filho
            childNode.method = evo.method; 
            return childNode;
        }

        // Caso o ID não seja encontrado (deveria ser raro)
        return null; 
    }).filter(node => node !== null); // Remove qualquer nó nulo

    // Retorna o nó pai com seus filhos (próximo passo na cadeia/ramo)
    return {
        ...fakemonEntry,
        children: children
    };
};

// --- util: cria string CSS gradient (hex) a partir dos tipos ---
function getTypeGradientStyle(types = []) {
  const defaultA = "#e5e7eb";
  const defaultB = "#d1d5db";

  const t1 = (types && types[0] && moveTypeColor[types[0]]) || defaultA;
  const t2 = (types && types[1] && moveTypeColor[types[1]]) || null;

  if (!t2) {
    return `linear-gradient(135deg, ${t1} 0%, ${t1} 50%, rgba(0,0,0,0.04) 100%)`;
  }

  return `linear-gradient(135deg, ${t1} 0%, ${t2} 100%)`;
}


export default function FakemonPage() {
    const router = useRouter();
    const { id, fromRandom } = router.query;

    const [f, setF] = useState(null);
    const [baseFakemon, setBaseFakemon] = useState(null); // Armazena a ÁRVORE de Evolução
    const [tab, setTab] = useState(0);
    const [total, setTotal] = useState(0);

    const setFakemonState = useCallback((state) => setF(state), []);

    useEffect(() => {
        if (!id) return;

        fetch("/data/fakemon.json")
            .then((r) => r.json())
            .then((allFakemonData) => {
                setTotal(allFakemonData.length);

                const currentFakemon = allFakemonData.find(
                    (x) => String(x.id) === String(id) || String(x.number) === String(id)
                );

                if (currentFakemon) {
                    // 1. Encontra o Fakemon Base (Estágio 1)
                    const base = findEvolutionChainBase(currentFakemon, allFakemonData);
                    
                    // 2. Constrói a árvore hierárquica de evolução completa A PARTIR DO BASE
                    const evolutionTree = buildEvolutionTree(base, allFakemonData);
                    
                    setF(currentFakemon);
                    setBaseFakemon(evolutionTree); // Salva a árvore completa
                } else {
                    setF(false);
                    setBaseFakemon(false);
                }
            })
            .catch(() => {
                setF(false);
                setBaseFakemon(false);
            });
    }, [id]);

    if (f === null || baseFakemon === null) return <div className="p-6 text-lg">Carregando...</div>;
    if (f === false || baseFakemon === false) return <div className="p-6 text-lg">Fakemon não encontrado.</div>;

    const current = Number(f.number);

    const goPrev = () => {
        if (!total) return;
        const prev = current - 1 <= 0 ? total : current - 1;
        setF(null);
        router.push(`/fakemon/${prev}`);
    };

    const goNext = () => {
        if (!total) return;
        const next = current + 1 > total ? 1 : current + 1;
        setF(null);
        router.push(`/fakemon/${next}`);
    };

    // TABS ---------------------------------------------------------
    const tabs = [
        {
            label: "Básico",
            content: (
                <div className="pt-2">
                    <p className="text-lg leading-relaxed">{f.entry}</p>
                    
                    {/* Agora passamos a ÁRVORE DE EVOLUÇÃO COMPLETA */}
                    <FakemonEvolutions 
                        currentFakemon={f}
                        evolutionTree={baseFakemon} 
                        setFakemonState={setFakemonState}
                    />
                </div>
            ),
        },
        {
            label: "Enciclopédia",
            content: (
                <FakemonEncyclopedia
                    description={f.description}
                    height_m={f.height_m}
                    weight_kg={f.weight_kg}
                    image={f.image}
                    name={f.name}
                />
            ),
        },
        {
            label: "Técnico",
            content: 
            (
              <>
                <FakemonTechnicalDetails
                  abilities={f.abilities}
                  hidden_ability={f.hidden_ability}
                  base_stats={f.base_stats}
                  moves={f.moves}
                />
                <br />
                <hr />
                <FakemonTypeChart 
                  types={f.types}
                  typeColorMap={moveTypeColor}
                />
              </>
            )
              
        },
    ];

    const animationFromRandom =
        fromRandom === "1"
            ? { opacity: 0, scale: 0.85 }
            : { opacity: 0, y: 20 };

    const bgGradient = getTypeGradientStyle(f.types);
    const textureUrl = "/images/texture-noise.png";

    return (
        <div
            className="min-h-screen animated-gradient transition-colors duration-700 rounded-xl"
            style={{
                backgroundImage: `
                    ${bgGradient},
                    linear-gradient(rgba(0,0,0,0.06), rgba(0,0,0,0.12)),
                    url('${textureUrl}')
                `,
                backgroundBlendMode: "normal, multiply, overlay",
                backgroundSize: "400% 400%, cover, auto",
                backgroundPosition: "center",
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={f.id + "-content"}
                    initial={animationFromRandom}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="p-4 sm:p-6 max-w-3xl mx-auto mt-10 sm:mt-16 overflow-visible"
                >
                    {/* ... (Seu código de navegação) ... */}
                    <div className="flex items-center justify-between mb-6 w-full gap-4">
                        <div className="flex-1 flex justify-start">
                        <motion.button
                            onClick={goPrev}
                            className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-900 transition"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ← Anterior
                        </motion.button>
                        </div>

                        <div className="flex-1 flex justify-center">
                        <motion.button
                            onClick={() => {
                            setF(null);
                            router.push("/");
                            }}
                            className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-900 transition"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Voltar
                        </motion.button>
                        </div>

                        <div className="flex-1 flex justify-end">
                        <motion.button
                            onClick={goNext}
                            className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-900 transition"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Próximo →
                        </motion.button>
                        </div>
                    </div>
                    {/* ... (Fim do código de navegação) ... */}

                    <div className="rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800 shadow overflow-visible">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 text-center sm:text-left">
                            <Image
                                src={f.image}
                                alt={f.name}
                                width={180}
                                height={180}
                                className="mx-auto sm:mx-0"
                            />

                            <div>
                                <h1 className="text-3xl font-bold mb-1">{f.name}</h1>
                                <p className="text-sm text-gray-600 mb-3">#{f.number}</p>

                                <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                                    {f.types.map((t) => (
                                        <span
                                            key={t}
                                            className="px-3 py-1 rounded text-sm font-semibold text-white shadow"
                                            style={{
                                                background: `linear-gradient(90deg, ${
                                                    moveTypeColor[t] || "#999"
                                                }, ${moveTypeColor[t] || "#777"})`,
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative overflow-visible">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={tab}
                                    initial={{ x: 40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -40, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    <Tabs active={tab} onChange={setTab} tabs={tabs} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}