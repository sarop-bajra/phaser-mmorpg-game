  console.log('main.js loaded');

    const config = {
    type: Phaser.AUTO, // automatically will use webgl
    width: 800, // canvas width
    height: 600, // canvas height
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
  }; // config

  const game = new Phaser.Game(config);
