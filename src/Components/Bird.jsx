import React from "react";
import { motion } from "framer-motion";

const Bird = ({ birdPos, velocity }) => {
  const BIRD_HEIGHT = 28;
  const BIRD_WIDTH = 33;

  // Rotation based on velocity
  const rotation = Math.min(Math.max(velocity * 3, -30), 90);

  return (
    <motion.div
      className="absolute bg-[url('/images/yellowbird-upflap.png')] bg-cover"
      style={{
        width: `${BIRD_WIDTH}px`,
        height: `${BIRD_HEIGHT}px`,
        left: "100px",
      }}
      animate={{
        top: birdPos,
        rotate: rotation,
      }}
      transition={{ ease: "easeOut", duration: 0.1 }}
    />
  );
};

export default Bird;
