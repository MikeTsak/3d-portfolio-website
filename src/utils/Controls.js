import nipplejs from 'nipplejs';

export const setupControls = (isMobileDevice, velocity, speed, turnSpeed) => {
  if (isMobileDevice) {
    const joystick = nipplejs.create({
      zone: document.getElementById('joystick-zone'),
      mode: 'dynamic',
      position: { left: '50%', bottom: '20%' },
      color: 'blue',
      size: 150,
    });

    joystick.on('move', (evt, data) => {
      if (data.vector.y !== 0) velocity.forward = -data.vector.y * speed;
      if (data.vector.x !== 0) velocity.turn = -data.vector.x * turnSpeed;
    });

    joystick.on('end', () => {
      velocity.forward = 0;
      velocity.turn = 0;
    });
  }

  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'w':
        velocity.forward = speed;
        break;
      case 's':
        velocity.forward = -speed;
        break;
      case 'a':
        velocity.turn = turnSpeed;
        break;
      case 'd':
        velocity.turn = -turnSpeed;
        break;
      default:
        break;
    }
  });

  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'w':
      case 's':
        velocity.forward = 0;
        break;
      case 'a':
      case 'd':
        velocity.turn = 0;
        break;
      default:
        break;
    }
  });
};
