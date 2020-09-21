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
    this.createPlayer();
    this.createChests();
    // this.createWalls();
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
    // to get random element from our array
    const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];
    // getFirstDead method gets the first inactive game object
    let chest = this.chests.getFirstDead();
    // if no inactive chest object then create one
    if (!chest) {
      // select sprite 'items' from spritesheet first element '0'
      // location[0] is x position
      // location[0] is y position
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

  createMap() {
    // create the tile map using make.tilemap method, providing
    // an object with a key name 'map' which was loaded earlier
    // in the loadTileMap function
    this.map = this.make.tilemap({key: 'map'})
    // add the tileset image to our map by using map.addTilesetImage methood
    // which takes 6 args: name of phaser layer, tileset image, frame width,
    // frame height, margin and spacing inside of image
    this.tiles = this.map.addTilesetImage('background', 'background', 32, 32, 1, 2);
    // create our background layer using
    // createStaticLayer method, which takes 4 arguments
    // name of layer, tiles that we loaded, x-pos, y-pos for starting point of layer
    this.backgroundLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
    this.backgroundLayer.setScale(2);
    // create blocked layer
    this.blockedLayer = this.map.createStaticLayer('blocked', this.tiles, 0, 0);
    this.blockedLayer.setScale(2);

    // update the world bounds from canvas size to full map
    this.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.physics.world.bounds.height = this.map.heightInPixels * 2;

    // limit the camera to the size of our map
    // removes inifinite space or the black area
    // args xpos, ypos, width map, height map
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);



  } // createMap

} // BootScene
