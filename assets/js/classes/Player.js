
class Player extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, y, key, frame){
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.velocity = 160;

    //enable physics
    this.scene.physics.world.enable(this);

    // set imnmovable if another object collides with our player
    this.setImmovable(false);

    // scale our player
    // we can pass in the x and y value for player scaling.
    // if only one value is passed scaling applies to both x and y values
    this.setScale(2);

    //collide with world bounds
    // phaser checks collision between the game object and the bounds of our camera
    this.setCollideWorldBounds(true);

    // add the player to our existing scene
    this.scene.add.existing(this);

  }

  update(cursors) {
    // sets the value for x and y as 0
    // can also take two arguments x value and y value
    this.body.setVelocity(0);

    // body refers to the player object
    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
    } else if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
    }
  } // update

} // Player
