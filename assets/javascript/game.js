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

Character.prototype.attack = function(enemy){
	if(enemy instanceof Character){
		console.log(this.getName() + " is attacking " + enemy.getName());
		enemy.health.value = enemy.health.value - this.attackPower.value;
		this.attackPower.value = this.attackPower.value + this.getBaseAttackPower();
		if(enemy.health.value > 0){
			var damage = this.health.value - enemy.getCounterAttackPower().value;
			if(damage < 0){
				this.health.value = 0;
			} else {
				this.health.value = damage;
			}
		}
	}
};

var MY_CARD_CLASS = "myCard";
var ENEMIES_CLASS = "enemyChar";
var CHOSEN_CHAR_CLASS = "chosenChar";
var CHAR_SELECT_CLASS = "availableChar";
var DEFEND_CHAR_CLASS = "defendChar";
var LEFT_CLASS = "left";
var MY_CARD_CONTAINER_CLASS = "myCardContainer";
var MY_CARD_CONTAINER_INNER_CLASS = "myCardContainerInner";

var myCharactersObj = {
	"luke-skywalker" : new Character("luke-skywalker", "Luke Skywalker", 100, 10, 5, "assets/images/lukeSkywalker.jpg"),
	"obi-wan-kenobi" : new Character("obi-wan-kenobi", "Obi-Wan Kenobi", 50, 20, 20, "assets/images/obiWanKenobi.jpg"),
	"yoda" : new Character("yoda", "Yoda", 50, 30, 5, "assets/images/yoda.jpg"),
	"palpatine" : new Character("palpatine", "Palpatine", 45, 10, 30, "assets/images/palpatine.jpg"),
	"darth-vader" : new Character("darth-vader", "Darth Vader", 120, 7, 15, "assets/images/darthVader.jpg"),
	"boba-fett" : new Character("boba-fett", "Boba Fett", 60, 14, 15, "assets/images/bobaFett.jpg"),
}

var game = {
	characters : myCharactersObj,
	playing : false,
	hero : null,
	enemies : null,
	defendingCharacter : null,

	buildCharacterInformationDiv: function(information){
		var info = $("<div>");
		info.addClass("infoContainer");
		info.html(information.description + ": " + information.value);
		return info;
	},

	buildCharacterCard: function(id, character, defeated){
		var myCardContainer= $("<div>");
		myCardContainer.addClass("myCardContainer");
		myCardContainer.attr("data-character", id);

		var myCardContainerInner = $("<div>");
		myCardContainerInner.addClass("myCardContainerInner");

		var card = $("<div>");
		card.addClass(MY_CARD_CLASS);

		var cardWrapper = $("<div>");
		cardWrapper.attr("class", "cardWrapper");

		var imageWrapper = $("<div>");
		imageWrapper.addClass("imageWrapper");

		var image = $("<img>");
		image.addClass("characterImage");
		image.attr("src", character.getImageSource());
		image.attr("alt", character.getName());
		imageWrapper.append(image);

		var characterInformation = $("<div>");
		characterInformation.addClass("characterInformation");
		characterInformation.append(this.buildCharacterInformationDiv(character.health));
		characterInformation.append(this.buildCharacterInformationDiv(character.attackPower));
		characterInformation.append(this.buildCharacterInformationDiv(character.getCounterAttackPower()));

		cardWrapper.append(imageWrapper);
		cardWrapper.append(characterInformation);
		card.append(cardWrapper);
		if(defeated){
			var cardCover = $("<div>");
			cardCover.addClass("cardCover");
			card.append(cardCover);
		}
		myCardContainerInner.append(card);
		myCardContainer.append(myCardContainerInner);

		return myCardContainer;

	},

	buildCharacterRow: function(myElement,appendedClass,myCharacters,defeated){
		for (var id in myCharacters) {
			var card = this.buildCharacterCard(id, myCharacters[id], defeated);
			card.addClass(appendedClass);
		    myElement.append(card);
		}
	},

	executeLoseState: function(){
		console.log("you have lost");
	},

	executeWinState: function(){
		console.log("you have won");
	},

	executeFight: function(){
		//var heading = game.hero.getName() + " attacked " + game.defendingCharacter.getName();
    	//var message = "<p>" + game.hero.getName() + " dealt " + game.hero.attackPower.value + " damage to " + game.defendingCharacter.getName() + "</p>";
    	this.hero.attack(this.defendingCharacter);
    	var newHeroCard = this.buildCharacterCard(this.hero.getId(),this.hero,false);
    	var newDefenderCard = this.buildCharacterCard(this.defendingCharacter.getId(),this.defendingCharacter,false);
    	$("#chosenCharacter").html(newHeroCard);
    	$("#defendingCharacter").html(newDefenderCard);

    	//createMessageBox(heading, message);

    	if(this.defendingCharacter.health.value <= 0){
    		this.removeEnemy();
    	}
    	if(this.hero.health.value <= 0){
    		this.executeLoseState();
    	}
	},

	removeEnemy: function(){
		var defendingCharacterId = this.defendingCharacter.getId();
		var villainCard = this.buildCharacterCard(this.defendingCharacter.getId(), this.defendingCharacter, true);
		villainCard.addClass(ENEMIES_CLASS);
		$("#enemyCharacters").append(villainCard);
		$("#fightButtonContainer").css("display", "none");
		$("#defendingCharacter").html("");
		delete this.enemies[defendingCharacterId];
		this.defendingCharacter = null;
		if($.isEmptyObject(this.enemies)){
			this.executeWinState();
		}
	},

	chooseCharacter: function(myId){
		if(this.playing === false){//unneccessary?
    		//$("#characterSelect").hide();
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
			}, "2000", function() {
				//code executed after animation
				$(this).css("display", "none");
			});
    	}
	},

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

};

