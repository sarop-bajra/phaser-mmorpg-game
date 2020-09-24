// Spawner class will be responsible for generating chests or monsters
// at specific intervals up to a specified limit
class Spawner {
  constructor(config, spawnLocations, addObject, deleteObject) {
    this.id = config.id; // unique id for each spawner which is tracked by spawners object in GameManager
    this.spawnInterval = config.spawnInterval;
    this.limit = config.limit;
    this.objectType = config.spawnerType; // can be either chests or monsters

    // stores locations that spawner can spawn objects to.
    // Uses chestLocations and monsterLocations objects
    this.spawnLocations = spawnLocations;

    this.addObject = addObject; // tracks number of objects the spawner has created
    this.deleteObject = deleteObject; //

    this.objectsCreated = [];

    this.start();
  } // constructor

  // Creates an interval for spawning objects using setInterval function
  start() {
    this.interval = setInterval(() => {
      if(this.objectsCreated.length < this.limit) {
        this.spawnObject();
      }
    }, this.spawnInterval); // runs at defined intervals.
  } // start

  spawnObject() {
    if(this.objectType === SpawnerType.CHEST) {
      this.spawnChest();
    } else if(this.objectType === SpawnerType.MONSTER) {
      this.spawnMonster();
    }
  } // spawnObject

  spawnChest() {
    const location = this.pickRandomLocation();
    const chest = new ChestModel(
      location[0], // xpos
      location[1], // ypos
      randomNumber(10, 20), // gold
      this.id // chest id
    );
    this.objectsCreated.push(chest);
    this.addObject(chest.id, chest);
  }

  spawnMonster() {
    const location = this.pickRandomLocation();
    const monster = new MonsterModel(
      location[0], // xpos
      location[1], // ypos
      randomNumber(10, 20), // gold
      this.id, // monster id
      randomNumber(0, 20), // sprite frame number
      randomNumber(3, 5),  // health
      1, // attack
      );
    this.objectsCreated.push(monster);
    this.addObject(monster.id, monster);
  }

  pickRandomLocation() {
    // set location to a randomly selected index value in the spawnLocations array
    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    // location needs to be checked whether it is being used by any other objects in the Spawner
    // call 'some' method on objectsCreated array which executes callback on the array
    // until it finds an invalid location, returning a true value else false, meaning location is valid
    const invalidLocation = this.objectsCreated.some((obj) => {
      if(obj.x === location[0] && obj.y === location[1]) {
        return true;
      } else {
        return false;
      }
    }); // invalidLocation
    // if randomly picked location is invalid,
    // recursively call pickRandomLocation method until you get a location
    // that is not currently in use.
    // if valid return location object
    if(invalidLocation){
      return this.pickRandomLocation();
    } else {
      return location;
    }
  } // pickRandomLocation()

  removeObject(id) {
    // filter method will return a new array without the object with removeObject(id)
    this.objectsCreated = this.objectsCreated.filter(obj => obj.id !== id);
    // then call the deleteObject method to notify GameManager ie."deleteChest" that object was removed
    this.deleteObject(id);
  }



} // Spawner
