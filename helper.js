/////////////////
// Helper class
/////////////////
class Helper {
    constructor() {
    }

    /////////////////////////////////////
    // Helper to harvest xml node
    /////////////////////////////////////
    HarvestXMLNodeAttribute(parentNode, tagName, attributeName) {
        let potentialElements = parentNode.getElementsByTagName(tagName);
        if (potentialElements && potentialElements.length > 0) {
            if (potentialElements[0].childNodes.length > 0) {
                return potentialElements[0].getAttribute(attributeName);
            }
        }

        return -1;
    }

    /////////////////////////////////////
    // Helper to harvest xml node
    /////////////////////////////////////
    HarvestXMLNode(parentNode, tagName, defaultValue = -1) {
        let potentialElements = parentNode.getElementsByTagName(tagName);
        if (potentialElements && potentialElements.length > 0) {
            if (potentialElements[0].childNodes.length > 0) {
                return potentialElements[0].childNodes[0].nodeValue;
            }
        }

        return defaultValue;
    }

    /////////////////////////////////////
    // Load all the scenario videos/data
    /////////////////////////////////////
    ParseScenarios(owner, xmlCache) {
        // reading XML

        const gameMap = xmlCache.get('data');
        const scenarios = gameMap.getElementsByTagName('scenario');

        // iterate the scenarios
        for (let scenarioIndex = 0; scenarioIndex < scenarios.length; ++scenarioIndex) {
            let iterScenario = scenarios[scenarioIndex];

            // object to hold the data
            var scenarioData =
            {
                ID : -1,
                clipName : "",
                sceneGarbage: [],
                choices: [],
                exclusiveSelection: -1,
                money: 0,
                happy: 0,
                sceneBtns: [],
                choiceBtnPosX: -1,
                choiceBtnPosY: -1,
                choiceBtnGap: -1,
                outcomeThresholdTable: []
            }

            scenarioData.ID = parseInt(iterScenario.getAttribute('id'));

            scenarioData.clipName = this.HarvestXMLNode(iterScenario, 'clipName');

            scenarioData.exclusiveSelection = this.HarvestXMLNode(iterScenario, 'exclusiveSelection');
            scenarioData.money = parseFloat(this.HarvestXMLNode(iterScenario, 'money', 0));
            scenarioData.happy = parseInt(this.HarvestXMLNode(iterScenario, 'happy', 0));

            scenarioData.choiceBtnPosX = this.HarvestXMLNode(iterScenario, 'choiceBtnPosX');
            scenarioData.choiceBtnPosY = this.HarvestXMLNode(iterScenario, 'choiceBtnPosY');
            scenarioData.choiceBtnGap = this.HarvestXMLNode(iterScenario, 'choiceBtnGap');

            // Harvest any outcome thresholds
            const allOutcomeThresholds = iterScenario.getElementsByTagName('outcomeThreshold');

            for (let iter = 0; iter < allOutcomeThresholds.length; ++iter) {
                let outcomeThresholdNode = allOutcomeThresholds[iter];

                let outcomeThresholdInfo = { threshold: 0, outcome: 0 };

                outcomeThresholdInfo.threshold = outcomeThresholdNode.childNodes[0].nodeValue;
                outcomeThresholdInfo.outcome = outcomeThresholdNode.getAttribute('value');

                scenarioData.outcomeThresholdTable.push(outcomeThresholdInfo);
            }

            // iterate the choices
            var choiceNodes = iterScenario.getElementsByTagName('choice');

            for (let i = 0; i < choiceNodes.length; ++i) {
                let currChoiceNode = choiceNodes[i];

                let outcome = this.HarvestXMLNode(currChoiceNode, 'outcome');
                let genericValue = this.HarvestXMLNode(currChoiceNode, 'genericValue');
                let costValue = this.HarvestXMLNode(currChoiceNode, 'cost');

                var choiceInfo =
                {
                    outcomeInfo: parseInt(outcome),
                    genericValue: parseInt(genericValue),
                    cost: parseFloat(costValue)
                };

                scenarioData.choices.push(choiceInfo);
            }

            scenariosTable.push(scenarioData);
        }
    }


