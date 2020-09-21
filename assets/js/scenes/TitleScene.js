class TitleScene extends Phaser.Scene {

  constructor() {
    super('Title');
  }

  create() {
    // create game title object
    this.titleText = this.add.text(
      this.scale.width/2,
      this.scale.height/2,
      'Phaser MMORPG',
      {fontSize: '64px', fill: '#fff'}
    );
    this.titleText.setOrigin(0.5);

    // create play game button
    this.startGameButton = new UiButton(this, this.scale.width/2, this.scale.height * 0.65, 'button1', 'button2', 'Start', this.startScene.bind(this, 'Game'));
  } // create

  startScene(targetScene) {
    this.scene.start(targetScene);
  }


} // TitleScene
