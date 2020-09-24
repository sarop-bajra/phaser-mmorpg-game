// ChestModel class will store the x and y positions of the object,
// the amount of gold stored within it
class ChestModel {
  constructor(x, y, gold, spawnerId) {
    this.id = `${spawnerId}-${uuid.v4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.gold = gold;
  } // constructor
} // ChestModel
