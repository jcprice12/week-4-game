/*********************************************************************************
Character Prototype
*********************************************************************************/
function Character(myId, myName, myHealth, myAttackPower, myCounterAttackPower, myImageSource){
	//public variables
	this.health = {
		description: "Health",
		value: myHealth,
	};
	this.attackPower = {
		description: "Attack Power",
		value: myAttackPower,
	};

	//private variables
	var id = myId;
	var name = myName;
	var counterAttackPower = {
		description: "Counter Attack",
		value: myCounterAttackPower,
	};
	var baseAttackPower = myAttackPower;
	var imageSource = myImageSource;

	//public methods to access private variables
	this.getId = function(){
		return id;
	}

	this.getName = function(){
		return name;
	}

	this.getCounterAttackPower = function(){
		return counterAttackPower;
	}

	this.getBaseAttackPower = function(){
		return baseAttackPower;
	}

	this.getImageSource = function(){
		return imageSource;
	}
};


//attack method. enemies that are defeated once attacked so not cause damage to the attacking character
Character.prototype.attack = function(enemy){
	if(enemy instanceof Character){
		console.log(this.getName() + " is attacking " + enemy.getName());
		var enemyHealth = enemy.health.value - this.attackPower.value;
		if(enemyHealth < 0 ){
			enemy.health.value = 0;
		} else {
			enemy.health.value = enemyHealth;
		}
		this.attackPower.value = this.attackPower.value + this.getBaseAttackPower();
		if(enemy.health.value > 0){
			var myHealth = this.health.value - enemy.getCounterAttackPower().value;
			if(myHealth < 0){
				this.health.value = 0;
			} else {
				this.health.value = myHealth;
			}
		}
	}
};


/***************************************************************************************************
Varibales and objects
***************************************************************************************************/
//some 'constants' to make swapping class names easier
var MY_CARD_CLASS = "myCard";
var ENEMIES_CLASS = "enemyChar";
var CHOSEN_CHAR_CLASS = "chosenChar";
var CHAR_SELECT_CLASS = "availableChar";
var DEFEND_CHAR_CLASS = "defendChar";
var MY_CARD_CONTAINER_CLASS = "myCardContainer";
var MY_CARD_CONTAINER_INNER_CLASS = "myCardContainerInner";
var CARD_WRAPPER_CLASS = "cardWrapper";
var NAME_HEADER_CLASS = "nameHeader";
var IMAGE_WRAPPER_CLASS = "imageWrapper";
var CHARACTER_IMAGE_CLASS = "characterImage";
var CHARACTER_INFORMATION_CLASS = "characterInformation";
var INFO_CONTAINER_CLASS = "infoContainer";
var CARD_COVER_CLASS = "cardCover";
var MY_BUTTON_WRAPPER_CLASS = "myButtonWrapper";

