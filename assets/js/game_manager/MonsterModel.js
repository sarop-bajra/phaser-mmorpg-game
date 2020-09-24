class MonsterModel {
  constructor(x, y, gold, spawnerId, frame, health, attack) {
    this.id = `${spawnerId}-${uuid.v4()}`; // unique ID for the monster
    this.spawnerId = spawnerId;
    this.x = x * 2; // xpos
    this.y = y * 2; // ypos
    this.gold = gold; // gold reward when they defeat the monster
    this.frame = frame; // random monster sprite generated using sprite sheet
    this.health = health; // used to decide death
    this.maxHealth = health;
    this.attack = attack; // attack value
  } // constructor

  loseHealth() {
    this.health -= 1;
  } // loseHealth

  // allow the monster to move to one of the eight squares around it
  move() {
    const randomPosition = randomNumber(1, 8);
    const distance = 64;

    switch (randomPosition) {
      case 1:
        this.x += distance;
        break;
      case 2:
        this.x -= distance;
        break;
      case 3:
        this.y += distance;
        break;
      case 4:
        this.y -= distance;
        break;
      case 5:
        this.x += distance;
        this.y += distance;
        break;
      case 6:
        this.x += distance;
        this.y -= distance;
        break;
      case 7:
        this.x -= distance;
        this.y += distance;
        break;
      case 8:
        this.x -= distance;
        this.y -= distance;
        break;
      default:
        break;
    }
}

} // MonsterModel
