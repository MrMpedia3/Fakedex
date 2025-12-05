import React, { useState, useEffect } from 'react';
import FakedleGame from '../components/FakedleGame';
import { motion } from 'framer-motion';

export default function FakedlePage() {
    const [allFakemons, setAllFakemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Novo estado para erro

    // Carrega os dados da Dex, necessários para o jogo
    useEffect(() => {
        // Tente usar o caminho relativo, assumindo que fakemon.json está em 'public/data/fakemon.json'
        // Se seu arquivo JSON está na pasta 'public', o caminho de fetch deve ser '/data/fakemon.json'
        const dataPath = '/data/fakemon.json'; 

        fetch(dataPath)
          .then((r) => {
              if (!r.ok) {
                  throw new Error(`Erro de rede: ${r.status} ${r.statusText}`);
              }
              return r.json();
          })
          .then((d) => {
            if (d && Array.isArray(d) && d.length > 0) {
                setAllFakemons(d);
            } else {
                throw new Error("Dados carregados estão vazios ou inválidos.");
            }
            setLoading(false);
          })
          .catch(err => {
            console.error("ERRO FATAL ao carregar dados do Fakédle:", err);
            setError("Não foi possível carregar a Fakédex. Verifique se 'public/data/fakemon.json' existe e está formatado corretamente.");
            setLoading(false);
          });
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center mt-10">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-4xl mx-auto mb-4"
                >
                    🔄
                </motion.div>
                <p className="text-xl dark:text-gray-300">Carregando a Fakédex para iniciar o Fakédle...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center mt-10 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <h2 className="text-2xl font-bold mb-3">Erro no Jogo</h2>
                <p>{error}</p>
                <p className="mt-2 text-sm">Por favor, verifique o console para mais detalhes sobre o erro de carregamento.</p>
            </div>
        );
    }

    // Passa a lista completa para o componente de jogo
    return <FakedleGame allFakemons={allFakemons} />;
}