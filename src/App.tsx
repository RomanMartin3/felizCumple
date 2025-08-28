// src/App.tsx

import { motion } from "framer-motion";
import { useState } from "react";
import Confetti from "react-confetti";
import styled from "@emotion/styled";

// --- Componentes con Estilos (usando Emotion) ---

// Contenedor principal de la aplicación
const AppContainer = styled.div`
  min-height: 100vh;
  /* Degradado de rosa pálido a blanco, como en tu código original */
  background: linear-gradient(to bottom, #fecdd3, #ffe4e6, #ffffff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  font-family: sans-serif;
`;

// Título principal
const Title = styled(motion.h1)`
  font-size: 1.875rem; /* text-3xl */
  font-weight: bold;
  color: #db2777; /* text-pink-600 */

  @media (min-width: 768px) {
    font-size: 3rem; /* md:text-5xl */
  }
`;

// Párrafo de sorpresa
const SurpriseText = styled(motion.p)`
  margin-top: 1.5rem; /* mt-6 */
  font-size: 1.125rem; /* text-lg */
  color: #1f2937; /* text-gray-800 */

  @media (min-width: 768px) {
    font-size: 1.5rem; /* md:text-2xl */
  }
`;

// Contenedor de la imagen del regalo
const GiftBox = styled(motion.div)`
  margin-top: 2.5rem; /* mt-10 */
  cursor: pointer;

  img {
    width: 10rem; /* w-40 */
    height: 10rem; /* h-40 */
    margin: 0 auto;

    @media (min-width: 768px) {
      width: 14rem; /* md:w-56 */
      height: 14rem; /* md:h-56 */
    }
  }
`;

export default function App() {
  const [opened, setOpened] = useState(false);

  const handleOpenGift = () => {
    setOpened(true);

    // Descargar PDF del regalo
    const link = document.createElement("a");
    link.href = "/regalo.pdf";
    link.download = "MiRegalo.pdf";
    link.click();
  };

  return (
    <AppContainer>
      {opened && <Confetti />}

      <Title
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🎂 ¡Feliz Cumpleaños Amor! 🎂
      </Title>

      <GiftBox
        onClick={handleOpenGift}
        initial={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        {!opened ? (
          <img src="/gift-closed.png" alt="Caja de regalo" />
        ) : (
          <img src="/gift-open.png" alt="Regalo abierto" />
        )}
      </GiftBox>

      {opened && (
        <SurpriseText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🎁 ¡Sorpresa! Descargaste tu regalo 💖
        </SurpriseText>
      )}

      <audio autoPlay loop>
        <source src="/cancion.mp3" type="audio/mpeg" />
      </audio>
    </AppContainer>
  );
}
