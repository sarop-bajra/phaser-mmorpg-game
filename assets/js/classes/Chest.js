class Chest extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, y, key, frame, coins, id){
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.coins = coins; // the amount of coins this chest contains
    this.id = id; // chest id, used for pickup and notifying GameManager to delete it
    //enable physics
    // When you extend the Phaser.Physics.Arcade.Image Class
    // we need to enable Physics on the new Game Object by calling:
    this.scene.physics.world.enable(this);

    // adds chest to our existing scene
    // When you extend the Game Object Classes
    // we can add the new Game Object by calling:
    this.scene.add.existing(this);

  } // constructor

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  } // makeActive

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  } // makeInactive

} // Chest
