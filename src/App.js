import React, { useState } from 'react';
import './App.css'; // Import the CSS file for global styles
import My3DScene from './components/My3DScene';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

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
        <>
          {/* Guitar Pick Background as inline style */}
          <div
            className="guitar-pick-background"
            style={{
              position: 'absolute',
              zIndex: 1,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundImage: `url(${process.env.PUBLIC_URL + '/pick.svg'})`, // Correctly reference the SVG from public folder
              backgroundRepeat: 'no-repeat',
              backgroundSize: '50vw 50vw',
              opacity: 0.1,
              width: '50vw',
              height: '50vw',
            }}
          ></div>

          <header className="header">
            <h1>Michail Tsakiroglou</h1>
            <h2>Software Engineer</h2>
          </header>

          <div className="button-wrapper">
            <button
              onMouseDown={handleStartClick}
              onTouchStart={handleStartClick}
              className="start-button"
            >
              Start
            </button>

            <button className="legacy-button">
              Legacy Website
            </button>
          </div>

          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <a href="tel:+302104441096"> +30 210 444 1096</a>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <a href="mailto:hello@miketsak.gr"> hello@miketsak.gr</a>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <a href="https://maps.app.goo.gl/RR8Xcih5PhQeQcAv9" target="_blank" rel="noopener noreferrer">
                Athens, Greece
              </a>
            </div>
            <div className="social-links">
              <a href="https://github.com/MikeTsak" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/michail-tsakiroglou/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
              </a>
              <a href="https://agileadvisors.gr/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faBriefcase} /> Agile Advisors
              </a>
            </div>
          </div>
        </>
      ) : (
        // Only load the 3D scene when the Start button is clicked
        <My3DScene mode={mode} />
      )}
    </div>
  );
}

export default App;
