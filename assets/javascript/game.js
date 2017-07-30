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

	buildCharacterCard: function(id, character, float){
		var myCardContainer= $("<div>");
		myCardContainer.addClass("myCardContainer");
		myCardContainer.attr("data-character", id);

		var myCardContainerInner = $("<div>");
		myCardContainerInner.addClass("myCardContainerInner");

		var card = $("<div>");
		card.addClass(MY_CARD_CLASS);
		if(float){
			card.addClass(LEFT_CLASS);
		}

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
		myCardContainerInner.append(card);
		myCardContainer.append(myCardContainerInner);

		return myCardContainer;

	},

	buildCharacterRow: function(myElement,appendedClass,myCharacters,float){
		for (var id in myCharacters) {
			var card = this.buildCharacterCard(id, myCharacters[id], float);
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

	removeEnemy: function(){
		var defendingCharacterId = this.defendingCharacter.getId();
		$("#fightButtonContainer").css("display", "none");
		$("#defendingCharacter").html("");
		delete this.enemies[defendingCharacterId];
		this.defendingCharacter = null;
		if($.isEmptyObject(this.enemies)){
			this.executeWinState();
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
		if($(this).parent().hasClass(ENEMIES_CLASS) || $(this).parent().hasClass(CHAR_SELECT_CLASS)){
			$(thisElement).clearQueue();
			$(thisElement).animate({
			    height: "100%",
			    width: "100%",
			    "font-size": "15px",
			}, 100, function() {
				//code executed after animation
			});
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
    	if(game.playing === false){//unneccessary?
    		//$("#characterSelect").hide();
	    	var myEnemies = {};
	    	var myId = $(this).attr("data-character");
	    	game.playing = true;
	    	for (var id in game.characters) {
				if (game.characters.hasOwnProperty(id)) {
					if(myId === id) {
				    	game.hero = game.characters[id];
				    	var heroCard = game.buildCharacterCard(myId, game.hero, false);
				    	heroCard.addClass(CHOSEN_CHAR_CLASS);
				    	$("#chosenCharacter").append(heroCard);
				  	} else {
				  		myEnemies[id] = game.characters[id];
				  	}
				}
			}
	    	game.enemies = myEnemies;
    		game.buildCharacterRow($("#enemyCharacters"), ENEMIES_CLASS, game.enemies, false);
    		$("#outerCharacterSelectContainer").animate({
			    top: "-100%",
			}, "2000", function() {
				//code executed after animation
			});
    	} 
    });

    $(document).on('click', ('.' + ENEMIES_CLASS), function() {
    	if(game.playing){//unneccessary?
    		var characterId = $(this).attr("data-character");
    		$("#fightButtonContainer").css("display", "block");
    		if(!(game.defendingCharacter)){
				game.defendingCharacter = game.characters[characterId];
				var defenderCard = game.buildCharacterCard(characterId, game.defendingCharacter, false);
				defenderCard.addClass(DEFEND_CHAR_CLASS);
				$("#defendingCharacter").append(defenderCard);
				$(this).remove();
    		}else{
				$(this).remove();

				var villainCard = game.buildCharacterCard(game.defendingCharacter.getId(), game.defendingCharacter, false);
				villainCard.addClass(ENEMIES_CLASS);
				$("#enemyCharacters").append(villainCard);

				game.defendingCharacter = game.characters[characterId];
				var defenderCard = game.buildCharacterCard(characterId, game.defendingCharacter, false);
				defenderCard.addClass(DEFEND_CHAR_CLASS);
				$("#defendingCharacter").html(defenderCard);
    		}
    	}
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
    	game.hero.attack(game.defendingCharacter);
    	var newHeroCard = game.buildCharacterCard(game.hero.getId(),game.hero,false);
    	var newDefenderCard = game.buildCharacterCard(game.defendingCharacter.getId(),game.defendingCharacter,false);
    	$("#chosenCharacter").html(newHeroCard);
    	$("#defendingCharacter").html(newDefenderCard);
    	if(game.defendingCharacter.health.value <= 0){
    		game.removeEnemy();
    	}
    	if(game.hero.health.value <= 0){
    		game.executeLoseState();
    	}
	});

	$(document).on('mouseout', '.myButtonWrapper', function() {
    	resetButtonSize($(this));
	});

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

});