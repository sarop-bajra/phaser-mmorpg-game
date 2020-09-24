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
  }
}
