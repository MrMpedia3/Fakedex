import React, { useState, useEffect, useMemo } from 'react';
import FakedleInput from './FakedleInput';
import FakedleHintRow from './FakedleHintRow';
import FakedleHintsDisplay from './FakedleHintsDisplay'; 
import { motion, AnimatePresence } from 'framer-motion';

// -----------------------------------------------------------
// FUNÇÃO AUXILIAR: GERAÇÃO DE DICAS
// -----------------------------------------------------------

const generateHints = (target, guess) => {
    const hints = {};

    // 1. COMPARAÇÃO DE TIPOS
    const targetTypes = target.types || [];
    const guessTypes = guess.types || [];

    // Tipo 1
    if (guessTypes[0] === targetTypes[0]) {
        hints.type1 = 'correct'; 
    } else if (targetTypes.includes(guessTypes[0])) {
        hints.type1 = 'partial'; 
    } else {
        hints.type1 = 'incorrect';
    }

    // Tipo 2 (Só compara se o Fakémon adivinhado tiver um segundo tipo)
    if (guessTypes.length > 1) {
        if (guessTypes[1] === targetTypes[1]) {
            hints.type2 = 'correct'; 
        } else if (targetTypes.includes(guessTypes[1])) {
            hints.type2 = 'partial'; 
        } else {
            hints.type2 = 'incorrect'; 
        }
    } else {
        // Se a tentativa tem 1 tipo e o alvo tem 2, é incorreto. 
        hints.type2 = targetTypes.length > 1 ? 'incorrect' : 'partial';
    }

    // 2. COMPARAÇÃO DE ALTURA (Setas)
    const targetHeight = target.height_m || 0;
    const guessHeight = guess.height_m || 0;
    const HEIGHT_TOLERANCE = 0.1; 

    if (Math.abs(guessHeight - targetHeight) <= HEIGHT_TOLERANCE) {
        hints.height = 'correct'; 
    } else if (guessHeight > targetHeight) {
        hints.height = 'down'; // Se o chute é MAIOR, precisa ir para BAIXO
    } else {
        hints.height = 'up'; // Se o chute é MENOR, precisa ir para CIMA
    }

    // 3. COMPARAÇÃO DE PESO (Setas)
    const targetWeight = target.weight_kg || 0;
    const guessWeight = guess.weight_kg || 0;
    const WEIGHT_TOLERANCE = 5; 

    if (Math.abs(guessWeight - targetWeight) <= WEIGHT_TOLERANCE) {
        hints.weight = 'correct'; 
    } else if (guessWeight > targetWeight) {
        hints.weight = 'down'; // Se o chute é MAIS PESADO, precisa ir para BAIXO
    } else {
        hints.weight = 'up'; // Se o chute é MAIS LEVE, precisa ir para CIMA
    }

    // 4. COMPARAÇÃO DE ESTÁGIO EVOLUTIVO (CORRIGIDO PARA SETAS)
    const targetStage = target.evolution_stage || 1; 
    const guessStage = guess.evolution_stage || 1;

    if (guessStage === targetStage) {
        hints.stage = 'correct';
    } else if (guessStage < targetStage) {
        // Se o palpite é um estágio MENOR (ex: 1), e o alvo é MAIOR (ex: 3), a seta aponta para CIMA.
        hints.stage = 'up'; 
    } else {
        // Se o palpite é um estágio MAIOR (ex: 3), e o alvo é MENOR (ex: 1), a seta aponta para BAIXO.
        hints.stage = 'down'; 
    }

    // 5. COMPARAÇÃO DE "LINHA FINAL"
    const targetIsFinal = target.is_final_stage === true;
    const guessIsFinal = guess.is_final_stage === true;

    hints.isFinal = (guessIsFinal === targetIsFinal) ? 'correct' : 'incorrect';

    return hints;
};

// -----------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------

