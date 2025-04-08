import { motion } from "framer-motion";
import pillarImg from "/images/pipe-green.png";

function Pillar({ xPos, gap, height }) {
  const PIPE_WIDTH = 52;

  return (
    <>
      {/* Top Pillar */}
      <motion.img
        src={pillarImg}
        alt="Top Pillar"
        className="absolute"
        style={{
          top: 0,
          left: `${xPos}px`,
          height: `${height}px`,
          width: `${PIPE_WIDTH}px`,
          transform: "rotate(180deg)",
        }}
        animate={{ left: xPos }}
        transition={{ ease: "linear", duration: 0 }}
      />

      {/* Bottom Pillar */}
      <motion.img
        src={pillarImg}
        alt="Bottom Pillar"
        className="absolute"
        style={{
          top: `${height + gap}px`,
          left: `${xPos}px`,
          width: `${PIPE_WIDTH}px`,
          height: `calc(600px - ${height + gap}px)`,
        }}
        animate={{ left: xPos }}
        transition={{ ease: "linear", duration: 0 }}
      />
    </>
  );
}

export default Pillar;
