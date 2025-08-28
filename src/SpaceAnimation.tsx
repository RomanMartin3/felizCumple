// src/SpaceAnimation.tsx

import React, { useMemo } from 'react'; // Importa useMemo
import styled from '@emotion/styled';
import { motion} from 'framer-motion'; // Importa Variants
import type { Variants } from 'framer-motion';
import { FaRocket, FaStar } from 'react-icons/fa';

// --- Estilos para el Componente ---
const SpaceAnimationContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #000033, #000000); /* Fondo oscuro espacial */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 200; /* Asegúrate de que esté por encima de todo */
  overflow: hidden;
`;

const Rocket = styled(motion.div)`
  font-size: 5rem;
  color: #a0c4ff; /* Azul espacial claro */
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
`;

const Star = styled(motion.div)`
  position: absolute;
  color: #fff;
`;

const Phrase = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-top: 2rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  z-index: 1; /* Para que esté por encima de las estrellas */

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

// --- Animaciones Framer Motion (CORREGIDAS) ---
// Se le da un tipo explícito 'Variants' al objeto
const rocketVariants: Variants = {
  initial: { y: 0, x: 0, rotate: -45 },
  animate: {
    y: -400,
    x: 200,
    scale: 1.2,
    rotate: -30,
    // La transición ahora es un solo objeto, lo que simplifica los tipos
    // y soluciona el error.
    transition: {
      duration: 2,
      ease: "easeOut"
    }
  }
};

const phraseVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1, delay: 1.5 } 
  }
};

const generateStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <Star
          key={i}
          initial={{ 
            opacity: 0, 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 1.5 + 0.5
          }}
          animate={{
            opacity: [0, 1, 0],
            transition: {
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }
          }}
          style={{ fontSize: `${Math.random() * 10 + 5}px` }}
        >
          <FaStar />
        </Star>
      );
    }
    return stars;
  };

interface SpaceAnimationProps {
  onAnimationComplete: () => void;
}

const SpaceAnimation: React.FC<SpaceAnimationProps> = ({ onAnimationComplete }) => {
  // useMemo para evitar que las estrellas se regeneren en cada render
  const stars = useMemo(() => generateStars(50), []); 

  return (
    <SpaceAnimationContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      // onAnimationComplete no se usa aquí para controlar el tiempo con más precisión
    >
      {stars}
      <Rocket
        variants={rocketVariants}
        initial="initial"
        animate="animate"
        // Llamamos a la función de completar cuando la animación del cohete termina.
        onAnimationComplete={() => {
          setTimeout(onAnimationComplete, 1500); // Espera 1.5s extra para que la frase se lea
        }}
      >
        <FaRocket />
      </Rocket>
      <Phrase
        variants={phraseVariants}
        initial="hidden"
        animate="visible"
      >
        ¡Al infinito y más allá!
      </Phrase>
    </SpaceAnimationContainer>
  );
};

export default SpaceAnimation;