export default function FakedleGame({ allFakemons }) {
    const [targetFakemon, setTargetFakemon] = useState(null);
    const [guesses, setGuesses] = useState([]); // [{...fakemon, hints: {...}, idUnico: number}, ...]
    const [isGameOver, setIsGameOver] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Função auxiliar para sortear um novo Fakémon
    const selectNewTarget = () => {
        if (allFakemons && allFakemons.length > 0) {
            const randomIndex = Math.floor(Math.random() * allFakemons.length);
            const newTarget = allFakemons[randomIndex];
            setTargetFakemon(newTarget);
            console.log("Fakémon Secreto Escolhido:", newTarget.name);
            setIsLoading(false);
        }
    };

    // Efeito de inicialização: Escolhe um Fakémon secreto
    useEffect(() => {
        if (allFakemons && allFakemons.length > 0) {
            selectNewTarget();
        }
    }, [allFakemons]);

    const handleGuess = (guessedFakemon) => {
        if (isGameOver) return;

        // 1. GERA O FEEDBACK
        const hints = generateHints(targetFakemon, guessedFakemon);
        
        // 2. CORREÇÃO: Cria um objeto de tentativa com uma chave única (timestamp)
        const newGuess = {
            ...guessedFakemon, 
            hints: hints,
            // Adiciona um timestamp para garantir unicidade da chave no mapeamento (resolvendo o bug de duplicação)
            idUnico: Date.now() + Math.random(), 
        };

        // 3. Adiciona a tentativa
        setGuesses(prev => [...prev, newGuess]);

        // 4. Verifica se acertou
        if (guessedFakemon.name === targetFakemon.name) {
            setIsGameOver(true);
            console.log(`Parabéns! Você acertou o ${targetFakemon.name} em ${guesses.length + 1} tentativas!`);
        }
    };
    
    // Função para reiniciar o jogo
    const handleRestart = () => {
        setGuesses([]); // Limpa o estado das tentativas (resolvendo o bug de reset)
        setIsGameOver(false);
        setIsLoading(true);
        selectNewTarget(); // Escolhe um novo Fakémon
    };
    
    // Calcula o número de tentativas
    const attempts = guesses.length;

    if (isLoading || !targetFakemon) {
        return <div className="text-center p-8">Preparando o Fakédle...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-red-600 dark:text-green-400">
                Fakédle - O Jogo
            </h2>
            
            {/* Mensagem de Vencedor / Reiniciar */}
            {isGameOver && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="text-center mb-6 p-4 bg-red-100 dark:bg-green-900 rounded-xl shadow-inner border border-red-300 dark:border-green-600"
                >
                    <p className="font-bold text-lg text-red-800 dark:text-green-300">
                        Você acertou! O Fakémon era o {targetFakemon.name} em {attempts} tentativas!
                    </p>
                    <button 
                        onClick={handleRestart} 
                        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-md"
                    >
                        Jogar Novamente 🎲
                    </button>
                </motion.div>
            )}

            {/* Input de Tentativas */}
            {!isGameOver && (
                <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <FakedleInput 
                        allFakemons={allFakemons} 
                        onGuess={handleGuess}
                    />
                </motion.div>
            )}

            {/* Exibição de Tentativas Anteriores */}
            <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                    {[...guesses].reverse().map((g) => ( // Reverse para mostrar o mais recente em cima
                        <motion.div 
                            key={g.idUnico} // CORREÇÃO: Usando a chave única
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                            transition={{ duration: 0.4 }}
                        >
                            <FakedleHintRow guessedFakemon={g} hints={g.hints} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {/* Exibição das Dicas Progressivas */}
            {attempts > 0 && !isGameOver && (
                <FakedleHintsDisplay attempts={attempts} targetFakemon={targetFakemon} />
            )}
            
            {/* Placeholder para a estrutura do Row */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Critérios: Imagem, Nome, Tipo 1, Tipo 2, Altura, Peso, Estágio Evolutivo, Estágio Final
            </p>

        </div>
    );
}