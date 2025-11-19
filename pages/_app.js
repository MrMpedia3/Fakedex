import "../styles/globals.css";
import Header from "../components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-3 sm:px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.asPath} // muda mesmo em rotas dinâmicas
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
