class GameScene extends Phaser.Scene {

  constructor() {
    super('Game');
  } // constructor

  // init method is initialised before the create method
  init() {
    // launch instead of start, makes phaser open up scenes parallel to the existing scene
    this.scene.launch('Ui');
  }

  create() {
    this.createAudio();
    this.createPlayer();
    this.createChests();
    this.createWalls();
    this.createInput();
    this.addCollisions();
  } // create

  update(){
    this.player.update(this.cursors);
  } // update

  createAudio() {
    // by default audio is played only once for multiple we can use loop
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.5 });
  } // createAudio

  createPlayer() {
    // player selection, through spritesheet
    this.player = new Player(this, 32, 32, 'characters', 4);
  } // createPlayer

  createChests() {
    // select sprite from spritesheet
    this.chest = new Chest(this, 300, 300, 'items', 0);
  } // createChests

  createWalls() {
    // phaser comes with arcade physics which allows us to move sprites by setting velocity
    this.wall = this.physics.add.image(500, 100, 'button1');

    // when player collides the wall does not move due to the velocity that will be applied by the player object
    this.wall.setImmovable();
  } // createWalls

  createInput() {
    // logic to allow our player to move around, by listening to keyboard press
    // cursors listens to the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();
  } // createInput

  addCollisions() {
    this.physics.add.collider(this.player, this.wall);
    // passing this as scope to the method
    this.physics.add.overlap(this.player, this.chest, this.collectChest, null, this);
  } // addCollisions

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    // when the player overlaps the chest destroy the obj i.e. picked up
    chest.destroy();
    // update the score in the ui
    // we can communicate betn scenes in Phaser using the Phaser Scene Events
    // To listen for events, you will need to get a ref to the scene that
    // is emitting the event, and then you can use: events.on()
    this.events.emit('updateScore', chest.coins);
  } // collectChest

} // BootScene