/***************************************************
Game object, controls most aspects of the game
***************************************************/
var game = {
	characters : createCharactersObject(),
	playing : false,
	hero : null,//chosen character
	enemies : null,//characters that must be defeated to win
	defendingCharacter : null,//character chose to fight against

	//build stats on card
	buildCharacterInformationDiv: function(information){
		var info = $("<div>");
		info.addClass(INFO_CONTAINER_CLASS);
		info.html(information.description + ": " + information.value);
		return info;
	},

	//build card for character, important because the id of the character is linked to the data-character attribute of the html card
	buildCharacterCard: function(id, character, defeated){
		var myCardContainer= $("<div>");
		myCardContainer.addClass(MY_CARD_CONTAINER_CLASS);
		myCardContainer.attr("data-character", id);

		var myCardContainerInner = $("<div>");
		myCardContainerInner.addClass(MY_CARD_CONTAINER_INNER_CLASS);

		var card = $("<div>");
		card.addClass(MY_CARD_CLASS);

		var cardWrapper = $("<div>");
		cardWrapper.attr("class", CARD_WRAPPER_CLASS);

		var nameHeader = $("<div>");
		nameHeader.addClass(NAME_HEADER_CLASS);
		nameHeader.html(character.getName());

		var imageWrapper = $("<div>");
		imageWrapper.addClass(IMAGE_WRAPPER_CLASS);

		var image = $("<img>");
		image.addClass(CHARACTER_IMAGE_CLASS);
		image.attr("src", character.getImageSource());
		image.attr("alt", character.getName());
		imageWrapper.append(image);

		var characterInformation = $("<div>");
		characterInformation.addClass(CHARACTER_INFORMATION_CLASS);
		characterInformation.append(this.buildCharacterInformationDiv(character.health));
		characterInformation.append(this.buildCharacterInformationDiv(character.attackPower));
		characterInformation.append(this.buildCharacterInformationDiv(character.getCounterAttackPower()));

		cardWrapper.append(nameHeader);
		cardWrapper.append(imageWrapper);
		cardWrapper.append(characterInformation);
		card.append(cardWrapper);
		if(defeated){
			var cardCover = $("<div>");
			cardCover.addClass(CARD_COVER_CLASS);
			card.append(cardCover);
		}
		myCardContainerInner.append(card);
		myCardContainer.append(myCardContainerInner);

		return myCardContainer;

	},

	//builds a row of character cards. appends the cards to 'myElement' (the row)
	buildCharacterRow: function(myElement,appendedClass,myCharacters,defeated){
		for (var id in myCharacters) {
			var card = this.buildCharacterCard(id, myCharacters[id], defeated);
			card.addClass(appendedClass);
		    myElement.append(card);
		}
	},

	//code to be run when the game has been lost
	executeLoseState: function(){
		console.log("you have lost");
		var heading = this.hero.getName() + " has lost!";
		var myPromise = createMessageBox(heading,"Press 'OK' to play again.");
		myPromise.then(function(value){
			game.resetGame();
		});
	},

	//code to be run when the game has been won
	executeWinState: function(){
		console.log("you have won");
		var heading = this.hero.getName() + " has won!";
		var myPromise = createMessageBox(heading,"Press 'OK' to play again.");
		myPromise.then(function(value){
			game.resetGame();
		});
	},

	//code to execute when the user presses the "fight button"
	//calls the attack method against another character and edits html
	//determines if the user has the lost the game or not
	executeFight: function(){

		var oldAttack = this.hero.attackPower.value;
		var oldHealth = this.hero.health.value;
    	this.hero.attack(this.defendingCharacter);
    	var newHealth = this.hero.health.value;
    	var receivedDamage  = oldHealth - newHealth;
    	var newHeroCard = this.buildCharacterCard(this.hero.getId(),this.hero,false);
    	var newDefenderCard = this.buildCharacterCard(this.defendingCharacter.getId(),this.defendingCharacter,false);
    	$("#chosenCharacter").html(newHeroCard);
    	$("#defendingCharacter").html(newDefenderCard);

    	//createMessageBox(heading, message);
    	var heading = game.hero.getName() + " attacked " + game.defendingCharacter.getName();
		var message = "<p>" + game.hero.getName() + " dealt " + oldAttack + " damage to " + game.defendingCharacter.getName() + "</p>";
		message = message + "<p>" + game.hero.getName() + " received " + receivedDamage  + " damage from " + game.defendingCharacter.getName() + "</p>";
		var myPromise = createMessageBox(heading,message);
		myPromise.then(function(value){
			if(game.defendingCharacter.health.value <= 0){
    			game.removeEnemy();
	    	} else if(game.hero.health.value <= 0){
	    		game.executeLoseState();
	    	}
		});
	},

	//code that is executed once an enemy has been defeated by the user's chosen character
	//win state is determined here
	removeEnemy: function(){
		var defendingCharacterId = this.defendingCharacter.getId();
		var villainCard = this.buildCharacterCard(this.defendingCharacter.getId(), this.defendingCharacter, true);
		villainCard.addClass(ENEMIES_CLASS);
		$("#enemyCharacters").append(villainCard);
		$("#fightButtonContainer").css("display", "none");
		$("#defendingCharacter").html("");
		var heading = this.hero.getName() + " defeated " + this.defendingCharacter.getName();
		var myPromise = createMessageBox(heading,"");
		myPromise.then(function(value){
			delete game.enemies[defendingCharacterId];
			game.defendingCharacter = null;
			if($.isEmptyObject(game.enemies)){
				game.executeWinState();
			}
		});
	},

	//code that is execute when a character has been chosen by the user
	//removes "title" screen
	chooseCharacter: function(myId){
		if(this.playing === false){//unneccessary?
	    	var myEnemies = {};
	    	this.playing = true;
	    	for (var id in this.characters) {
				if (this.characters.hasOwnProperty(id)) {
					if(myId === id) {
				    	this.hero = this.characters[id];
				    	var heroCard = this.buildCharacterCard(myId, this.hero, false);
				    	heroCard.addClass(CHOSEN_CHAR_CLASS);
				    	$("#chosenCharacter").append(heroCard);
				  	} else {
				  		myEnemies[id] = this.characters[id];
				  	}
				}
			}
	    	this.enemies = myEnemies;
    		this.buildCharacterRow($("#enemyCharacters"), ENEMIES_CLASS, this.enemies, false);
    		$("#outerCharacterSelectContainer").animate({
			    top: "-100%",
			}, 700, function() {
				//code executed after animation
				$(this).css("display", "none");
			});
    	}
	},

	//code that is executed when a user clicks an enemy card.
	//places card in the defending character slot on the game board
	switchEnemy: function(characterId, thisElement){
		if(this.playing && (this.enemies.hasOwnProperty(characterId))){//unneccessary?
			$("#fightButtonContainer").css("display", "block");
			if(!(this.defendingCharacter)){
				this.defendingCharacter = this.characters[characterId];
				var defenderCard = this.buildCharacterCard(characterId, this.defendingCharacter, false);
				defenderCard.addClass(DEFEND_CHAR_CLASS);
				$("#defendingCharacter").append(defenderCard);
				thisElement.remove();
			}else{
				thisElement.remove();

				var villainCard = this.buildCharacterCard(this.defendingCharacter.getId(), this.defendingCharacter, false);
				villainCard.addClass(ENEMIES_CLASS);
				$("#enemyCharacters").append(villainCard);

				this.defendingCharacter = this.characters[characterId];
				var defenderCard = this.buildCharacterCard(characterId, this.defendingCharacter, false);
				defenderCard.addClass(DEFEND_CHAR_CLASS);
				$("#defendingCharacter").html(defenderCard);
			}
		}
	},

	//code that is executed once user decides to play a new game (perhaps after winning/losing)
	resetGame: function(){
		$("#outerCharacterSelectContainer").css("display", "table");
		this.characters = createCharactersObject();
		this.playing = false;
		this.hero = null;
		this.enemies = null;
		this.defendingCharacter = null;
		$("#outerCharacterSelectContainer").animate({
		    top: "0%",
		}, 700, function() {
			//code executed after animation
			$("#enemyCharacters").html("");
			$("#chosenCharacter").html("");
			$("#defendingCharacter").html("");
			$("#fightButtonContainer").css("display", "none");
		});
		console.log(this);
	},

};

