import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import { typeSolid } from "../styles/typeColors";

export default function FakemonControls(
    {
    allTypes,
    selectedTypes,
    sortCriteria,
    isTeleporting,
    handleSearch,
    handleTypeSelect,
    handleFieldChange,
    handleDirectionToggle,
    handleRandomClick,
    data // necessário para SearchBar
    
}) {
    const renderDirectionIcon = () => {
        return sortCriteria.direction === 'asc' ? '▲' : '▼'; // Seta para cima (ASC) ou para baixo (DESC)
    };
    return (
        <>
            {/* 1. Barra de busca + Ordenação + Botão Aleatório */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 relative">
                <SearchBar onSearch={handleSearch} data={data} />
                
                {/* Botão Aleatório (Teleporte) */}
                <motion.button
                    onClick={handleRandomClick}
                    className="relative px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 
                                dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition 
                                shadow mt-4 sm:mt-16 overflow-hidden justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Aleatório
                    <AnimatePresence>
                        {/* Use a prop isTeleporting */}
                        {isTeleporting && ( 
                            <motion.div
                                className="absolute inset-0 bg-blue-300 dark:bg-blue-700"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [1, 1.6, 0.8],
                                    filter: ["blur(0px)", "blur(6px)", "blur(0px)"],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.55, ease: "easeInOut" }}
                            />
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
            {/* SELECT DE ORDENAÇÃO */}
            <div className="flex items-center gap-2 mt-3 sm:mt-3">
                <label htmlFor="sort-field" className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Ordenar por:</label>
                
                {/* 1. SELECT DO CAMPO */}
                <select
                    id="sort-field"
                    // NOVO: Usa handleFieldChange
                    onChange={handleFieldChange}
                    // Exibe APENAS o campo, sem a direção
                    value={sortCriteria.field} 
                    className="p-2 border rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="number"># Dex</option>
                    <option value="name">Nome</option>
                    <option value="total_stats">Total Stats</option>
                    <option value="height">Altura</option>
                    <option value="weight">Peso</option>
                    
                    <optgroup label="Stats Individuais">
                        <option value="hp">HP</option>
                        <option value="attack">Ataque</option>
                        <option value="defense">Defesa</option>
                        <option value="special_attack">Sp. Atk</option>
                        <option value="special_defense">Sp. Def</option>
                        <option value="speed">Velocidade</option>
                    </optgroup>
                </select>
                
                {/* 2. BOTÃO DE DIREÇÃO (NOVO) */}
                <motion.button
                    // NOVO: Usa handleDirectionToggle
                    onClick={handleDirectionToggle}
                    className={`px-3 py-2 rounded-lg text-lg font-bold transition shadow-sm 
                                ${sortCriteria.direction === 'asc' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'bg-purple-500 text-white hover:bg-purple-600'}
                                border border-purple-300 dark:border-purple-700`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Alternar direção para ${sortCriteria.direction === 'asc' ? 'Decrescente' : 'Crescente'}`}
                >
                    {renderDirectionIcon()}
                </motion.button>
            </div>
            {/* 2. Filtros de Tipo */}
            <div className="flex gap-2 flex-wrap my-4 justify-center sm:justify-start">
                {/* Use a prop allTypes */}
                {allTypes.map((t) => (
                    <motion.button
                        key={t}
                        // Use a prop handleTypeSelect
                        onClick={() => handleTypeSelect(t)}
                        className={`filtros px-3 py-1 rounded-full text-sm text-white shadow 
                            ${typeSolid[t]} 
                            ${
                                // Use a prop selectedTypes
                                selectedTypes.includes(t) 
                                    ? "outline outline-2 outline-black dark:outline-white scale-105"
                                    : "opacity-70 hover:opacity-100"
                            }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t}
                    </motion.button>
                ))}
            </div>
        </>
    );
}