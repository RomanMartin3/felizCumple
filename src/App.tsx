import { motion } from "framer-motion";
import { useState } from "react";
import Confetti from "react-confetti";

export default function App() {
  const [opened, setOpened] = useState(false);

  const handleOpenGift = () => {
    setOpened(true);

    // Descargar PDF del regalo
    const link = document.createElement("a");
    link.href = "/regalo.pdf"; // tu archivo en /public
    link.download = "MiRegalo.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-100 to-white flex flex-col items-center justify-center text-center p-4 font-sans">
      {opened && <Confetti />}

      {/* Texto de bienvenida */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-5xl font-bold text-pink-600"
      >
        🎂 ¡Feliz Cumpleaños Amor! 🎂
      </motion.h1>

      {/* Caja de regalo */}
      <motion.div
        className="mt-10 cursor-pointer"
        onClick={handleOpenGift}
        initial={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        {!opened ? (
          <img
            src="/gift-closed.png"
            alt="Caja de regalo"
            className="w-40 h-40 md:w-56 md:h-56 mx-auto"
          />
        ) : (
          <img
            src="/gift-open.png"
            alt="Regalo abierto"
            className="w-40 h-40 md:w-56 md:h-56 mx-auto"
          />
        )}
      </motion.div>

      {/* Mensaje después de abrir */}
      {opened && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg md:text-2xl text-gray-800"
        >
          🎁 ¡Sorpresa! Descargaste tu regalo 💖
        </motion.p>
      )}

      {/* Música de fondo */}
      <audio autoPlay loop>
        <source src="/cancion.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
