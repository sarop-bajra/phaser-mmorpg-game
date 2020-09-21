class BootScene extends Phaser.Scene {
  // any time we extend
  constructor() {
    super('Boot');
  }

  preload() {
    // this.load.image refers to the new game object
    // and calls on the image loader
    // syntax ('key to identify the image','image url')
    this.load.image('button1', 'assets/images/ui/blue_button01.png');

    this.load.image('button2', 'assets/images/ui/blue_button02.png');

    // spritesheet - series of images combined into one
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });

    // phaser can load audio assets, to support multiple browsers we place the
    // the audio assets in an array this way phaser can automatically use the
    // assets that are supported in the players browser.
    this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
  } // preload

  create() {
    // When done with a scene transition to new scene
    // it also stops the current scene and cleans up the logic in place
    this.scene.start('Title');
  }

} // BootScene
