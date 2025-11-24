// pages/fakemon/[id].js
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "../../components/Tabs";
import { typeColors } from "../../styles/typeColors";
import { moveTypeColor } from "../../styles/typeColors";

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
  const [tab, setTab] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetch("/data/fakemon.json")
      .then((r) => r.json())
      .then((d) => {
        setTotal(d.length);
        const found = d.find(
          (x) => String(x.id) === String(id) || String(x.number) === String(id)
        );
        setF(found ?? null);
      })
      .catch(() => {
        setF(null);
      });
  }, [id]);

  if (f === null) return <div className="p-6 text-lg">Carregando...</div>;
  if (!f) return <div className="p-6 text-lg">Fakemon não encontrado.</div>;

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

  // EVOLUÇÕES ---------------------------------------------------
  const EvolutionLine = () =>
    f.evolutions && f.evolutions.length > 0 ? (
      <div className="mt-6">
        <hr />
        <br />
        <h3 className="font-bold text-lg mb-3">Linha Evolutiva</h3>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <Image src={f.image} alt={f.name} width={80} height={80} />
            <div className="font-semibold">{f.name}</div>
            <div className="text-xs text-gray-500">#{f.number}</div>
          </div>

          {f.evolutions.map((ev) => (
            <div key={ev.id} className="flex items-center gap-6">
              <div className="text-2xl animate-pulseArrow">➡️</div>

              <div
                className="text-center cursor-pointer hover:scale-105 transition"
                onClick={() => {
                  setF(null);
                  router.push(`/fakemon/${ev.id}`);
                }}
              >
                <Image src={ev.image} alt={ev.name} width={80} height={80} />
                <div className="font-semibold">{ev.name}</div>
                <div className="text-xs text-gray-500">#{ev.number}</div>
                <div className="text-xs text-purple-600 mt-1">{ev.method}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  // TABS ---------------------------------------------------------
  const tabs = [
    {
      label: "Básico",
      content: (
        <div className="pt-2">
          <p className="text-lg leading-relaxed">{f.entry}</p>
          <EvolutionLine />
        </div>
      ),
    },
    {
      label: "Enciclopédia",
      content: (
        <div className="pt-2">
          <div className="space-y-3 leading-relaxed">
            {f.description.split("\n").map(
              (para, i) => para.trim() !== "" && <p key={i}>{para}</p>
            )}
          </div>

          <br />
          <hr />
          <br />

          <p><strong>Altura:</strong> {f.height_m} m</p>
          <p><strong>Peso:</strong> {f.weight_kg} kg</p>

          {/* COMPARAÇÃO */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">
              Comparação de Tamanho
            </h3>

            <div className="flex items-end gap-8">
              {/* Régua */}
              <div className="flex flex-col justify-between h-52 border-l-2 border-gray-700 pr-3">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const maxDisplay = Math.max(f.height_m || 0, 1.7);
                  const value = (maxDisplay - (maxDisplay / 5) * i).toFixed(1);
                  return (
                    <span key={i} className="text-xs text-gray-600">
                      {value}m
                    </span>
                  );
                })}
              </div>

              {/* Fakemon */}
              <div className="flex flex-col items-center">
                <Image
                  src={f.image}
                  alt={f.name}
                  width={120}
                  height={120}
                  style={{
                    height: `${(f.height_m / Math.max(f.height_m, 1.7)) * 200}px`,
                    width: "auto",
                  }}
                />
              </div>

              {/* Humano */}
              <div className="flex flex-col items-center">
                <Image
                  src="/images/person.png"
                  alt="Pessoa"
                  width={120}
                  height={120}
                  style={{
                    height: `${(1.7 / Math.max(f.height_m, 1.7)) * 200}px`,
                    width: "auto",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Técnico",
      content: (
        <div className="pt-2">
  {/* HABILIDADES */}
  <h4 className="mt-4 font-semibold mb-2">Habilidades</h4>
  <div className="flex flex-wrap gap-3">
    {(f.abilities || []).map((ab, i) => (
      <div key={i} className="relative inline-block">
        {/* Trigger do hover */}
        <span className="px-3 py-1 text-sm rounded-md bg-gray-200 cursor-help shadow group inline-block relative">
          {ab.name}

          {/* Tooltip */}
          <div
            className="absolute left-1/2 -translate-x-1/2 mt-1 w-max max-w-xs 
                       p-2 text-xs rounded-md bg-gray-800 text-white shadow 
                       opacity-0 scale-95 pointer-events-none 
                       transition-all duration-200 
                       group-hover:opacity-100 group-hover:scale-100 z-50"
          >
            {ab.desc}
          </div>
        </span>
      </div>
    ))}
  </div>

  {f.hidden_ability && (
    <>
      <h4 className="mt-4 font-semibold mb-2 text-purple-600">
        Habilidade Oculta
      </h4>

      <div className="relative inline-block">
        <span className="px-3 py-1 text-sm rounded-md bg-purple-200 cursor-help shadow group inline-block relative">
          {f.hidden_ability.name}

          <div
            className="absolute left-1/2 -translate-x-1/2 mt-1 w-max max-w-xs 
                       p-2 text-xs rounded-md bg-gray-800 text-white shadow 
                       opacity-0 scale-95 pointer-events-none 
                       transition-all duration-200 
                       group-hover:opacity-100 group-hover:scale-100 z-50"
          >
            {f.hidden_ability.desc}
          </div>
        </span>
      </div>
    </>
  )}


          {/* STATS */}
          <h4 className="mt-6 font-semibold mb-2">Base Stats</h4>
          <div className="mt-2 space-y-2">
            {Object.entries(f.base_stats).map(([stat, value]) => {
              let barColor =
                value <= 50
                  ? "bg-red-500"
                  : value <= 90
                  ? "bg-yellow-400"
                  : "bg-green-500";

              return (
                <div key={stat}>
                  <span className="uppercase text-xs font-bold text-gray-600">
                    {stat}
                  </span>
                  <div className="w-full h-3 bg-gray-300 rounded overflow-hidden">
                    <div
                      className={`${barColor} h-full transition-all`}
                      style={{ width: `${(value / 180) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{value}</span>
                </div>
              );
            })}
          </div>

          {/* MOVES */}
          <h4 className="mt-6 font-semibold mb-2">Movimentos</h4>
          <div className="flex flex-wrap gap-3 mt-2">
            {(f.moves || []).map((m, i) => {
              const categoryIcon =
                m.category === "physical"
                  ? "⚔️"
                  : m.category === "special"
                  ? "✨"
                  : "🌀";

              const bg = moveTypeColor[m.type] || "#666";

              const getTextColor = (hex) => {
                const c = hex.replace("#", "");
                const r = parseInt(c.substring(0, 2), 16);
                const g = parseInt(c.substring(2, 4), 16);
                const b = parseInt(c.substring(4, 6), 16);
                return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000" : "#fff";
              };

              return (
  <div key={i} className="relative inline-block">
    {/* Trigger */}
    <span
      className="px-3 py-1 text-sm rounded-md shadow cursor-help flex items-center gap-1 group inline-flex relative"
      style={{ backgroundColor: bg, color: getTextColor(bg) }}
    >
      {categoryIcon} Lv {m.level}: {m.name}

      {/* Tooltip */}
      <div
  className="absolute left-1/2 top-full -translate-x-1/2 mt-1 w-max max-w-xs 
             p-2 text-xs rounded-md bg-gray-800 text-white shadow 
             opacity-0 scale-95 pointer-events-none 
             transition-all duration-200 
             group-hover:opacity-100 group-hover:scale-100 z-50">
        <div className="font-semibold text-sm">{m.name}</div>

        <div className="text-gray-300">
          {m.category === "physical"
            ? "Físico"
            : m.category === "special"
            ? "Especial"
            : "Status"}
        </div>

        {m.power && (
          <div>
            <span className="text-gray-400">Poder:</span> {m.power}
          </div>
        )}

        {m.accuracy && (
          <div>
            <span className="text-gray-400">Precisão:</span> {m.accuracy}%
          </div>
        )}

        {m.desc && (
          <div className="pt-1 border-t border-gray-700">
            {m.desc}
          </div>
        )}
      </div>
    </span>
  </div>
);

            })}
          </div>
        </div>
      ),
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
      className="min-h-screen animated-gradient transition-colors duration-700"
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
          {/* NAV BUTTONS */}
          <div className="flex items-center justify-between mb-6 w-full gap-4">
            <div className="flex-1 flex justify-start">
              <motion.button
                onClick={goPrev}
                className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-100 transition"
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
                className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-100 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                Voltar
              </motion.button>
            </div>

            <div className="flex-1 flex justify-end">
              <motion.button
                onClick={goNext}
                className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-100 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                Próximo →
              </motion.button>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-6 bg-white shadow overflow-visible">
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