/**********************************************************************************************************
Miscellaneous functions - mostly used for animation
**********************************************************************************************************/

//used to instantiate a new object of characters
function createCharactersObject(){
	var characters = new Object();
	characters["luke-skywalker"] = new Character("luke-skywalker", "Luke Skywalker", 120, 4, 8, "assets/images/lukeSkywalker.jpg");
	characters["obi-wan-kenobi"] = new Character("obi-wan-kenobi", "Obi-Wan Kenobi", 60, 10, 7, "assets/images/obiWanKenobi.jpg");
	characters["yoda"] = new Character("yoda", "Yoda", 50, 12, 6, "assets/images/yoda.jpg");
	characters["palpatine"] = new Character("palpatine", "Palpatine", 40, 15, 30, "assets/images/palpatine.jpg");
	characters["darth-vader"] = new Character("darth-vader", "Darth Vader", 150, 2.5, 15, "assets/images/darthVader.jpg");
	characters["boba-fett"] = new Character("boba-fett", "Boba Fett", 100, 5, 25, "assets/images/bobaFett.jpg");
	return characters;
}

//reset button to original dimensions
function resetButtonSize(element){
	$(element).animate({
		height: "100%",
		width: "100%",
	}, 100, function() {
		//code executed after animation
	});
}

//used to "pop character card" out and at the user when he/she hovers over selectable card
function popOutCard(thisElement){
	thisElement.clearQueue();
	thisElement.animate({
	    height: "100%",
	    width: "100%",
	    "font-size": "17px",
	}, 100, function() {
		//code executed after animation
	});
}

//change color of text to yellow
//calls flicker off
function flickerOn(element){
	$(element).css("color", "#ffd700");
	setTimeout(function(){ 
		flickerOff(element);
	}, 1000);
}

//change color of text to black
//calls flicker on
function flickerOff(element){
	$(element).css("color", "#000");
	setTimeout(function(){ 
		flickerOn(element);
	}, 1000);
}


