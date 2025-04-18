// filepath: c:\Users\user\Desktop\Flappy\flappy-bird\src\App.jsx
import './tailwind-output.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from './Components/Navbar';
import Game from './Components/Game'; // Fix: Import Game as a default export
import { Leaderboard } from './Components/Leaderboard';
import { About } from './Components/About';

function App() {
  return (
    <BrowserRouter basename="/Flappy--bird">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Game />} /> {/* Default route */}
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;