class PlayerModel {
  constructor(spawnLocations){
    this.health = 5;
    this.maxHealth = 5;
    this.gold = 0;
    this.id = `player-${uuid.v4()}`; // UUID library is used to generate the id of the player
    this.spawnLocations = spawnLocations;
    // get random player location from the playerLocations array
    const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
    [this.x, this.y] = location; // shorthand to pull multiple values out of an array and set them to a variable, ie destructuring assignment
  } // constructor

  updateGold(gold) {
    this.gold += gold;
  }

  updateHealth(health) {
    this.health += health;
    // prevents player's health going over max health
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  respawn() {
      this.health = this.maxHealth;
      const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
      this.x = location[0] * 2;
      this.y = location[1] * 2;
   } // respawn
} // PlayerModel
