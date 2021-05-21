
// global score
var g_MoneyScore = 30;
var g_HappyScore = 3;
var statBoard;
var currScenarioID = 0;
var scenariosTable = [];

// clear at every scenarios and caches the choices 
var selectedChoices = [];

// ////////////////
// // LOADING 
// ////////////////
// class LoadingScene extends Phaser.Scene {
//   constructor() {
//     super("LoadingScene");
//   }

//   preload() {
//     var progressBar = this.add.graphics();
//     var progressBox = this.add.graphics();
//     progressBox.fillStyle(0x222222, 0.8);
//     progressBox.fillRect(240, 270, 320, 50);

//     this.load.on('progress', function (value) {
//       console.log(value);
//       progressBar.clear();
//       progressBar.fillStyle(0xffffff, 1);
//       progressBar.fillRect(250, 280, 300 * value, 30);
//     });

//     this.load.on('fileprogress', function (file) {
//       console.log(file.src);
//     });

//     this.load.on('complete', this.loadCompleted);
//   }

//   // when load completes
//   loadCompleted() {
//     console.log('complete');

//     this.children.removeAll();

//     // go to home page
//     this.scene.start('HomePage');
//   }

//   create() {
//     this.loadingText = this.add.text(20, 20, "Loading Game,...");
//     statBoard = this.add.text(10, 10, '', { font: '48px Arial', fill: '#FF0000' });
//   }
// }

/////////////////
// HOME PAGE
/////////////////
class HomePage extends Phaser.Scene {
  constructor() {
    super('HomePage')

    this.HelperRef = new Helper();
  }

  
  ////////////////////////////////////////
  // Helper to load video
  ////////////////////////////////////////
  loadVideoAsset(targetName) {
    this.load.video(targetName, "assets/" + targetName + ".mp4");
  }

  preload() {
    // this.load.image('HomePageBG', 'assets/HomePageBG.png');
    // this.load.image('BG_B', 'assets/GameOverSplash.png');
    // this.load.image('MoneyMeter', 'assets/MoneyMeter.png');
    // this.load.image('HappyMeter', 'assets/HappyMeter.png');
    // this.load.image('HighlightBox', 'assets/HighlightBox.png');

    // this.load.image('AddHappy', 'assets/AddHappy.png');
    // this.load.image('MinusHappy', 'assets/MinusHappy.png');

    // this.load.image('EndGameBtn', 'assets/EndGameBtn.png');

    // this.load.spritesheet('ChoiceBtn', 'assets/ChoiceBtn.png', { frameWidth: 100, frameHeight: 108 });
    // this.load.spritesheet('CfmBtn', 'assets/ConfirmBtn.png', { frameWidth: 202, frameHeight: 89 });
    // this.load.spritesheet('StartBtn', 'assets/StartBtn.png', { frameWidth: 202, frameHeight: 89 });

    // this.load.xml('data', 'assets/Graph.xml');
    // this.load.audio('ButtonClick_SFX', 'assets/ButtonClick.wav');
    // this.load.audio('BGMusic', 'assets/BGMusic.mp3');
    // this.load.audio('Lose_SFX', 'assets/Lose.mp3');
    // this.load.audio('Win_SFX', 'assets/Win.mp3');

    // this.loadVideoAsset('P0');

    // this.loadVideoAsset('P1');
    // this.loadVideoAsset('P1A');
    // this.loadVideoAsset('P1B');
    // this.loadVideoAsset('P1C');

    // this.loadVideoAsset('P2');
    // this.loadVideoAsset('P2A');
    // this.loadVideoAsset('P2B');

    // this.loadVideoAsset('P3');
    // this.loadVideoAsset('P3A');
    // this.loadVideoAsset('P3B');
    // this.loadVideoAsset('P3C');    
    // this.loadVideoAsset('P3D');

    // this.loadVideoAsset('P4');
    // this.loadVideoAsset('P4A');
    // this.loadVideoAsset('P4B');
    // this.loadVideoAsset('P4C');    

    // this.loadVideoAsset('P5');
    // this.loadVideoAsset('P5A');
    // this.loadVideoAsset('P5B');
    // this.loadVideoAsset('P5C');    

    this.loadVideoAsset('P6');
    this.loadVideoAsset('P6A');
    this.loadVideoAsset('P6B');
    this.loadVideoAsset('P6C');   
    
    this.loadVideoAsset('P7');
    this.loadVideoAsset('P7A');
    this.loadVideoAsset('P7B');
    this.loadVideoAsset('P7C');
        
    this.loadVideoAsset('Summary');
  }

