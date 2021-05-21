////////////////
// LOADING 
////////////////

class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    var progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
    var progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(progressBarFill);

    var loadingTextVar = this.add.text(250, 260, "Loading: ", { fontSize: '32px', fill: '#FFF' });

    this.preloadAssets();

    this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics, loadingText: loadingTextVar });
    this.load.on('complete', this.loadCompleted, this);
  }

  updateBar(percentage) {
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(205, 205, percentage * 390, 40));

    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
  }

  // when load completes
  loadCompleted() {
    // go to home page
    this.scene.start('HomePage');
  }

  ////////////////////////////////////////
  // Dump all the preloading here
  ////////////////////////////////////////
  preloadAssets() {
    this.load.image('HomePageBG', 'assets/HomePageBG.png');
    this.load.image('BG_B', 'assets/GameOverSplash.png');
    this.load.image('MoneyMeter', 'assets/MoneyMeter.png');
    this.load.image('HappyMeter', 'assets/HappyMeter.png');
    this.load.image('HighlightBox', 'assets/HighlightBox.png');

    this.load.image('AddHappy', 'assets/AddHappy.png');
    this.load.image('MinusHappy', 'assets/MinusHappy.png');

    this.load.image('EndGameBtn', 'assets/EndGameBtn.png');

    this.load.spritesheet('ChoiceBtn', 'assets/ChoiceBtn.png', { frameWidth: 100, frameHeight: 108 });
    this.load.spritesheet('CfmBtn', 'assets/ConfirmBtn.png', { frameWidth: 202, frameHeight: 89 });
    this.load.spritesheet('StartBtn', 'assets/StartBtn.png', { frameWidth: 202, frameHeight: 89 });

    this.load.xml('data', 'assets/Graph.xml');
    this.load.audio('ButtonClick_SFX', 'assets/ButtonClick.wav');
    this.load.audio('BGMusic', 'assets/BGMusic.mp3');
    this.load.audio('Lose_SFX', 'assets/Lose.mp3');
    this.load.audio('Win_SFX', 'assets/Win.mp3');

    this.loadVideoAsset('P0');

    this.loadVideoAsset('P1');
    this.loadVideoAsset('P1A');
    this.loadVideoAsset('P1B');
    this.loadVideoAsset('P1C');

    this.loadVideoAsset('P2');
    this.loadVideoAsset('P2A');
    this.loadVideoAsset('P2B');

    this.loadVideoAsset('P3');
    this.loadVideoAsset('P3A');
    this.loadVideoAsset('P3B');
    this.loadVideoAsset('P3C');    
    this.loadVideoAsset('P3D');

    this.loadVideoAsset('P4');
    this.loadVideoAsset('P4A');
    this.loadVideoAsset('P4B');
    this.loadVideoAsset('P4C');    

    this.loadVideoAsset('P5');
    this.loadVideoAsset('P5A');
    this.loadVideoAsset('P5B');
    this.loadVideoAsset('P5C');    

    // this.loadVideoAsset('P6');
    // this.loadVideoAsset('P6A');
    // this.loadVideoAsset('P6B');
    // this.loadVideoAsset('P6C');   
    
    // this.loadVideoAsset('P7');
    // this.loadVideoAsset('P7A');
    // this.loadVideoAsset('P7B');
    // this.loadVideoAsset('P7C');
        
    // this.loadVideoAsset('Summary');
  }

  ////////////////////////////////////////
  // Helper to load video
  ////////////////////////////////////////
  loadVideoAsset(targetName) {
    this.load.video(targetName, "assets/" + targetName + ".mp4");
  }

}
