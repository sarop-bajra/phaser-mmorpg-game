// GameManager class will parse the JSON file for our tiled map
// providing locations of possible player, chest and monster locations
class GameManager {
  // takes 2 params the scene that this GameManager belongs to
  // mapData array of layer
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.spawners = {}; // will keep track of existing spawners when generated
    this.chests = {}; // will keep track of existing chests when generated
    this.monsters = {}; // object for monsters
    this.players = {}; // stores player information

    // The other three location properties will be used when the spawners are stopped.
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
  } // constructor

  setup() {
    this.parseMapData(); // parses the layer data that was exported from Tiled
    this.setupEventListener(); // create event listeners
    this.setupSpawners(); // create spawners in the appropriate locations on the map
    this.spawnPlayer(); // spawn the player at a random player spawn points.
  } // setup

  parseMapData() { // method to loop through the mapData
    this.mapData.forEach((layer) => {

      // This will go through all of the possible player spawn points and
      // allow us to store all of them into the player_locations array.
      if (layer.name === 'player_locations') {
        layer.objects.forEach((obj) => {
          this.playerLocations.push( [obj.x + (obj.width / 2), obj.y - (obj.height / 2)] );
        });

      // the'chest_locations' data will be stored to an object rather than an array.
      // This is so that each key of the object can be mapped to a particular spawner ID,
      // allowing the code to know all of the possible spawn locations associated with it.
      } else if (layer.name === 'chest_locations') {
        layer.objects.forEach((obj) => {
          var spawner = getTiledProperty(obj, 'spawner');
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x + (obj.width / 2), obj.y - (obj.height / 2)]];
          }
        });

      } else if (layer.name === 'monster_locations') {
        layer.objects.forEach((obj) => {
          var spawner = getTiledProperty(obj, 'spawner');
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x + (obj.width / 2), obj.y - (obj.height / 2)]];
          }
        });
      }
    });
  } // parseMapData

  setupEventListener() {
    // received 'pickUpChest' event from GameScene
    this.scene.events.on('pickUpChest', (chestId, playerId) => {
      // update the spawner object that this chest can be removed
      if(this.chests[chestId]) { // check if chest exists
        // remove the chest object  by referencing the spawner object using the
        // spawner id of the object
        // {gold} is short for this.chests[chestId].gold
        const {gold} = this.chests[chestId];

        //  updating the players gold
        this.players[playerId].updateGold(gold);
        this.scene.events.emit('updateScore', this.players[playerId].gold);

        // removing the chest
        this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
        this.scene.events.emit('chestRemoved', chestId);
      }
    }); // pickUpChest
    // received 'destroyEnemy' event from GameScene
    this.scene.events.on('monsterAttacked', (monsterId, playerId) => {
      // update the spawner
      if(this.monsters[monsterId]) {
        // {gold} is short for this.monsters[monsterId].gold and attack
        const {gold, attack} = this.monsters[monsterId];
        // subtract health monster model
        this.monsters[monsterId].loseHealth();

        // check if monster health is 0 and if true removeObject
        if (this.monsters[monsterId].health <= 0) {
          //  updating the players gold
          this.players[playerId].updateGold(gold);
          this.scene.events.emit('updateScore', this.players[playerId].gold);

          // removing the monster
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
          this.scene.events.emit('monsterRemoved', monsterId);

          // add health gain to the player when monster is killed
          this.players[playerId].updateHealth(0.5);
          this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);
        } else {
          // update players health subtract attack amount from health
          this.players[playerId].updateHealth(-attack);
          this.scene.events.emit('updatePlayerHealth', playerId, this.players[playerId].health);
          // update the monsters health
          this.scene.events.emit('updateMonsterHealth', monsterId, this.monsters[monsterId].health);

          // check the player's health, if below 0 have the player respawn
          if (this.players[playerId].health <= 0) {
            // player looses half of the gold on death update the gold the player has
            this.players[playerId].updateGold(parseInt(-this.players[playerId].gold / 2), 10);
            this.scene.events.emit('updateScore', this.players[playerId].gold);

            // respawn the player
            this.players[playerId].respawn();
            this.scene.events.emit('respawnPlayer', this.players[playerId]);
          }
        }
      }
    }); // monsterAttacked
  } // setupEventListener

  setupSpawners() {
    // create chest spawners by looping through all our chest locations
    // Objects.keys method loops through all of the keys in an object.
    // and returns an array of all of the keys in the object.
    // then loop through that array using forEach
    Object.keys(this.chestLocations).forEach((key) => {
      const config = {
        spawnInterval: 3000,
        limit: 3,
        spawnerType: SpawnerType.CHEST,
        id: `chest-${key}`
      };
      const spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    // create monster spawners
    Object.keys(this.monsterLocations).forEach((key) => {
      const config = {
        spawnInterval: 2000,
        limit: 3,
        spawnerType: SpawnerType.MONSTER,
        id: `monster-${key}`
      };
      const spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this),
        this.moveMonsters.bind(this),
      );
      this.spawners[spawner.id] = spawner;
    });


  } // setupSpawners

  //
  spawnPlayer() {
    const player = new PlayerModel(this.playerLocations); // new instance of the PlayerModel
    this.players[player.id] = player;
    this.scene.events.emit('spawnPlayer', player);
  } // spawnPlayer

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    // this emits an event to the Game Scene along with the chest object when a new object is spawned
    this.scene.events.emit('chestSpawned', chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    // emit an event named monsterSpawned along with the monster object to GameScene, createGameManager
    this.scene.events.emit('monsterSpawned', monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
  }

  moveMonsters() {
    this.scene.events.emit('monsterMovement', this.monsters);
  }

} // GameModel
