import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import Bird from "./Bird";
import Pillar from "./Pillar";
import { Howl, Howler } from "howler";

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

// Declare Howler sounds
let backgroundMusic;
let jumpSfx;
let gameOverSfx;

function initializeSounds() {
  backgroundMusic = new Howl({
    src: ["/Flappy--bird/audio/music.mp3"],
    loop: true,
    volume: 0.3,
  });

  jumpSfx = new Howl({
    src: ["/Flappy--bird/audio/jump.mp3"],
    volume: 0.5,
  });

  gameOverSfx = new Howl({
    src: ["/Flappy--bird/audio/gameover.mp3"],
    volume: 0.6,
  });
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

  // Bird physics
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

  // Pillars and collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setPillars((prev) =>
        prev.map((pillar) => {
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
        })
      );
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, [birdPos, gameStarted, gameOver]);

  const handleJump = () => {
    if (!gameStarted || gameOver) return;

    // Resume audio context if suspended
    if (Howler.ctx?.state === "suspended") {
      Howler.ctx.resume().then(() => {
        console.log("Audio context resumed on jump");
      });
    }

    if (!isMuted) {
      jumpSfx.play();
    }
    setVelocity(JUMP_HEIGHT);
  };

  const startGame = () => {
    initializeSounds(); // Initialize sounds after user interaction

    setGameStarted(true);

    // Resume audio context if suspended
    if (Howler.ctx?.state === "suspended") {
      Howler.ctx.resume().then(() => {
        console.log("Audio context resumed");
      });
    }

    if (!isMuted && !backgroundMusic.playing()) {
      backgroundMusic.stop(); // Ensure it's fresh
      backgroundMusic.play();
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
    backgroundMusic.stop();
  };

  const endGame = () => {
    if (!isMuted) gameOverSfx.play();
    backgroundMusic.stop();
    setGameOver(true);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Howler.mute(newMuted);
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
      {/* Mute Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="absolute top-2 right-2 p-2 bg-black bg-opacity-40 rounded-full hover:bg-opacity-60 transition"
      >
        {isMuted ? <VolumeX className="text-white w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {/* Start Game Overlay */}
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

      {/* Game Container */}
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
