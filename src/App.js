import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetching message from the Go backend
    axios.get('http://localhost:8080/api')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the API!', error);
      });

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('sky', 'blue.jpg'); 
      this.load.image('ground', 'brown.jpg');
      this.load.image('star', 'yellow.jpg');
      this.load.image('bomb', 'bomb.jpg');
      this.load.spritesheet('dude', 'smile.jpg', { frameWidth: 32, frameHeight: 48 });
    }

    function create() {
      // Adding sky background
      this.add.image(400, 300, 'sky');

      // Adding platforms
      const platforms = this.physics.add.staticGroup();
      platforms.create(0, 600, 'ground').setScale(2).refreshBody();
      platforms.create(600, 400, 'ground');
      platforms.create(50, 250, 'ground');
      platforms.create(750, 220, 'ground');

      // Adding player
      const player = this.physics.add.sprite(100, 450, 'dude');
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      // Adding animations
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      this.physics.add.collider(player, platforms);

      // Adding controls for left and right movement
      this.input.keyboard.on('keydown-A', () => {
        player.setVelocityX(-160);
        player.anims.play('left', true);
      });

      this.input.keyboard.on('keyup-A', () => {
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('D'))) {
          player.setVelocityX(160);
          player.anims.play('right', true);
        } else {
          player.setVelocityX(0);
          player.anims.play('turn');
        }
      });

      this.input.keyboard.on('keydown-D', () => {
        player.setVelocityX(160);
        player.anims.play('right', true);
      });

      this.input.keyboard.on('keyup-D', () => {
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('A'))) {
          player.setVelocityX(-160);
          player.anims.play('left', true);
        } else {
          player.setVelocityX(0);
          player.anims.play('turn');
        }
      });

      // Adding control for jumping with the W key
      this.input.keyboard.on('keydown-W', () => {
        if (player.body.touching.down) {
          player.setVelocityY(-330); // Corrected the jump velocity to be negative
        }
      });

      // Adding control for jumping with the spacebar key
      this.input.keyboard.on('keydown-SPACE', () => {
        if (player.body.touching.down) {
          player.setVelocityY(-330); // Corrected the jump velocity to be negative
        }
      });
    }

    function update() {}

    // Cleanup
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div>
      <div id="phaser-game"></div>
      <p>{message}</p>
    </div>
  );
};

export default App;
