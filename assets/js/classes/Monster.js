class Monster extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, id, health, maxHealth) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.id = id;
    this.health = health;
    this.maxHealth = maxHealth;

    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our monster
    this.setImmovable(false);
    // scale our monster
    this.setScale(2);
    // collide with world bounds
    this.setCollideWorldBounds(true);
    // add the monster to our existing scene
    this.scene.add.existing(this);
    // update the origin for healthBar allignment
    this.setOrigin(0);

    this.createHealthBar();
  } // constructor

  createHealthBar(){
    this.healthBar = this.scene.add.graphics(); // Phaser built in graphics
    this.updateHealthBar();
  } // createHealthBar

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1); // colour that gets filled and opacity
    this.healthBar.fillRect(this.x, this.y - 8, 64, 5); // rectangle shape
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4); // colour1, colour 2 for gradient
    this.healthBar.fillRect(this.x, this.y - 8, 64 * (this.health / this.maxHealth), 5);
    // proportional to the monsters health
  } // updateHealthBar

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;

    this.updateHealthBar(); // update the health bar
  } // makeActive

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;

    this.healthBar.clear(); // clear the health bar graphics
  } // makeInactive

  update() {
    this.updateHealthBar();
  }

} // Monster