  ////////////////////////////////////////
  // main create function
  ////////////////////////////////////////
  create() {

    this.ButtonClick_SFX = this.sound.add('ButtonClick_SFX');
    this.Lose_SFX = this.sound.add('Lose_SFX');
    this.Win_SFX = this.sound.add('Win_SFX');

    this.BGMusic = this.sound.add('BGMusic');
    this.BGMusic.setLoop(true);
    this.BGMusic.play();

    this.cfmBtn = this.createBtn(0.89, 0.9, 1.34, "CfmBtn", this.OnCfmBtnPressed);
    this.cfmBtn.setVisible(false);

    this.EndGameBtn = this.add.image(0, 0, 'EndGameBtn');
    this.EndGameBtn.setVisible(false);
    this.setScreenPos(this.EndGameBtn, 0.885, 0.9);
    this.EndGameBtn.setScale(1.345);

    this.currScenarioID = 0;

    this.initialSplashBG = this.add.image(0, 0, 'HomePageBG');
    this.setScreenPos(this.initialSplashBG, .5, .5);

    this.startGameBtn = this.createBtn(0.89, 0.9, 1.34, "StartBtn", this.OnStartGameBtnPressed);

    // create money meter
    this.MoneyMeter = this.add.image(0, 0, "MoneyMeter");
    this.setScreenPos(this.MoneyMeter, .6, .05);

    // create happy meter
    this.HappyMeter = this.add.image(0, 0, "HappyMeter");
    this.setScreenPos(this.HappyMeter, .4, .05);

    this.AddHappy = this.add.image(0, 0, "AddHappy");
    this.MinusHappy = this.add.image(0, 0, "MinusHappy");

    this.AddHappy.setVisible(false);
    this.MinusHappy.setVisible(false);

    // parse scenarios from XML
    this.HelperRef.ParseScenarios(this, this.cache.xml);

    // Create text last
    this.MoneyScoreText = this.add.text(0, 0, g_MoneyScore, { font: 'bold 30px Arial' });
    this.setScreenPos(this.MoneyScoreText, .59, .029);
    this.MoneyScoreText.setOrigin(0, 0);

    this.HappyScoreText = this.add.text(0, 0, g_HappyScore, { font: 'bold 38px Arial' });
    this.setScreenPos(this.HappyScoreText, .415, .02);

    // Summary Text
    this.SummaryMoneyScoreText = this.add.text(0, 0, g_MoneyScore, { font: 'bold 80px Arial' });
    this.setScreenPos(this.SummaryMoneyScoreText, .45, .38);
    this.SummaryMoneyScoreText.setOrigin(0, 0);
    this.SummaryMoneyScoreText.setVisible(false);

    this.SummaryHappyScoreText = this.add.text(0, 0, g_HappyScore, { font: 'bold 80px Arial' });
    this.setScreenPos(this.SummaryHappyScoreText, .53, .61);
    this.SummaryHappyScoreText.setVisible(false);

    this.updateMoneyScore(0);
    this.updateHappyScore(0);
  }

  ////////////////////////////////////////
  // refresh state of the cfm button (disabled/enabled)
  ////////////////////////////////////////
  RefreshCfmBtnState() {
    if (selectedChoices.length > 0) {
      this.cfmBtn.setTint(0xffffff);
      this.cfmBtn.setInteractive();
    }
    else {
      // disable cfm btn
      this.cfmBtn.setTint(0x5A5A5A);
      this.cfmBtn.disableInteractive();

    }
  }