//function to create a messagebox with a given heading and message
//returns a PROMISE to add event listener for ok button and remove that event listener when button is pressed. when the button is pressed and the overlay is destroyed,
//the promise is resolved. This is necessary to prevent code after the message box appears to be executed until the user clicks "ok"
function createMessageBox(heading, message){
    var messageBoxContainer = $("<div>");
    messageBoxContainer.addClass("messageBoxContainer");
    var messageBoxWrapper = $("<div>");
    messageBoxWrapper.addClass("messageBoxWrapper");
    var messageBoxWrapper2 = $("<div>");
    messageBoxWrapper2.addClass("messageBoxWrapper2");
    var messageBoxHeader = $("<div>");
    messageBoxHeader.addClass("messageBoxHeader");
    messageBoxHeader.addClass("messageBoxElement");
    messageBoxHeader.html(heading);
    var messageBoxMessage = $("<div>");
    messageBoxMessage.addClass("messageBoxMessage");
    messageBoxMessage.addClass("messageBoxElement");
    messageBoxMessage.html(message);
    var messageBoxButtonContainer = $("<div>");
    messageBoxButtonContainer.addClass("messageBoxButtonContainer");
    messageBoxButtonContainer.addClass("messageBoxElement");
    var messageBoxButton = document.createElement("div");
    $(messageBoxButton).addClass("myMessageBoxButton");
    $(messageBoxButton).addClass("myMessageBoxButtonOkButton");
    $(messageBoxButton).html("OK");


    messageBoxButtonContainer.append(messageBoxButton);
    messageBoxWrapper2.append(messageBoxHeader);
    messageBoxWrapper2.append(messageBoxMessage);
    messageBoxWrapper2.append(messageBoxButtonContainer);
    messageBoxWrapper.append(messageBoxWrapper2);
    messageBoxContainer.append(messageBoxWrapper);

    var messageBoxOverlay = $("<div>");
    messageBoxOverlay.addClass("messageBoxOverlay");
    $(messageBoxOverlay).append(messageBoxContainer);
    $("body").append(messageBoxOverlay);
    $(messageBoxOverlay).animate({
        top: "0%",
    }, "1000", function() {

    });

    //important. use the "then()" method on the returned promise and a callback to execute code until only after this promise is resolved
    //code in the callback waits to be executed until after user presses ok (because it is only resolved until then)
    var messageBoxPromise = new Promise(function(resolve){
	    messageBoxButton.addEventListener("click", function (){
	    	messageBoxButton.removeEventListener("click", function(){
	    		
	    	});
	    	messageBoxOverlay.remove();
	    	resolve();
	    }, false);
	});
	return messageBoxPromise;
}

/************************************************************************************
Executed Code and Event Listeners
************************************************************************************/
//will there be issues with DOM loading like this?
$( document ).ready(function() {

	//builds the row of available characters to select from. essentially this line starts the whole game.
	game.buildCharacterRow($("#characterSelect"), CHAR_SELECT_CLASS, game.characters, false);
	flickerOn($("#chooseTitle"));
	flickerOn($("#availableEnemiesHeader"));

	$(document).on('mouseenter', ('.' + MY_CARD_CONTAINER_INNER_CLASS), function() {
		var thisElement = $(this);
		var characterId = thisElement.parent().attr("data-character");
		if(thisElement.parent().hasClass(CHAR_SELECT_CLASS)){
			popOutCard(thisElement);
		} else if(thisElement.parent().hasClass(ENEMIES_CLASS) && game.enemies.hasOwnProperty(characterId)){
			popOutCard(thisElement);
		}
	});

	$(document).on('mouseleave', ('.' + MY_CARD_CONTAINER_INNER_CLASS), function() {
		$(this).animate({
		    height: "95%",
		    width: "95%",
		    "font-size": "16px",
		}, 100, function() {
			//code executed after animation
		});
	});

    $(document).on('click', ('.'+ CHAR_SELECT_CLASS), function() {
    	var myId = $(this).attr("data-character");
    	game.chooseCharacter(myId);
    });

    $(document).on('click', ('.' + ENEMIES_CLASS), function() {
    	var characterId = $(this).attr("data-character");
    	game.switchEnemy(characterId, $(this));
    });

    $(document).on('mousedown', ('.' + MY_BUTTON_WRAPPER_CLASS), function() {
    	$(this).animate({
		    height: "92%",
		    width: "97%",
		}, 100, function() {
			//code executed after animation
		});
	});

	$(document).on('mouseup', ('.' + MY_BUTTON_WRAPPER_CLASS), function() {
    	resetButtonSize($(this));
    	game.executeFight();
	});

	$(document).on('mouseout', ('.' + MY_BUTTON_WRAPPER_CLASS), function() {
    	resetButtonSize($(this));
	});

	$(document).on('click', "#instructionsButton", function() {
		var message = "<p>Select a character to start playing. You will play as that character for the duration of the game.</p><br>";
		var message = message + "<p>To win the game, you must defeat all of the enemies indicated in the 'Available Enemies to Fight' area.</p><br>";
		var message = message + "<p>An enemy is 'defeated' once his/her health reaches 0. To select an enemy to fight, click on the corresponding character card in the 'Available Enemies to Fight' area. Click the 'FIGHT' button to fight that character.</p><br>";
		var message = message + "<p>When you fight an enemy, you deal damage equal to your character's attack power. Whenever you attack an enemy, your attack power increases by the amount of attack power your character had at the beginning of the game. If you cannot kill your enemy with your attack, your character takes damage equal to that of the defending character's Counter Atttack power.</p><br>";
		var message = message + "<p>You lose the game if your character's health reaches 0.</p><br>";
    	var promise = createMessageBox("Instructions", message);
    });

});