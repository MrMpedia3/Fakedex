import { useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import SearchBar from "../components/SearchBar";
import FakemonCard from "../components/FakemonCard";
import { typeSolid } from "../styles/typeColors";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Usa um array para tipos selecionados (permite múltiplos)
  const [selectedTypes, setSelectedTypes] = useState([]); 
  
  // Estado para armazenar o termo de busca para persistência
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const [isTeleporting, setIsTeleporting] = useState(false);

  useEffect(() => {
    fetch("/data/fakemon.json")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setFiltered(d);
        setLoading(false);
      });
  }, []);

  // Centraliza a função de busca de texto
  function handleSearch(q) {
    const term = q.trim().toLowerCase();
    setSearchTerm(term); // Atualiza o estado da busca
    // Aplica os filtros imediatamente com o novo termo e os tipos atuais
    applyFilters(term, selectedTypes); 
  }

  // Lógica de Filtragem Múltipla
  function applyFilters(currentSearchTerm, currentTypes) {
    let result = data;

    // 1. Filtragem por Texto (Nome/Número/ID)
    if (currentSearchTerm) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(currentSearchTerm) ||
          ("" + f.number).includes(currentSearchTerm) ||
          ("" + f.id).includes(currentSearchTerm)
      );
    }

    // 2. Filtragem por Múltiplos Tipos (Fakémon deve ter TODOS os tipos selecionados)
    if (currentTypes.length > 0) {
      result = result.filter((f) => 
        // Usa `every` para garantir que o Fakémon possua CADA tipo selecionado
        currentTypes.every(selectedType => f.types.includes(selectedType))
      );
    }

    setFiltered(result);
  }

  // Gerencia o array de Tipos Selecionados
  function handleTypeSelect(type) {
    let newTypes;

    if (selectedTypes.includes(type)) {
      // Se o tipo já está selecionado, remove-o (toggle off)
      newTypes = selectedTypes.filter((t) => t !== type);
    } else {
      // Se o tipo não está selecionado, adiciona-o (toggle on)
      newTypes = [...selectedTypes, type];
    }
    
    // Atualiza o estado dos tipos e aplica os filtros, preservando o termo de busca
    setSelectedTypes(newTypes);
    applyFilters(searchTerm, newTypes); // Usa o estado atual de searchTerm
  }
  
  // Para garantir que o filtro inicial seja aplicado após o carregamento dos dados
  useEffect(() => {
    if (data.length > 0) {
        applyFilters(searchTerm, selectedTypes);
    }
  }, [data]);


  // ⚡ Teleporte no botão Aleatório
  function handleRandomClick() {
    if (data.length === 0) return;
    const random = data[Math.floor(Math.random() * data.length)];

    setIsTeleporting(true);

    setTimeout(() => {
      router.push(`/fakemon/${random.id}`);
    }, 650);
  }

  if (loading) return <p className="p-6">Carregando...</p>;

  const allTypes = Array.from(new Set(data.flatMap((f) => f.types)));

  return (
    <motion.div
      className="max-w-6xl mx-auto px-3 sm:px-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Barra de busca + botão Aleatório */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 relative">
        <SearchBar onSearch={handleSearch} data={data} />

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

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap my-4 justify-center sm:justify-start">
        {allTypes.map((t) => (
          <motion.button
            key={t}
            onClick={() => handleTypeSelect(t)}
            className={`filtros px-3 py-1 rounded-full text-sm text-white shadow 
              ${typeSolid[t]} 
              ${
                selectedTypes.includes(t) // Verificação no novo array
                  ? "outline outline-2 outline-black dark:outline-white scale-105" // Destaque ativado
                  : "opacity-70 hover:opacity-100" // Destaque desativado
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {/* Lista de Fakemons */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 mt-6">Nenhum fakemon encontrado...</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence> 
            {filtered.map((f) => (
              <motion.div
                key={f.id}
                layout="position" 
                
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                
                exit={{ opacity: 0, scale: 0.8 }} 
                
                transition={{ duration: 0.3 }}
              >
                <FakemonCard f={f} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}