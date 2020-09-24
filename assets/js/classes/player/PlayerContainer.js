class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, frame, health, maxHealth, id, attackAudio){
    super(scene, x, y);
    this.scene = scene; // the scene this game object will be added to
    this.velocity = 160; // the velocity when moving our player
    this.currentDirection = Direction.RIGHT; // Default direction
    this.playerAttacking = false;
    this.flipX = true; // when true the player sprite will be flipped in the direction of motion
    this.swordHit = false;

    // update the new properties
    this.health = health;
    this.maxHealth = maxHealth;
    this.id = id;
    this.attackAudio = attackAudio; // audio for atacking


    // set a size on the container
    this.setSize(64, 64);
    //enable physics
    this.scene.physics.world.enable(this);
    //collide with world bounds
    // phaser checks collision between the game object and the bounds of our camera
    this.body.setCollideWorldBounds(true);
    // add the player to our existing scene
    this.scene.add.existing(this);
    // have the camera follow the player
    // 'this' here is the player game obj which is needed by startFollow
    this.scene.cameras.main.startFollow(this);
    // create the player
    this.player = new Player(this.scene, 0, 0, key, frame);
    this.add(this.player);

    // create the weapon game object
    this.weapon = this.scene.add.image(40, 0, 'items', 4); // xpos, ypos, asset, frame
    this.scene.add.existing(this.weapon); // add weapon to scene
    this.weapon.setScale(1.5); // scale up by 1.5
    this.scene.physics.world.enable(this.weapon); // enable physics
    this.add(this.weapon); // add weapon to container
    this.weapon.alpha = 0; // set to 0 so that weapon is not displayed when not attacking
    // create the player healthbar
    // this.createHealthBar();

    // create the player healthbar
    this.createHealthBar();
  } // constructor

  createHealthBar(){
    this.healthBar = this.scene.add.graphics(); // Phaser built in graphics
    this.updateHealthBar();
  } // createHealthBar

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1); // colour that gets filled and opacity
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5); // position of healthbar rectangle shape
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4); // colour1, colour 2 for gradient
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64 * (this.health / this.maxHealth), 5);
    // proportional to the monsters health
  } // updateHealthBar

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  respawn(playerObject) {
    this.health = playerObject.health;
    this.setPosition(playerObject.x, playerObject.y);
    this.updateHealthBar();
   }


  update(cursors) {
    // sets the value for x and y as 0
    // can also take two arguments x value and y value
    this.body.setVelocity(0);

    // body refers to the player object
    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
      this.currentDirection = Direction.LEFT;
      this.weapon.setPosition(-40, 0);
      this.player.flipX = false;
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
      this.currentDirection = Direction.RIGHT;
      this.weapon.setPosition(40, 0);
      this.player.flipX = true;
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
      this.currentDirection = Direction.UP;
      this.weapon.setPosition(0, -40);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
      this.currentDirection = Direction.DOWN;
      this.weapon.setPosition(0, 40);
    }

    // allow the player to attack
    // Phaser.Input.Keyboard.JustDown detects if key was pressed down one time
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.playerAttacking) {
      this.weapon.alpha = 1; // make weapon visible
      this.playerAttacking = true;
      this.attackAudio.play();

      // time.delayedCall runs a callback function after a set time has passed
      // this resets the weapon
      this.scene.time.delayedCall(150, () => {
        this.weapon.alpha = 0;
        this.playerAttacking = false;
        this.swordHit = false;
      }, [], this);
    }


    if (this.playerAttacking) {
      // animating the weapon
      if (this.weapon.flipX) {
        this.weapon.angle -= 10; // rotate counter-clockwise
      } else {
        this.weapon.angle += 10; // rotate clockwise
      }
    } else {
      if (this.currentDirection === Direction.DOWN) {
        this.weapon.setAngle(-270); // setAngle takes rotation degree
      } else if (this.currentDirection === Direction.UP) {
        this.weapon.setAngle(-90);
      } else {
        this.weapon.setAngle(0);
      }
      // flip the weapon when player is facing left
      this.weapon.flipX = false;
      if (this.currentDirection === Direction.LEFT) {
        this.weapon.flipX = true;
      }
    }

    this.updateHealthBar();

  } // update

} // PlayerContainer
