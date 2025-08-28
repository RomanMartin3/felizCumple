// src/App.tsx

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import styled from "@emotion/styled";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import PhotoGallery from "./PhotoGallery";

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

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
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

const MusicPlayerContainer = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
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

const SecretSectionButton = styled(motion.button)`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #db2777;
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalQuestion = styled.h2`
  color: #db2777;
  margin-bottom: 1.5rem;
`;

// --- INPUT MODIFICADO ---
const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-family: inherit; /* Asegura que use la misma fuente */
  color: #333; /* Color de texto para el input */
  font-size: 1rem;
`;

const ModalButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #db2777;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

export default function App() {
  const [opened, setOpened] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const correctAnswer = "2016-10-27";

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

  const handleUnlock = () => {
    if (secretAnswer === correctAnswer) {
      setIsUnlocked(true);
      setShowSecretModal(false);
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Heee bro como no vas a saber cuando fue nuestro primer beso! "
      );
    }
  };

  const text = "🎂 ¡Feliz Cumpleaños Pompa! 🎂";

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

      <TopContent>
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

      {!isUnlocked && (
        <SecretSectionButton
          onClick={() => setShowSecretModal(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Tengo una sorpresa más para ti...
        </SecretSectionButton>
      )}

      {showSecretModal && (
        <ModalBackdrop onClick={() => setShowSecretModal(false)}>
          <ModalContent
            onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic dentro
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <ModalQuestion>
              ¿Recuerdas la fecha de nuestro primer beso?
            </ModalQuestion>

            {/* --- CAMBIO PRINCIPAL AQUÍ --- */}
            <ModalInput
              type="date" // Cambiado de "text" a "date"
              value={secretAnswer}
              onChange={(e) => setSecretAnswer(e.target.value)}
            />
            {/* --------------------------- */}

            <ModalButton onClick={handleUnlock}>Desbloquear</ModalButton>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </ModalContent>
        </ModalBackdrop>
      )}

      {isUnlocked && (
        <>
          <SurpriseText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ¡Lo sabías! Siempre tan atenta a cada detalle de nuestra historia.
            Este espacio está lleno de los momentos que han construido nuestro
            amor, cada foto un suspiro, cada instante un tesoro.
          </SurpriseText>

          <PhotoGallery />
        </>
      )}

      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </AppContainer>
  );
}
