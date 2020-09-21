class GameScene extends Phaser.Scene {

  constructor() {
    super('Game');
  }

  create() {

    // select sprite from spritesheet
    this.chest = new Chest(this, 300, 300, 'items', 0);

    // phaser comes with arcade physics which allows us to move sprites by setting velocity
    this.wall = this.physics.add.image(500, 100, 'button1');

    // when player collides the wall does not move due to the velocity that will be applied by the player object
    this.wall.setImmovable();

    // player selection, through spritesheet
    this.player = new Player(this, 32, 32, 'characters', 4);

    this.physics.add.collider(this.player, this.wall);

    const overlap = function (player, chest){
      goldPickupAudio.play();
      chest.destroy(); // when the player overlaps the shest the shest is destroyed i.e. picked up
    }

    this.physics.add.overlap(this.player, this.chest, overlap);

    // logic to allow our player to move around, by listening to keyboard press
    // cursors listens to the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // by default audio is played only once for multiple we can use loop
    const goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.5 });

  } // create

  update(){
    this.player.update(this.cursors);
  } // update

} // BootScene
