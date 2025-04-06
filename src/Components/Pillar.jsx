import { motion } from "framer-motion";
import pillarImg from "/images/pipe-green.png";

function Pillar({ xPos, gap, height }) {
  return (
    <>
      {/* Top Pillar */}
      <motion.img
        src={pillarImg}
        alt="Top Pillar"
        className="absolute w-10 md:w-14"
        style={{
          top: 0,
          height: `${height}px`,
          transform: "rotate(180deg)", // Rotate the top pillar
        }}
        animate={{ left: xPos }}
        transition={{ ease: "linear", duration: 0 }}
      />
      {/* Bottom Pillar */}
      <motion.img
        src={pillarImg}
        alt="Bottom Pillar"
        className="absolute w-10 md:w-14"
        style={{
          top: `${height + gap}px`,
          bottom: 0,
        }}
        animate={{ left: xPos }}
        transition={{ ease: "linear", duration: 0 }}
      />
    </>
  );
}

export default Pillar;