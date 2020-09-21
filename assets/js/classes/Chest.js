class Chest extends Phaser.Physics.Arcade.Image {

  constructor(scene, x, y, key, frame){
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this game object will be added to
    this.coins = 10; // the amount of coins this chest contains

    //enable physics
    // When you extend the Phaser.Physics.Arcade.Image Class
    // we need to enable Physics on the new Game Object by calling:
    this.scene.physics.world.enable(this);

    // adds chest to our existing scene
    // When you extend the Game Object Classes
    // we can add the new Game Object by calling:
    this.scene.add.existing(this);

  } // constructor
} // Chest
