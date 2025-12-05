import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FakedleInput({ allFakemons, onGuess }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFakemon, setSelectedFakemon] = useState(null);

    // Filtra Fakémons baseado no termo de busca (máximo de 10 sugestões)
    const suggestions = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2) return [];

        return allFakemons
            .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 10); // Limita a 10 sugestões
    }, [searchTerm, allFakemons]);

    // Função chamada ao clicar em "Tentar" ou selecionar uma sugestão
    const submitGuess = (fakemon) => {
        if (!fakemon) return;

        // Limpa o estado e envia o palpite
        onGuess(fakemon);
        setSearchTerm('');
        setSelectedFakemon(null);
    };

    // Lida com a mudança no campo de texto
    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedFakemon(null); // Desseleciona ao digitar
    };

    // Lida com a submissão do formulário (para quando o usuário usa Enter)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Tenta encontrar uma correspondência exata ou usa a primeira sugestão
        const exactMatch = allFakemons.find(f => f.name.toLowerCase() === searchTerm.toLowerCase());
        
        if (exactMatch) {
            submitGuess(exactMatch);
        } else if (suggestions.length > 0) {
            // Se houver sugestões, tenta a primeira
            submitGuess(suggestions[0]);
        } else {
            // Se não houver nada, exibe um alerta de erro
            console.error("Tentativa inválida. Nome não encontrado.");
            // Poderia ser um modal/snackbar, mas por enquanto, console.
        }
    };


    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="flex rounded-xl shadow-lg bg-white dark:bg-gray-800 p-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Digite o nome de um Fakémon..."
                    className="flex-1 p-3 text-lg bg-transparent focus:outline-none dark:text-gray-100"
                    autoComplete="off"
                    list="fakemon-suggestions" // Para browsers suportarem a lista
                />
                
                <button
                    type="submit"
                    disabled={!searchTerm}
                    className="
                        px-6 py-2 ml-2 rounded-lg font-bold transition duration-200
                        bg-red-600 text-white hover:bg-red-700 disabled:opacity-50
                        dark:bg-green-600 dark:hover:bg-green-700
                    "
                >
                    Tentar
                </button>
            </div>

            {/* Lista de Sugestões Autocomplete */}
            <AnimatePresence>
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-[calc(100%-100px)] mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                    >
                        {suggestions.map(fakemon => (
                            <div
                                key={fakemon.id}
                                onClick={() => submitGuess(fakemon)}
                                className="p-3 cursor-pointer hover:bg-red-100 dark:hover:bg-green-700 transition duration-150 flex justify-between items-center border-b dark:border-gray-700"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                    N°{fakemon.number} - {fakemon.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
}