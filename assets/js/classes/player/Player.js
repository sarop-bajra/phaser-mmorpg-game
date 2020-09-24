
class Player extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, y, key, frame){
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    //enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our player
    this.setImmovable(true);
    // scale our player
    // we can pass in the x and y value for player scaling.
    // if only one value is passed scaling applies to both x and y values
    this.setScale(2);
    // add the player to our existing scene
    this.scene.add.existing(this);
  } // constructor

} // Player
