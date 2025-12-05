import { useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import FakemonCard from "../components/FakemonCard";
import FakemonControls from "../components/FakemonControls";
import FakédleGame from '../components/FakedleGame';

export default function Home({ isFakedleOpen, toggleFakedle }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Usa um array para tipos selecionados (permite múltiplos)
  const [selectedTypes, setSelectedTypes] = useState([]); 
  
  // Estado para armazenar o termo de busca para persistência
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const [isTeleporting, setIsTeleporting] = useState(false);

  // NOVO: Estado para ordenar (campo e direção)
  const [sortCriteria, setSortCriteria] = useState({ field: 'number', direction: 'asc' }); 

  const handleFieldChange = (e) => {
    const newField = e.target.value; 
    setSortCriteria(prev => ({ 
        // Mantém a direção atual, mas muda o campo
        field: newField, 
        direction: prev.direction 
    }));
  };

  const handleDirectionToggle = () => {
    setSortCriteria(prev => ({ 
        field: prev.field,
        // Inverte a direção atual
        direction: prev.direction === 'asc' ? 'desc' : 'asc' 
    }));
  };
  
  // EFEITO 1: Carrega os dados uma única vez
  useEffect(() => {
    fetch("/data/fakemon.json")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        // Não precisa setar filtered aqui, o useEffect de filtro/ordenação fará isso.
        setLoading(false);
      });
  }, []);


  // Centraliza a função de busca de texto
  function handleSearch(q) {
    const term = q.trim().toLowerCase();
    setSearchTerm(term); // Atualiza o estado da busca
    // A ordenação/filtragem real é disparada pelo useEffect de filtro/ordenação
  }
  
  // LÓGICA PRINCIPAL: Filtra, Busca E ORDENA.
  function applyFilters(currentSearchTerm, currentTypes) {
    let result = [...data];

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
        currentTypes.every(selectedType => f.types.includes(selectedType))
      );
    }
    
    // 3. Lógica de Ordenação
    const { field, direction } = sortCriteria;

    result.sort((a, b) => {
      let valA, valB;

      // --- Definição dos Valores (valA e valB) ---
      if (field === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } 
      else if (field === 'total_stats') {
        // Soma todos os base_stats para o total
        const sumStats = (f) => Object.values(f.base_stats || {}).reduce((sum, val) => sum + val, 0);
        valA = sumStats(a);
        valB = sumStats(b);
      }
      else if (field === 'number') {
        valA = a.number || 0;
        valB = b.number || 0;
      } 
      else if (field === 'weight') {
        valA = a.weight_kg || 0;
        valB = b.weight_kg || 0;
      } 
      else if (field === 'height') {
        valA = a.height_m || 0;
        valB = b.height_m || 0;
      } 
      else {
        // Para Stats Individuais (hp, attack, defense, speed, etc.)
        valA = a.base_stats ? a.base_stats[field] : 0;
        valB = b.base_stats ? b.base_stats[field] : 0;
      }

      // --- Aplicação da Comparação CORRIGIDA ---
      let comparison = 0;

      // 1. Encontra a comparação padrão (Assumindo Ascendente)
      if (valA < valB) {
          comparison = -1; 
      } else if (valA > valB) {
          comparison = 1;  
      }
      
      // 2. Aplica a Inversão se a direção for descendente
      if (direction === 'desc') {
          comparison = comparison * -1;
      }

      // 3. Desempate por número da dex
      // Se a comparação ainda for 0 (empate), usa o número da dex como desempate final.
      if (comparison === 0) {
          return a.number - b.number;
      }

      return comparison;
    });

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
    
    setSelectedTypes(newTypes);
    // A ordenação/filtragem real é disparada pelo useEffect abaixo
  }
  
  // EFEITO 2: Dispara a filtragem/ordenação sempre que os dados, busca, tipos ou ordenação mudam
  useEffect(() => {
  if (data.length > 0) {
      applyFilters(searchTerm, selectedTypes);
    }
  }, [data, searchTerm, selectedTypes, sortCriteria]);


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

      {isFakedleOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="relative max-h-full overflow-y-auto">
                <FakédleGame 
                  allFakemons={data} // 💡 AGORA 'data' ESTÁ DISPONÍVEL!
                  onClose={toggleFakedle} 
                />
                        <button
                            onClick={toggleFakedle}
                            className="absolute top-4 right-4 text-white text-3xl z-50"
                        >
                            &times;
                        </button>
                    </div>
              </div>
      )}

      <FakemonControls
            allTypes={allTypes}
            selectedTypes={selectedTypes}
            sortCriteria={sortCriteria}
            isTeleporting={isTeleporting}
            handleSearch={handleSearch}
            handleTypeSelect={handleTypeSelect}
            handleFieldChange={handleFieldChange} 
            handleDirectionToggle={handleDirectionToggle}
            handleRandomClick={handleRandomClick}
            data={data} // Passa data para que SearchBar funcione internamente
        />

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