// filepath: c:\Users\user\Desktop\Flappy\flappy-bird\src\App.jsx
import './tailwind-output.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import Game from './Components/Game'; // Correct import for default export
import { Leaderboard } from './Components/Leaderboard';
import { About } from './Components/About';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;