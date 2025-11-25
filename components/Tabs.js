import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Tabs({ active = 0, onChange = () => {}, tabs = [] }) {
  
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
    },
    exit: (direction) => ({
      x: direction > 0 ? -40 : 40,
      opacity: 0,
      position: "absolute",
    }),
  };

  return (
    <div>
      {/* Abas iguais (1/3 cada) */}
      <div className="grid grid-cols-3 mb-4 border-b border-gray-300/30 dark:border-gray-700/30 pb-2">
        {tabs.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`relative py-2 w-full text-center font-semibold transition-all ${
                isActive
                  ? "bg-white/80 dark:bg-gray-700 text-black dark:text-white shadow"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {t.label}

              {isActive && (
                <span className="absolute left-0 -bottom-[2px] w-full h-[3px] bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Painéis animados */}
      <div className="relative min-h-[200px]"> 
        <AnimatePresence custom={active} mode="wait">
          <motion.div
            key={active}
            custom={active}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {tabs[active].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
