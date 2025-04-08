import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Bird from "./Bird";
import Pillar from "./Pillar";

const GRAVITY = 0.8;
const JUMP_HEIGHT = -12;
const GAME_HEIGHT = 600;
const BIRD_HEIGHT = 28;
const BIRD_WIDTH = 33;
const PILLAR_WIDTH = 52;
const BIRD_LEFT = 100;
const FRAME_RATE = 16;

function getRandomHeight() {
  return Math.floor(Math.random() * 200) + 100;
}

function Game() {
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pillars, setPillars] = useState([
    { id: 1, xPos: 400, height: getRandomHeight(), isScored: false, pairId: 1 },
    { id: 2, xPos: 700, height: getRandomHeight(), isScored: false, pairId: 2 },
  ]);
  const [gap] = useState(160);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(new Audio("/audio/music.mp3"));
  const jumpSound = useRef(new Audio("/audio/jump.mp3"));
  const gameOverSound = useRef(new Audio("/audio/gameover.mp3"));

  useEffect(() => {
    audioRef.current.loop = true;
    [audioRef, jumpSound, gameOverSound].forEach((ref) => ref.current.load());
  }, []);

  // Ensure music plays after restart
  useEffect(() => {
    const playMusic = async () => {
      try {
        const audio = audioRef.current;
        if (!audio.paused) {
          return; // Avoid calling play() if the audio is already playing
        }
        audio.currentTime = 0; // Reset the audio to the beginning
        await audio.play();
      } catch (err) {
        console.warn("Music play failed on restart:", err);
      }
    };

    if (gameStarted && !gameOver && !isMuted) {
      playMusic();
    }
  }, [gameStarted, gameOver, isMuted]);

  // Bird movement and gravity
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setVelocity((v) => v + GRAVITY);
      setBirdPos((pos) => {
        const nextPos = pos + velocity;
        if (nextPos >= GAME_HEIGHT - BIRD_HEIGHT) {
          endGame();
          return GAME_HEIGHT - BIRD_HEIGHT;
        }
        return nextPos < 0 ? 0 : nextPos;
      });
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, [gameStarted, velocity, gameOver]);

  // Pillar movement, collision, and scoring
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setPillars((prev) => {
        const updated = prev.map((pillar) => {
          let newX = pillar.xPos - 5;
          let newIsScored = pillar.isScored;

          if (newX + PILLAR_WIDTH < 0) {
            return {
              ...pillar,
              xPos: 400,
              height: getRandomHeight(),
              isScored: false,
            };
          }

          const centerX = newX + PILLAR_WIDTH / 2;
          if (!pillar.isScored && centerX < BIRD_LEFT) {
            setScore((s) => s + 0.5);
            newIsScored = true;
          }

          const birdRight = BIRD_LEFT + BIRD_WIDTH;
          const pillarRight = newX + PILLAR_WIDTH;

          if (
            birdRight > newX &&
            BIRD_LEFT < pillarRight &&
            (birdPos < pillar.height || birdPos + BIRD_HEIGHT > pillar.height + gap)
          ) {
            endGame();
          }

          return {
            ...pillar,
            xPos: newX,
            isScored: newIsScored,
          };
        });

        return updated;
      });
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, [birdPos, gameStarted, gameOver]);

  const handleJump = () => {
    if (!gameStarted || gameOver) return;
    if (!isMuted) {
      jumpSound.current.currentTime = 0;
      jumpSound.current.play().catch(() => {});
    }
    setVelocity(JUMP_HEIGHT);
  };

  const startGame = () => {
    setGameStarted(true);
    if (!isMuted) {
      audioRef.current.currentTime = 0; // Reset the music to the beginning
      audioRef.current.play().catch((err) => {
        console.warn("Music playback failed:", err);
        alert("Please interact with the page to enable audio playback.");
      });
    }
  };

  const resetGame = () => {
    setBirdPos(GAME_HEIGHT / 2);
    setVelocity(0);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setPillars([
      { id: 1, xPos: 400, height: getRandomHeight(), isScored: false, pairId: 1 },
      { id: 2, xPos: 700, height: getRandomHeight(), isScored: false, pairId: 2 },
    ]);
    if (!audioRef.current.paused) {
      audioRef.current.pause(); // Pause only if the audio is playing
    }
    audioRef.current.currentTime = 0; // Reset the audio to the beginning
  };

  const endGame = () => {
    if (!isMuted) {
      gameOverSound.current.currentTime = 0;
      gameOverSound.current.play().catch(() => {});
    }
    if (!audioRef.current.paused) {
      audioRef.current.pause(); // Pause only if the audio is playing
    }
    setGameOver(true);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (newMuted) {
        audioRef.current.pause();
      } else if (gameStarted && !gameOver) {
        audioRef.current.play().catch(() => {});
      }
      return newMuted;
    });
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-blue-300 px-4"
      onClick={handleJump}
      onContextMenu={(e) => {
        e.preventDefault();
        handleJump();
      }}
    >
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-10">
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 sm:text-lg text-base"
          >
            Start Game
          </button>
          <p className="mt-4 text-white text-sm">Tap screen or right click to jump!</p>
        </div>
      )}

      <div
        className="relative w-full max-w-[400px] h-[80vh] max-h-[600px] overflow-hidden border-4 border-black bg-[url('/images/background-day.png')] bg-cover bg-center sm:w-[90%]"
        style={{ aspectRatio: "3 / 4" }}
      >
        <Bird birdPos={birdPos} velocity={velocity} />
        {pillars.map((pillar) => (
          <Pillar key={`${pillar.id}-${pillar.xPos}`} xPos={pillar.xPos} gap={gap} height={pillar.height} />
        ))}

        <div className="absolute top-2 left-2 text-white font-bold text-base sm:text-xl bg-black bg-opacity-40 px-2 rounded">
          Score: {score}
        </div>

        <button
          onClick={toggleMute}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60 transition"
        >
          {isMuted ? (
            <VolumeX className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Volume2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
            <h1 className="text-3xl font-bold text-red-600 sm:text-4xl">Game Over</h1>
            <p className="text-xl text-white mt-4">Score: {score}</p>
            <button
              onClick={resetGame}
              className="mt-6 px-6 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
