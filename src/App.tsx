// src/App.tsx

import { motion, AnimatePresence } from "framer-motion"; // Importa AnimatePresence
import { useState, useRef, useEffect } from "react";
import Confetti from "react-confetti";
import styled from "@emotion/styled";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRocket,
} from "react-icons/fa";
import PhotoGallery from "./PhotoGallery";
import SpaceAnimation from "./SpaceAnimation"; // Importa el componente de animación

// --- Lista de Canciones ---
const songs = [
  { title: "Canción 1", src: "/cancion.mp3" },
  { title: "Canción 2", src: "/cancion2.mp3" },
  { title: "Canción 3", src: "/cancion3.mp3" },
];

// --- Tipos para el Cuestionario ---
type ImageOption = { id: string; src: string };
type TextOption = { id: string; text: string };

type QuizLevel =
  | { id: number; question: string; type: "date"; correctAnswer: string }
  | {
      id: number;
      question: string;
      type: "image";
      options: ImageOption[];
      correctAnswer: string;
    }
  | {
      id: number;
      question: string;
      type: "text";
      options: TextOption[];
      correctAnswer: string;
    };

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
const RocketButton = styled(motion.button)`
  margin-top: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 4rem;
  color: #db2777;
  display: flex;
  flex-direction: column;
  align-items: center;
  .rocket-icon {
    animation: rocket-animation 1.5s infinite ease-in-out;
  }
  p {
    font-size: 1rem;
    font-weight: bold;
    color: #db2777;
    margin-top: 0.5rem;
  }
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
const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-family: inherit;
  color: #333;
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
const ImageOptionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
`;
const StyledImageOption = styled.img<{ isSelected: boolean }>`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 3px solid ${(props) => (props.isSelected ? "#db2777" : "transparent")};
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;
const TextOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const StyledTextOption = styled.button<{ isSelected: boolean }>`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? "#fecdd3" : "white")};
  color: #333;
  font-size: 1rem;
`;

// ===================================================================
// --- TUS PREGUNTAS PERSONALIZADAS ---
// ===================================================================
const quizLevels: QuizLevel[] = [
  {
    id: 1,
    question: "¿Recuerdas la fecha de nuestro primer beso?",
    type: "date",
    correctAnswer: "2016-10-27",
  },
  {
    id: 2,
    question: "¿Donde fue nuestra primera cita?",
    type: "image",
    options: [
      { id: "A", src: "/correcta.png" },
      { id: "B", src: "/incorrecta1.jpg" },
      { id: "C", src: "/incorrecta2.jpg" },
    ],
    correctAnswer: "A",
  },
  {
    id: 3,
    question: "¿Que hiciste despues de decirme TE AMO por primera vez?",
    type: "text",
    options: [
      { id: "A", text: "Contarle a tus amigas" },
      { id: "B", text: "Pedirme perdon y ponerte a llorar" },
      { id: "C", text: "Ponerte feliz" },
    ],
    correctAnswer: "B",
  },
];

export default function App() {
  const [opened, setOpened] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [showSecretModal, setShowSecretModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSpaceAnimation, setShowSpaceAnimation] = useState(false); // NUEVO ESTADO
  const [errorMessage, setErrorMessage] = useState("");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].src;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSongIndex, isPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleNextSong = () =>
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  const handlePrevSong = () =>
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);

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

  const handleAnswerChange = (levelId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [levelId]: answer }));
  };

  const handleCheckAnswer = () => {
    const level = quizLevels[currentLevel];
    if (answers[level.id] === level.correctAnswer) {
      if (currentLevel < quizLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setErrorMessage("");
      } else {
        // --- LÓGICA DE ANIMACIÓN ---
        setShowSecretModal(false);
        setShowSpaceAnimation(true);
      }
    } else {
      setErrorMessage("¡Respuesta incorrecta! Inténtalo de nuevo.");
    }
  };

  const handleSpaceAnimationComplete = () => {
    setShowSpaceAnimation(false);
    setIsUnlocked(true);
  };

  const startQuiz = () => {
    setCurrentLevel(0);
    setAnswers({});
    setErrorMessage("");
    setShowSecretModal(true);
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

  const renderCurrentLevel = () => {
    const level = quizLevels[currentLevel];
    switch (level.type) {
      case "date":
        return (
          <ModalInput
            type="date"
            value={answers[level.id] || ""}
            onChange={(e) => handleAnswerChange(level.id, e.target.value)}
          />
        );
      case "image":
        return (
          <ImageOptionsContainer>
            {level.options.map((option) => (
              <StyledImageOption
                key={option.id}
                src={option.src}
                alt={`Opción ${option.id}`}
                isSelected={answers[level.id] === option.id}
                onClick={() => handleAnswerChange(level.id, option.id)}
              />
            ))}
          </ImageOptionsContainer>
        );
      case "text":
        return (
          <TextOptionsContainer>
            {level.options.map((option) => (
              <StyledTextOption
                key={option.id}
                isSelected={answers[level.id] === option.id}
                onClick={() => handleAnswerChange(level.id, option.id)}
              >
                {option.text}
              </StyledTextOption>
            ))}
          </TextOptionsContainer>
        );
      default:
        return null;
    }
  };

  return (
    <AppContainer>
      {opened && <Confetti />}

      <AnimatePresence>
        {showSpaceAnimation && (
          <SpaceAnimation onAnimationComplete={handleSpaceAnimationComplete} />
        )}
      </AnimatePresence>

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
          {Array.from(text).map((char, index) => (
            <Letter
              key={index}
              variants={letterVariants}
              whileHover={{ y: -10 }}
            >
              {char}
            </Letter>
          ))}
        </Title>
      </TopContent>
      <GiftBox
        onClick={handleOpenGift}
        initial={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={opened ? "/gift-open.png" : "/gift-closed.png"}
          alt="Caja de regalo"
        />
      </GiftBox>
      {opened && (
        <SurpriseText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🎁 ¡Una sesión de masajes para que relajes ese cuello! 💖
        </SurpriseText>
      )}
      {opened && !isUnlocked && !showSpaceAnimation && (
        <RocketButton
          onClick={startQuiz}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="rocket-icon">
            <FaRocket />
          </div>
          <p>Tengo una sorpresa más para ti...</p>
        </RocketButton>
      )}
      {showSecretModal && (
        <ModalBackdrop onClick={() => setShowSecretModal(false)}>
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <ModalQuestion>{quizLevels[currentLevel].question}</ModalQuestion>
            {renderCurrentLevel()}
            <ModalButton onClick={handleCheckAnswer}>
              {currentLevel === quizLevels.length - 1
                ? "Desbloquear"
                : "Siguiente"}
            </ModalButton>
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
            Cada estrella es un momento y cada momento con vos es infinito como las estrellas
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
