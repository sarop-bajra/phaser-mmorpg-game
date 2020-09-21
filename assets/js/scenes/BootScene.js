class BootScene extends Phaser.Scene {
  // any time we extend
  constructor() {
    super('Boot');
  } // constructor

  preload() {
    // load images
    this.loadImages();
    // load spritesheets
    this.loadSpriteSheets();
    // load audio
    this.loadAudio();
    // load tilemap
    this.loadTileMap();
  } // preload

  loadImages() {
    // this.load.image refers to the new game object
    // and calls on the image loader
    // syntax ('key to identify the image','image url')
    this.load.image('button1', 'assets/images/ui/blue_button01.png');
    this.load.image('button2', 'assets/images/ui/blue_button02.png');
    // load the map tileset image
    this.load.image('background', 'assets/level/background-extruded.png');
  } // loadImages

  loadSpriteSheets() {
    // load spritesheets - series of images combined into one
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'assets/images/characters.png', { frameWidth: 32, frameHeight: 32 });
  } //loadSpriteSheets

  loadAudio() {
    // phaser can load audio assets, to support multiple browsers we place the
    // the audio assets in an array this way phaser can automatically use the
    // assets that are supported in the players browser.
    this.load.audio('goldSound', ['assets/audio/Pickup.wav']);
  } // loadAudio

  loadTileMap() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'assets/level/large_level.json');
  } // loadTileMap

  create() {
    // When done with a scene transition to new scene
    // it also stops the current scene and cleans up the logic in place
    this.scene.start('Game');
  } // create

} // BootScene