  ////////////////////////////////////////
  // Callback when cfm game btn is pressed
  ////////////////////////////////////////
  OnCfmBtnPressed(ownerScene) {

    let currScenario = scenariosTable.find(function (scenario) { return scenario.ID == currScenarioID });

    ownerScene.cfmBtn.disableInteractive();

    // // special case for summary
    // if (currScenario.clipName == "Summary") {
    //   ownerScene.BGMusic.stop();
    //   ownerScene.registry.destroy(); // destroy registry
    //   ownerScene.events.off();
    //   ownerScene.scene.restart();
    //   return;
    // }

    // select 1 committal type
    if (currScenario.exclusiveSelection == 1) {
      if (selectedChoices.length > 0) {
        let nextScenarioID = selectedChoices[0].outcomeInfo;
        ownerScene.goToNextScenario(nextScenarioID);
      }
    }

    // threshold selection type
    if (currScenario.exclusiveSelection == 0) {

      // calculate all the choices score
      let totalScore = 0;
      let totalCost = 0;

      for (let index = 0; index < selectedChoices.length; ++index) {
        totalScore += selectedChoices[index].genericValue;
        totalCost += selectedChoices[index].cost;
      }

      // deduct cost
      if (totalCost > 0) {
        ownerScene.updateMoneyScore(-totalCost);
      }

      // find out which threshold region
      for (let index = 0; index < currScenario.outcomeThresholdTable.length; ++index) {
        let currRangeInfo = currScenario.outcomeThresholdTable[index];

        if (totalScore <= currRangeInfo.threshold) {
          ownerScene.goToNextScenario(currRangeInfo.outcome);
          return;
        }
      }
    }
  }

  ////////////////////////////////////////
  // Callback when start game btn is pressed
  ////////////////////////////////////////
  OnStartGameBtnPressed(ownerScene) {

    ownerScene.goToNextScenario(0);
    ownerScene.startGameBtn.setVisible(false);
    ownerScene.initialSplashBG.setVisible(false);

    // cfm btn now shows
    ownerScene.cfmBtn.setVisible(true);
  }

  ////////////////////////////////////////
  // create btn confirm or start game btn
  ////////////////////////////////////////
  createBtn(screenXFactor, screenYFactor, scale, btnName, buttonPressedCallback) {
    let targetBtn = this.add.sprite(0, 0, btnName);

    targetBtn.setScale(scale);

    this.setScreenPos(targetBtn, screenXFactor, screenYFactor);

    targetBtn.setInteractive();

    this.anims.create({
      key: btnName + "Pressed",
      duration: 400,
      frames: this.anims.generateFrameNumbers(btnName, { start: 1, end: 0 })
    });

    targetBtn.on('pointerdown', function () {

      targetBtn.play(btnName + "Pressed");
      targetBtn.disableInteractive();
      this.scene.ButtonClick_SFX.play();

      this.scene.time.addEvent({
        delay: 300,
        callback: function () {
          targetBtn.setInteractive();

          buttonPressedCallback(this);
        },
        callbackScope: this.scene,
      });
    });

    return targetBtn;
  }

  ////////////////////////////////////////
  // set screen position as a normalized factor
  ////////////////////////////////////////
  setScreenPos(target, xParam, yParam) {
    target.setPosition(config.width * xParam, config.height * yParam);
  }

  ////////////////////////////////////////
  // akin to loading the next choice scene
  ////////////////////////////////////////
  goToNextScenario(targetScenarioID) {
    // clear
    selectedChoices = [];

    // disable cfm btn
    this.cfmBtn.setTint(0x5A5A5A);
    this.cfmBtn.disableInteractive();

    let prevScenario = scenariosTable.find(function (scenario) { return scenario.ID == currScenarioID });
    if (prevScenario) {
      for (let index = 0; index < prevScenario.sceneGarbage.length; ++index) {
        let item = prevScenario.sceneGarbage[index];
        item.destroy();
        item = null;
      }
    }

    prevScenario.sceneGarbage = [];
    prevScenario.sceneBtns = [];

    // update the ID
    currScenarioID = targetScenarioID;

    // curr scenario
    let currScenario = scenariosTable.find(function (scenario) { return scenario.ID == currScenarioID });

    if (currScenario.choices.length == 1) {
      selectedChoices.push(currScenario.choices[0]);
    }

    this.OnLoadedGoToNextScenario(currScenario);

    // load dynamically
    //this.load.video(currScenario.clipName, "assets/" + currScenario.clipName + ".mp4");
    //this.load.once(Phaser.Loader.Events.COMPLETE, () => {
    //  this.OnLoadedGoToNextScenario(currScenario);
    //})
    //this.load.start();
  }

