import nipplejs from 'nipplejs';

let joystick = null; // Keep track of the joystick instance

export const setupControls = (isMobileDevice, velocity, speed, turnSpeed) => {
  // Remove any existing joystick if it exists
  if (joystick) {
    joystick.destroy();
    joystick = null; // Reset joystick reference
  }

  if (isMobileDevice) {
    // Create a new joystick instance if it’s a mobile device
    joystick = nipplejs.create({
      zone: document.getElementById('joystick-zone'),
      mode: 'dynamic',
      position: { left: '50%', bottom: '20%' },
      color: 'blue',
      size: 150,
    });

    joystick.on('move', (evt, data) => {
      // Invert the joystick controls: forward goes backward and backward goes forward
      if (data.vector.y !== 0) velocity.forward = data.vector.y * speed; // Inverted
      if (data.vector.x !== 0) velocity.turn = -data.vector.x * turnSpeed; // Normal turning
    });

    joystick.on('end', () => {
      velocity.forward = 0;
      velocity.turn = 0;
    });
  }

  // Set up keyboard controls for desktop (WASD and Arrow keys)
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'w': // Move forward with W
      case 'ArrowUp': // Move forward with Arrow Up
        velocity.forward = speed;
        break;
      case 's': // Move backward with S
      case 'ArrowDown': // Move backward with Arrow Down
        velocity.forward = -speed;
        break;
      case 'a': // Turn left with A
      case 'ArrowLeft': // Turn left with Arrow Left
        velocity.turn = turnSpeed;
        break;
      case 'd': // Turn right with D
      case 'ArrowRight': // Turn right with Arrow Right
        velocity.turn = -turnSpeed;
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'w':
      case 's':
      case 'ArrowUp':
      case 'ArrowDown':
        velocity.forward = 0; // Stop moving forward/backward
        break;
      case 'a':
      case 'd':
      case 'ArrowLeft':
      case 'ArrowRight':
        velocity.turn = 0; // Stop turning
        break;
      default:
        break;
    }
  };

  // Add keyboard listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Cleanup function for when controls are unmounted
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);

    // Destroy joystick if it exists
    if (joystick) {
      joystick.destroy();
      joystick = null;
    }
  };
};
