import React, { useState } from 'react';
import './App.css';
import My3DScene from './components/My3DScene'; // Ensure the path is correct

function App() {
  const [startClicked, setStartClicked] = useState(false);
  const [mode, setMode] = useState(null); // null initially, either 'desktop' or 'mobile'

  // Handle "Start" button press
  const handleStartClick = (event) => {
    if (event.type === 'touchstart') {
      // If touch input is detected, switch to mobile mode
      setMode('mobile');
      console.log('Mobile Mode selected');
    } else {
      // Otherwise, it's desktop mode (mouse click)
      setMode('desktop');
      console.log('Desktop Mode selected');
    }
    setStartClicked(true); // Start the scene
  };

  return (
    <div className="App">
      {!startClicked ? (
        <button
          onMouseDown={handleStartClick} // Detect mouse click for desktop
          onTouchStart={handleStartClick} // Detect touch for mobile
          style={{
            padding: '20px',
            fontSize: '24px',
            cursor: 'pointer',
            marginTop: '20vh',
          }}
        >
          Start
        </button>
      ) : (
        // Pass the mode as a prop to My3DScene
        <My3DScene mode={mode} />
      )}
    </div>
  );
}

export default App;
