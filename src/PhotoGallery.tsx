import { useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const Section = styled.div`
  background-color: #000;
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const StarButton = styled(motion.button)<{ x: number; y: number }>`
  position: absolute;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  background: none;
  border: none;
  cursor: pointer;
  color: gold;
  font-size: 2rem;

  &:hover {
    transform: scale(1.3);
  }
`;

const PhotoModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PhotoModalContent = styled(motion.img)`
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
`;

const stars = Array.from({ length: 33 }, (_, i) => ({
  x: Math.random() * 90,
  y: Math.random() * 80,
  src: `/fotos/foto${i + 1}.jpeg`,
}));

export default function StarGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <Section>
      {stars.map((star, idx) => (
        <StarButton
          key={idx}
          x={star.x}
          y={star.y}
          onClick={() => setSelectedPhoto(star.src)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <FaStar />
        </StarButton>
      ))}

      {selectedPhoto && (
        <PhotoModalBackdrop onClick={() => setSelectedPhoto(null)}>
          <PhotoModalContent
            src={selectedPhoto}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        </PhotoModalBackdrop>
      )}
    </Section>
  );
}
