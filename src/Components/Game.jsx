import { useEffect, useState } from "react";
import Bird from "./Bird";
import Pillar from "./Pillar";

function getRandomHeight() {
  return Math.floor(Math.random() * 200) + 100;
}

function Game() {
  const [pillars, setPillars] = useState([
    { id: 1, xPos: 400, height: getRandomHeight() },
    { id: 2, xPos: 700, height: getRandomHeight() },
  ]);
  const [gap, setGap] = useState(200);
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started

  useEffect(() => {
    let interval;
    if (gameStarted) {
      const audio = new Audio("/audio/music.mp3"); // Path to your audio file
      audio.loop = true;
      audio.play();

      interval = setInterval(() => {
        setPillars((prevPillars) =>
          prevPillars.map((pillar) => {
            const newXPos = pillar.xPos - 5; // Move pillar left by 5px
            return {
              ...pillar,
              xPos: newXPos > -50 ? newXPos : 400, // Reset position if off-screen
              height: newXPos > -50 ? pillar.height : getRandomHeight(), // Randomize height when resetting
            };
          })
        );
      }, 30); // Update every 30ms

      return () => {
        clearInterval(interval);
        audio.pause();
      };
    }
    return () => clearInterval(interval);
  }, [gameStarted]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-300">
      {!gameStarted && (
        <button
          onClick={() => setGameStarted(true)}
          className="mb-4 px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        >
          Start Game
        </button>
      )}
      <div className="relative w-[90%] max-w-[400px] h-[80%] max-h-[600px] overflow-hidden border-4 border-black bg-[url('/images/background-day.png')] bg-cover bg-center">
        {pillars.map((pillar) => (
          <Pillar
            key={pillar.id}
            xPos={pillar.xPos}
            gap={gap}
            height={pillar.height}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;