  /////////////////////////////////////
  // On load complete, really going to the next scenario
  /////////////////////////////////////
  OnLoadedGoToNextScenario(currScenario) {
    let videoClip = this.add.video(0, 0, currScenario.clipName);
    let clipDuration = videoClip.getDuration();

    if (currScenario.clipName == "Summary") {
      this.ShowSummary(clipDuration);
      this.cfmBtn.setVisible(false);
      this.startGameBtn.setVisible(false);
      this.EndGameBtn.setVisible(true);
    }

    this.setScreenPos(videoClip, 0.5, 0.5);
    videoClip.depth = -10;
    videoClip.play(false, 0.0, clipDuration - 0.1);
    videoClip.on('complete', function (video) {
      videoClip.seekTo(1.0);
      //this.scene.RefreshCfmBtnState();
    });

    this.time.delayedCall(clipDuration * 1000 * 0.85, function() {this.RefreshCfmBtnState();}, [], this);

    this.updateHappyScore(currScenario.happy);
    this.updateMoneyScore(currScenario.money);

    if(currScenario.happy < 0)
    {
      this.Lose_SFX.play();
    }
    if(currScenario.happy > 0)
    {
      this.Win_SFX.play();
    }

    // create the buttons for the next scenario
    this.HelperRef.createScenarioButtons(this, currScenarioID, clipDuration);
  }

  /////////////////////////////////////
  // Show splash summary
  /////////////////////////////////////
  ShowSummary(clipDuration) {

    // lazy....
    let delay = clipDuration * 1000 * 0.78;
    this.SimpleFadeIn(this.SummaryMoneyScoreText, delay);
    this.SimpleFadeIn(this.SummaryHappyScoreText, delay);
  }

  /////////////////////////////////////
  // could be increment or decrease money score
  /////////////////////////////////////
  updateMoneyScore(scoreDiff) {
    g_MoneyScore += scoreDiff;
    g_MoneyScore = Math.max(0, g_MoneyScore);

    this.MoneyScoreText.setText("$" + g_MoneyScore.toFixed(2));
    this.SummaryMoneyScoreText.setText("$" + g_MoneyScore.toFixed(2));

    if (scoreDiff != 0) {
      this.buttonAnimEffect(this.MoneyScoreText, null);
    }
  }

  /////////////////////////////////////
  // updateHappyScore could be positive or negative
  /////////////////////////////////////
  updateHappyScore(scoreDiff) {

    g_HappyScore += scoreDiff;
    g_HappyScore = Math.max(0, g_HappyScore);

    this.HappyScoreText.setText(g_HappyScore);
    this.SummaryHappyScoreText.setText(g_HappyScore);

    if (scoreDiff != 0) {
      this.buttonAnimEffect(this.HappyScoreText, null);
    }
    // show add happy or minus happy icon overlay
    if (scoreDiff > 0) {
      this.overlayFadeAndFlyUp(this.AddHappy);
    }
    else if (scoreDiff < 0) {
      this.overlayFadeAndFlyUp(this.MinusHappy);
    }
  }

  /////////////////////////////////////
  // Simple fade in
  /////////////////////////////////////
  SimpleFadeIn(targetObj, delayValue){
    targetObj.setVisible(true);
    targetObj.setAlpha(0);

    this.tweens.add({
      targets: targetObj,
      delay: delayValue,
      duration: 1500,
      alpha: 1,
      onComplete: function () {
      }
    });
  }

  /////////////////////////////////////
  // used by add happy/minus happy
  /////////////////////////////////////
  overlayFadeAndFlyUp(targetObj) {
    targetObj.setVisible(true);
    targetObj.setAlpha(1);
    targetObj.setScale(0.7);

    this.setScreenPos(targetObj, .40, .05);
    this.tweens.add({
      targets: targetObj,
      ease: 'Back.easeInOut',
      y: -100,
      delay: 500,
      duration: 1500,
      alpha: 0,
      onComplete: function () {
        targetObj.setVisible(false);
        targetObj.setAlpha(0);
      }
    });
  }

  /***************************/
  // Generic Btn Click Effect
  /***************************/
  buttonSpriteAnimEffect(img, animName, callback) {

    img.disableInteractive();
    img.play(animName);
    img.on('animationcomplete', callback);
  }

  /***************************/
  // Generic Btn Click Effect
  /***************************/
  buttonAnimEffect(img, callback) {

    this.tweens.add({
      targets: img,
      scaleX: img.scaleY * 1.2,
      scaleY: img.scaleX * 1.2,
      duration: 200,
      onComplete: callback,
      yoyo: true
    });
  }

}


/////////////////
// HOME PAGE
/////////////////
var config =
{
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: 0x000000,
  scene: [LoadingScene, HomePage]
}

var game = new Phaser.Game(config);
game.scene.start('LoadingScene');
