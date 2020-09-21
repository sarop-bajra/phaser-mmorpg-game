class GameScene extends Phaser.Scene {

  constructor() {
    super('Game');
  } // constructor

  // init method is initialised before the create method
  init() {
    // launch instead of start, makes phaser open up scenes parallel to the existing scene
    this.scene.launch('Ui');
    this.score = 0;
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
    // create a chest group
    this.chests = this.physics.add.group();
    // create chest position array
    this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500],]
    // specify the max number of chest we can have
    this.maxNumberOfChests = 3;

    // spawn a chest
    for (let i = 0; i < this.maxNumberOfChests; i++) {
      this.spawnChest();
    }

  } // createChests

  spawnChest() {
    const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

    let chest = this.chests.getFirstDead();
    if (!chest) {
      // select sprite from spritesheet
      const chest = new Chest(this, location[0], location[1], 'items', 0);
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }

  }

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
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
  } // addCollisions

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    // update score
    this.score += chest.coins;
    // update the score in the ui
    // we can communicate betn scenes in Phaser using the Phaser Scene Events
    // To listen for events, you will need to get a ref to the scene that
    // is emitting the event, and then you can use: events.on()
    this.events.emit('updateScore', this.score);
    // make chest game object inactive
    chest.makeInactive();
    // spawn a new chest
    this.time.delayedCall(1000, this.spawnChest, [], this)
  } // collectChest

} // BootScene
