  console.log('main.js loaded');

    const config = {
    type: Phaser.AUTO, // automatically will use webgl
    width: 1000, // canvas width
    height: 800, // canvas height
    // phaser supports running multiple scenes in parallel
    // by default, a phaser scene is not active when you add that
    // scene to config object, it runs the first scene if not specified
    scene: [
      BootScene,
      TitleScene,
      GameScene,
      UiScene,
    ],
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: {
          y: 0,
        },
      },
    },
    // property in phaser notifying the system of the image type
    pixelArt: true,
    // property in phaser to render pixel cleanly by rounding pixel location
    roundPixels: true,

  }; // config

  const game = new Phaser.Game(config);
