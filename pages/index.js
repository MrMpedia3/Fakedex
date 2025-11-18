import { useEffect, useState } from "react";
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
  const [selectedType, setSelectedType] = useState(null);
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

  function handleSearch(q) {
    const term = q.trim().toLowerCase();
    if (!term) return applyFilters(null, selectedType);
    applyFilters(term, selectedType);
  }

  function applyFilters(searchTerm, type) {
    let result = data;

    if (searchTerm) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(searchTerm) ||
          ("" + f.number).includes(searchTerm) ||
          ("" + f.id).includes(searchTerm)
      );
    }

    if (type) {
      result = result.filter((f) => f.types.includes(type));
    }

    setFiltered(result);
  }

  function handleTypeSelect(type) {
    const newType = type === selectedType ? null : type;
    setSelectedType(newType);
    applyFilters(null, newType);
  }

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
                     shadow mt-4 sm:mt-16 overflow-hidden"
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
          <button
            key={t}
            onClick={() => handleTypeSelect(t)}
            className={`px-3 py-1 rounded-full text-sm text-white shadow 
              ${typeSolid[t]} 
              ${
                selectedType === t
                  ? "outline outline-2 outline-black dark:outline-white"
                  : ""
              }
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Lista de Fakemons */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 mt-6">Nenhum fakemon encontrado...</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        >
          {filtered.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <FakemonCard f={f} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