function resetButtonSize(element){
	$(element).animate({
		height: "100%",
		width: "100%",
	}, 100, function() {
		//code executed after animation
	});
}

function popOutCard(thisElement){
	thisElement.clearQueue();
	thisElement.animate({
	    height: "100%",
	    width: "100%",
	    "font-size": "15px",
	}, 100, function() {
		//code executed after animation
	});
}

function flickerOn(element){
	$(element).css("color", "#ffd700");
	setTimeout(function(){ 
		flickerOff(element);
	}, 1000);
}

function flickerOff(element){
	$(element).css("color", "#000");
	setTimeout(function(){ 
		flickerOn(element);
	}, 1000);
}

/************************************************************************************
Executed Code and Event Listeners
************************************************************************************/
//will there be issues with DOM loading like this?
$( document ).ready(function() {

	game.buildCharacterRow($("#characterSelect"), CHAR_SELECT_CLASS, game.characters, false);
	flickerOn($("#chooseTitle"));
	flickerOn($("#availableEnemiesHeader"));

	$(document).on('mouseenter', '.myCardContainerInner', function() {
		var thisElement = $(this);
		var characterId = thisElement.parent().attr("data-character");
		if(thisElement.parent().hasClass(CHAR_SELECT_CLASS)){
			popOutCard(thisElement);
		} else if(thisElement.parent().hasClass(ENEMIES_CLASS) && game.enemies.hasOwnProperty(characterId)){
			popOutCard(thisElement);
		}
	});

	$(document).on('mouseleave', '.myCardContainerInner', function() {
		$(this).animate({
		    height: "95%",
		    width: "95%",
		    "font-size": "14px",
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

    $(document).on('mousedown', '.myButtonWrapper', function() {
    	$(this).animate({
		    height: "82%",
		    width: "94%",
		}, 100, function() {
			//code executed after animation
		});
	});

	$(document).on('mouseup', '.myButtonWrapper', function() {
    	resetButtonSize($(this));
    	game.executeFight();
	});

	$(document).on('mouseout', '.myButtonWrapper', function() {
    	resetButtonSize($(this));
	});

	function deleteMessageBox(element){
        $(".messageBoxOverlay").remove();
    }

    $(document).on('click', ('.myMessageBoxButtonOkButton'), function() {
        var element = $(this);
        deleteMessageBox(element);
    });

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
        var messageBoxButton = $("<div>");
        messageBoxButton.addClass("myMessageBoxButton");
        messageBoxButton.addClass("myMessageBoxButtonOkButton");
        messageBoxButton.html("OK");

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
    }

});