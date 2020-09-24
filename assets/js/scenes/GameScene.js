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
    this.createMap();
    this.createAudio();
    this.createGroups();
    this.createInput();
    this.createGameManager();
  } // create

  update(){
    if(this.player) {
      this.player.update(this.cursors);
    }
  } // update

  createAudio() {
    // by default audio is played only once for multiple we can use loop
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.5 });
  } // createAudio

  createPlayer(location) {
    // player selection, through spritesheet
    this.player = new Player(this, location[0] * 2, location[1] * 2, 'characters', 4);
  } // createPlayer

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();

  } // createChests

  // Location of the spawned chest is stored as a global variable in the
  // Tiled JSON file to make updating easier and to avoid errors
  // spawnChest receives the chestObject
  // chestObject contains the location of the object
  spawnChest(chestObject) {
    // getFirstDead method gets the first inactive game object
    let chest = this.chests.getFirstDead();
    // if no inactive chest object then create one
    if (!chest) {
      const chest = new Chest(
        this,
        chestObject.x * 2,   // xpos is chestObject.x * 2
        chestObject.y * 2,   // ypos is chestObject.y * 2
        'items',             // select sprite 'items'
         0,  // from spritesheet first element '0'
         chestObject.gold, 
         chestObject.id
       );
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold; // pass the amount of gold
      chest.id = chestObject.id; // pass the chest id
      chest.setPosition(chestObject.x * 2, chestObject.y * 2);
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
    // check for collisions between player and the tiled blocked layer from the map class
    this.physics.add.collider(this.player, this.map.blockedLayer);
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
    // To listen for events, you will need to get a ref ie 'updateScore' to the scene that
    // is emitting the event, and then you can use: events.on()
    this.events.emit('updateScore', this.score);
    // make chest game object inactive
    chest.makeInactive();
    // emit pickUpChest event to setupEventListner in GameManager
    this.events.emit('pickUpChest', chest.id)
  } // collectChest

  createMap() {
    // createMap
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  } // createMap

  createGameManager() {
    // using the data that we got from the Tiled map
    this.events.on('spawnPlayer', (location) => {
      this.createPlayer(location);
      this.addCollisions();
    });
    // Received emitted event from GameManager,
    // once received, spawn chest object
    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    // map.map.objects parameter will include all of the object layers that was created in Tiled
    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();

  }

} // BootScene
