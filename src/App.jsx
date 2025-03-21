// filepath: c:\Users\user\Desktop\Flappy\flappy-bird\src\App.jsx
import './tailwind-output.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './Components/Navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;