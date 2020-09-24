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
    this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.01 });
    this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 });
    this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 });
    this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 });
  } // createAudio

  createPlayer(playerObject) {
    // player selection, through spritesheet
    this.player = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      'characters',
      15,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id,
      this.playerAttackAudio,
    );
  } // createPlayer

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create a monster group
    this.monsters = this.physics.add.group();
    // phaser groups have property called runChildUpdate
    // which runs update methods that are defined in that class automatically
    this.monsters.runChildUpdate = true;

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
      chest = new Chest(
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

  spawnMonster(monsterObject) {
    let monster = this.monsters.getFirstDead();
    if (!monster) {
      monster = new Monster(
        this,
        monsterObject.x,
        monsterObject.y,
        'monsters', // sprite
        monsterObject.frame,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth,
      );
      // add monster to monsters group
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture('monsters', monsterObject.frame);
      monster.setPosition(monsterObject.x, monsterObject.y);
      monster.makeActive();
    }
  } // spawnMonster

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
    // check for collisions between monster group and the tiled blocked layer from the map class
    this.physics.add.collider(this.monsters, this.map.blockedLayer);
    // check for overlaps between the player's weapon and monster game objects
    this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, null, this);
  } // addCollisions

  enemyOverlap(weapon, enemy) {
    // Check if player is attacking and whether a swordHit has occcured
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true

      this.events.emit('monsterAttacked', enemy.id, this.player.id);
    }
  } // enemyOverlap

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();

    // we can communicate betn scenes in Phaser using the Phaser Scene Events
    // To listen for events, you will need to get a ref ie 'pickUpChest' to the scene that
    // is emitting the event, and then you can use: events.on()

    // emit pickUpChest event to setupEventListner in GameManager
    this.events.emit('pickUpChest', chest.id, player.id)
  } // collectChest

  createMap() {
    // createMap
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  } // createMap

  createGameManager() {
    // using the data that we got from the Tiled map
    this.events.on('spawnPlayer', (playerObject) => {
      this.createPlayer(playerObject);
      this.addCollisions();
    });
    // Received emitted event from GameManager,
    // once received, spawn chest object
    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    // listen to the event to spawn a monster
    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on('chestRemoved', (chestId) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
    }); // chestRemoved

    // make monster inactive on event monsterRemoved
    this.events.on('monsterRemoved', (monsterId) => {
      // getChildren method called on the monsters group will
      // return an array of child game objects.
      this.monsters.getChildren().forEach((monster) => {
      if (monster.id === monsterId) {
        monster.makeInactive();
        this.monsterDeathAudio.play();
      }
      });
    }); // monsterRemoved

    this.events.on('updateMonsterHealth', (monsterId, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      });
    });

    this.events.on('monsterMovement', (monsters) => {
      // to get the children of the monsters game object
      // loop through all of the monsterId keys
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterId) => {
          // if id matches move that monster
          if(monster.id === monsterId){
            this.physics.moveToObject(monster, monsters[monsterId], 40); // velocity
          }
        });
      });
    });

    this.events.on('updatePlayerHealth', (playerId, health) => {
      //  audio plays when the player's health is decreasing
      if (health < this.player.health) {
      this.playerDamageAudio.play();
      }
      this.player.updateHealth(health);
    });

    this.events.on('respawnPlayer', (playerObject) => {
      this.playerDeathAudio.play();
      this.player.respawn(playerObject);
    });

    // map.map.objects parameter will include all of the object layers that was created in Tiled
    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();

  } // createGameManager

} // BootScene