    /////////////////////////////////////
    // Create scenario buttons
    /////////////////////////////////////
    createScenarioButtons(owner, targetScenarioID, clipDuration) {

        // create buttons for this scenario
        let currScenario = scenariosTable.find(function (scenario) { return scenario.ID == currScenarioID });
        currScenario.sceneGarbage = [];
        currScenario.sceneBtns = [];

        let btnSpacing = currScenario.choiceBtnGap;

        // if only 1 choice, don't create, the cfm btn will take care of it
        if (currScenario.choices.length <= 1) {
            let onlyChoice = currScenario.choices[0];
            selectedChoices.push(onlyChoice);
            return;
        }

        for (let choiceIndex = 0; choiceIndex < currScenario.choices.length; ++choiceIndex) {
            let btnPosX = currScenario.choiceBtnPosX * config.width + (choiceIndex * btnSpacing);
            let btnPosY = currScenario.choiceBtnPosY * config.height;

            let btn = owner.add.sprite(btnPosX, btnPosY, "ChoiceBtn").setInteractive();
            btn.setScale(0.72);

            currScenario.sceneGarbage.push(btn);
            currScenario.sceneBtns.push(btn);

            // multiple selection type
            let highlightBox;
            if (currScenario.exclusiveSelection == 0) {
                highlightBox = owner.add.image(btnPosX + 30, btnPosY - 125, "HighlightBox");
                highlightBox.setVisible(false);
                highlightBox.setScale(0.85);
                currScenario.sceneGarbage.push(highlightBox);
            }

            // create scenario btn animation
            owner.anims.create({
                key: "scenarioBtnIdle",
                frames: owner.anims.generateFrameNumbers("ChoiceBtn", { start: 2, end: 2 })
            });

            owner.anims.create({
                key: "scenarioBtnPressed",
                frames: owner.anims.generateFrameNumbers("ChoiceBtn", { start: 3, end: 3 })
            });

            owner.anims.create({
                key: "scenarioBtnDisabled",
                frames: owner.anims.generateFrameNumbers("ChoiceBtn", { start: 0, end: 0 })
            });

            owner.anims.create({
                key: "scenarioBtnPrompt",
                repeat: -1,
                duration: 1500,
                frames: owner.anims.generateFrameNumbers("ChoiceBtn", { start: 1, end: 2 })
            });

            btn.setAlpha(0);

            // wait, fade in
            owner.tweens.addCounter({
                targets: btn,
                duration: 100,
                delay: clipDuration * 0.65 * 1000,
                from: 0.0,
                to: 1.0,
                onUpdate: function (tween) {
                    btn.setAlpha(tween.getValue());
                },
                onComplete: function (tween) {
                    btn.play('scenarioBtnPrompt');
                }
            });

            btn.on('pointerdown', function () {

                
                // exlusive selection
                if (currScenario.exclusiveSelection == 1) {
                    selectedChoices = [];

                    // reset the other btns
                    for (let btnIndex = 0; btnIndex < currScenario.sceneBtns.length; ++btnIndex) {
                        let currBtn = currScenario.sceneBtns[btnIndex];
                        currBtn.setInteractive();
                        currBtn.play('scenarioBtnPrompt');
                    }
                }

                btn.play('scenarioBtnPressed');
                owner.ButtonClick_SFX.play();
                let nextChoiceInfo = currScenario.choices[choiceIndex];

                // collate the choices
                if (!selectedChoices.includes(nextChoiceInfo)) {
                    if (highlightBox) {
                        highlightBox.setVisible(true);
                    }
                    selectedChoices.push(nextChoiceInfo);
                }
                else {
                    if (highlightBox) {
                        highlightBox.setVisible(false);
                    }
                    Phaser.Utils.Array.Remove(selectedChoices, nextChoiceInfo);
                }

                btn.disableInteractive();

                if (currScenario.exclusiveSelection == 0) {
                    owner.time.addEvent({
                        delay: 300,
                        callback: function () {
                            btn.setInteractive();
                            btn.play('scenarioBtnPrompt');
                        }
                    });
                }

                owner.RefreshCfmBtnState();
            });
        }
    }

};