import "../styles/globals.css";
import Header from "../components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* O Header não recebe mais props de estado */}
      <Header />

      {/* Adiciona um padding TOP para que o conteúdo não fique escondido sob o Header fixo */}
      <main className="flex-1 px-3 sm:px-6 pt-[60px] py-4"> 
        <AnimatePresence mode="wait">
          <motion.div
            key={router.asPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* O Component não recebe mais props de estado do Fakédle */}
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}