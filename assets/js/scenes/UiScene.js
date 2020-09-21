class UiScene extends Phaser.Scene {

  constructor() {
    super('Ui');
  } // constructor

  init() {
    // grab a reference to the game scene
    this.gameScene = this.scene.get('Game');
  }

  create() {
    this.setupUiElements();
    this.setupEvents();
  } // create

  setupUiElements() {
    // create the score text game object
    this.scoreText = this.add.text(
      35,
      8,
      'Coins: 0',
      { fontSize: '16px', fill: '#fff'}
    );
    this.coinIcon = this.add.image(15, 15, 'items', 3);
  } //setupUiElements

  setupEvents() {
    // listen for the updateScore event from the game scene
    // grab a ref to our gameScene and listen to the events that are
    // being fired on that scene and when the updateScore event is fired
    // then we will run this function that takes a parameter score
    // which we pass from the this.events.emit('updateScore', chest.coins); GameScene.js
    // then we update the scoreText that takes the the value score
    this.gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });
  } // setupEvents


} // BootScene
