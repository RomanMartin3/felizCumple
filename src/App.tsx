// src/App.tsx

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import styled from "@emotion/styled";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

// --- Lista de Canciones ---
const songs = [
  { title: "Canción 1", src: "/cancion.mp3" },
  { title: "Canción 2", src: "/cancion2.mp3" },
  { title: "Canción 3", src: "/cancion3.mp3" },
];

// --- Componentes con Estilos ---

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #fecdd3, #ffe4e6, #ffffff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  position: relative;
`;

// AÑADIDO: Un contenedor para ordenar los elementos superiores
const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* Espacio entre el reproductor y el título */
  margin-bottom: 2rem; /* Espacio antes del regalo */
`;

const Title = styled(motion.h1)`
  font-size: 1.875rem;
  font-weight: bold;
  color: #db2777;
  display: flex;
  cursor: pointer;
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Letter = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

const SurpriseText = styled(motion.p)`
  margin-top: 1.5rem;
  font-size: 1.125rem;
  color: #1f2937;
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const GiftBox = styled(motion.div)`
  margin-top: 2.5rem;
  cursor: pointer;
  img {
    width: 10rem;
    height: 10rem;
    margin: 0 auto;
    @media (min-width: 768px) {
      width: 14rem;
      height: 14rem;
    }
  }
`;

// MODIFICADO: Estilos para el reproductor de música
const MusicPlayerContainer = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SongTitle = styled.p`
  color: #c1126d;
  font-weight: bold;
  min-width: 150px;
`;

const PlayerButton = styled.button`
  background: none;
  border: none;
  color: #db2777;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

export default function App() {
  const [opened, setOpened] = useState(false);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].src;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, isPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
  };

  const handleOpenGift = () => {
    setOpened(true);
    const link = document.createElement("a");
    link.href = "/regalo.pdf";
    link.download = "MiRegalo.pdf";
    link.click();
    if (!isPlaying) {
      handlePlayPause();
    }
  };

  const text = "🎂 ¡Feliz Cumpleaños Amor! 🎂";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const letterVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
  };

  return (
    <AppContainer>
      {opened && <Confetti />}

      {/* MODIFICADO: Contenedor para agrupar y posicionar los elementos superiores */}
      <TopContent>
        {/* MODIFICADO: El reproductor ahora va aquí arriba */}
        <MusicPlayerContainer>
          <PlayerButton onClick={handlePrevSong}>
            <FaBackward />
          </PlayerButton>
          <PlayerButton onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayerButton>
          <PlayerButton onClick={handleNextSong}>
            <FaForward />
          </PlayerButton>
        </MusicPlayerContainer>

        <Title variants={containerVariants} initial="hidden" animate="visible">
          {Array.from(text).map((letter, index) => (
            <Letter
              key={index}
              variants={letterVariants}
              whileHover={{ y: -10 }}
            >
              {letter}
            </Letter>
          ))}
        </Title>
      </TopContent>

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
          🎁 Una sesion de masajes para que relajes ese cuello! 💖
        </SurpriseText>
      )}

      {/* La etiqueta de audio puede quedar aquí, ya que es invisible */}
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </AppContainer>
  );
}
