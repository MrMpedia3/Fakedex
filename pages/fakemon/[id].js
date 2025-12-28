import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "../../components/Tabs";
import { moveTypeColor } from "../../styles/typeColors";
import FakemonTechnicalDetails from "../../components/fakemon/tabs/TechnicalTab";
import FakemonEncyclopedia from "../../components/fakemon/tabs/EncyclopediaTab";
import FakemonEvolutions from "../../components/fakemon/tabs/FakemonEvolutions";
import FakemonTypeChart from "../../components/fakemon/tabs/FakemonTypeChart";

// --- FUNÇÕES AUXILIARES DE BUSCA DA CADEIA ATUALIZADAS ---

const findPreEvolution = (targetId, allFakemon) => {
    return allFakemon.find(f => {
        // 1. Procura na raiz (Pokémons sem variantes)
        const inRoot = f.evolutions && f.evolutions.some(ev => String(ev.id) === String(targetId));
        if (inRoot) return true;

        // 2. Procura dentro de cada variante (Caso do Shimashu)
        const inVariants = f.variants && f.variants.some(v => 
            v.evolutions && v.evolutions.some(ev => String(ev.id) === String(targetId))
        );
        return inVariants;
    });
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

const buildEvolutionTree = (fakemonEntry, allFakemonData, variantEvolutions = null) => {
    if (!fakemonEntry) return null;

    // Prioriza evoluções da variante, se fornecidas (usado apenas no estágio base)
    const evolutionSource = variantEvolutions || fakemonEntry.evolutions || [];

    const children = evolutionSource.map(evo => {
        const nextFakemon = allFakemonData.find(f => String(f.id) === String(evo.id));
        if (nextFakemon) {
            const childNode = buildEvolutionTree(nextFakemon, allFakemonData);
            childNode.method = evo.method; 
            return childNode;
        }
        return null; 
    }).filter(node => node !== null);

    return {
        ...fakemonEntry,
        children: children
    };
};

function getTypeGradientStyle(types = []) {
  const defaultA = "#e5e7eb";
  const t1 = (types && types[0] && moveTypeColor[types[0]]) || defaultA;
  const t2 = (types && types[1] && moveTypeColor[types[1]]) || null;

  if (!t2) return `linear-gradient(135deg, ${t1} 0%, ${t1} 50%, rgba(0,0,0,0.04) 100%)`;
  return `linear-gradient(135deg, ${t1} 0%, ${t2} 100%)`;
}

export default function FakemonPage() {
    const router = useRouter();
    const { id, fromRandom } = router.query;

    const [allFakemonData, setAllFakemonData] = useState([]);
    const [rawFakemon, setRawFakemon] = useState(null);
    const [variantIndex, setVariantIndex] = useState(0);
    const [tab, setTab] = useState(0);
    const [total, setTotal] = useState(0);

    const setFakemonState = useCallback(() => {
        setRawFakemon(null);
        setVariantIndex(0);
    }, []);

    useEffect(() => {
        if (!id) return;

        fetch("/data/fakemon.json")
            .then((r) => r.json())
            .then((data) => {
                setAllFakemonData(data);
                setTotal(data.length);

                const found = data.find(
                    (x) => String(x.id) === String(id) || String(x.number) === String(id)
                );

                if (found) {
                    setRawFakemon(found);
                    setVariantIndex(0);
                } else {
                    setRawFakemon(false);
                }
            })
            .catch(() => setRawFakemon(false));
    }, [id]);

    const f = useMemo(() => {
        if (!rawFakemon) return null;
        if (rawFakemon.variants && rawFakemon.variants.length > 0) {
            return {
                ...rawFakemon,
                ...rawFakemon.variants[variantIndex],
                id: rawFakemon.id,
                number: rawFakemon.number
            };
        }
        return rawFakemon;
    }, [rawFakemon, variantIndex]);

    const evolutionTree = useMemo(() => {
        if (!rawFakemon || allFakemonData.length === 0) return null;

        const base = findEvolutionChainBase(rawFakemon, allFakemonData);
        
        // Se o base for o próprio Pokémon atual e tiver variantes, pegamos as evos da variante ativa
        // Caso contrário (estamos na página da evolução), precisamos descobrir qual variante do pai leva a este Pokémon
        let specificEvolutions = null;

        if (String(base.id) === String(rawFakemon.id)) {
            specificEvolutions = rawFakemon.variants?.[variantIndex]?.evolutions;
        } else {
            // Lógica para quando estamos no Arashimada: 
            // Encontra qual variante do Shimashu (base) tem o Arashimada (rawFakemon) na lista de evoluções
            const parentVariant = base.variants?.find(v => 
                v.evolutions?.some(ev => String(ev.id) === String(rawFakemon.id))
            );
            if (parentVariant) {
                specificEvolutions = parentVariant.evolutions;
            }
        }

        return buildEvolutionTree(base, allFakemonData, specificEvolutions);
    }, [rawFakemon, variantIndex, allFakemonData]);

    if (!f || !evolutionTree) return <div className="p-6 text-lg">Carregando...</div>;

    const currentNum = Number(f.number);

    const goPrev = () => {
        const prev = currentNum - 1 <= 0 ? total : currentNum - 1;
        setFakemonState();
        router.push(`/fakemon/${prev}`);
    };

    const goNext = () => {
        const next = currentNum + 1 > total ? 1 : currentNum + 1;
        setFakemonState();
        router.push(`/fakemon/${next}`);
    };

    const tabs = [
        {
            label: "Básico",
            content: (
                <div className="pt-2">
                    <p className="text-lg leading-relaxed">{f.entry}</p>
                    <FakemonEvolutions 
                        currentFakemon={f}
                        evolutionTree={evolutionTree} 
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
            content: (
              <>
                <FakemonTechnicalDetails
                  abilities={f.abilities}
                  hidden_ability={f.hidden_ability}
                  base_stats={f.base_stats}
                  moves={f.moves}
                />
                <div className="my-6 border-t border-gray-200 dark:border-gray-700" />
                <FakemonTypeChart 
                  types={f.types}
                  typeColorMap={moveTypeColor}
                />
              </>
            )
        },
    ];

    const bgGradient = getTypeGradientStyle(f.types);

    return (
        <div
            className="min-h-screen animated-gradient transition-colors duration-700 rounded-xl"
            style={{
                backgroundImage: `${bgGradient}, linear-gradient(rgba(0,0,0,0.06), rgba(0,0,0,0.12)), url('/images/texture-noise.png')`,
                backgroundBlendMode: "normal, multiply, overlay",
                backgroundSize: "400% 400%, cover, auto",
                backgroundPosition: "center",
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={f.id + (f.variant_name || "")}
                    initial={fromRandom === "1" ? { opacity: 0, scale: 0.85 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="p-4 sm:p-6 max-w-3xl mx-auto mt-10 sm:mt-16"
                >
                    <div className="flex items-center justify-between mb-6 w-full gap-4">
                        <button onClick={goPrev} className="px-4 py-2 border rounded bg-gray-300 dark:bg-gray-700">← Anterior</button>
                        <button onClick={() => router.push("/")} className="px-4 py-2 border rounded bg-gray-300 dark:bg-gray-700">Voltar</button>
                        <button onClick={goNext} className="px-4 py-2 border rounded bg-gray-300 dark:bg-gray-700">Próximo →</button>
                    </div>

                    <div className="rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800 shadow relative">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 text-center sm:text-left">
                            <Image src={f.image} alt={f.name} width={180} height={180} priority />
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{f.name}</h1>
                                <p className="text-sm text-gray-500 mb-3">#{f.number} {f.variant_name && `— Forma ${f.variant_name}`}</p>
                                <div className="flex gap-2 justify-center sm:justify-start">
                                    {f.types.map((t) => (
                                        <span key={t} className="px-3 py-1 rounded text-sm font-semibold text-white"
                                              style={{ background: moveTypeColor[t] || "#999" }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {rawFakemon.variants && rawFakemon.variants.length > 0 && (
                            <div className="flex justify-center gap-3 mb-8 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                                {rawFakemon.variants.map((v, idx) => (
                                    <button
                                        key={v.variant_name}
                                        onClick={() => setVariantIndex(idx)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                            variantIndex === idx 
                                            ? "bg-purple-600 text-white shadow-md" 
                                            : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        {v.variant_name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={tab + (f.variant_name || "base")}
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -10, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
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