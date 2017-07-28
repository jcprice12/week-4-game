/*********************************************************************************
Character Prototype
*********************************************************************************/
function Character(myId, myName, myHealth, myAttackPower, myCounterAttackPower, myImageSource, amDefending, amAttacking){
	//public variables
	this.health = myHealth;
	this.attackPower = myAttackPower;

	//private variables
	var id = myId;
	var name = myName;
	var counterAttackPower = myCounterAttackPower;
	var baseAttackPower = myAttackPower;
	var imageSource = myImageSource;
	var isDefending = amDefending;
	var isAttacking = amAttacking;

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

	this.getIsDefending = function(){
		return isDefending;
	}

	this.getIsAttacking = function(){
		return isAttacking;
	}
};

Character.prototype.attack = function(enemy){
	if(enemy instanceof Character){
		console.log(this.getName() + " is attacking " + enemy.getName());
		enemy.health = enemy.health - this.attackPower;
		if(enemy.health > 0){
			this.health = this.health - enemy.getCounterAttackPower();
			this.attackPower = this.attackPower + this.getBaseAttackPower();
		}
	}
};

/************************************************************************************
Executed Code and Event Listeners
************************************************************************************/

//will there be issues with DOM loading like this?
$( document ).ready(function() {
	var MY_CARD_CLASS = "myCard";
	var ENEMIES_CLASS = "enemyChar";
	var CHOSEN_CHAR_CLASS = "chosenChar";
	var CHAR_SELECT_CLASS = "availableChar";
	var DEFEND_CHAR_CLASS = "defendChar";

	var myCharactersObj = {
		"luke-skywalker" : new Character("luke-skywalker", "Luke Skywalker", 100, 10, 5, "assets/images/lukeSkywalker.jpg", false, false),
		"obi-wan-kenobi" : new Character("obi-wan-kenobi", "Obi-Wan Kenobi", 50, 20, 20, "assets/images/obiWanKenobi.jpg", false, false),
		"yoda" : new Character("yoda", "Yoda", 50, 30, 5, "assets/images/yoda.jpg", false),
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
			info.html(information);
			return info;
		},

		buildCharacterCard: function(id, character){
			var card = $("<div>");
			card.attr("class", MY_CARD_CLASS);
			card.attr("data-character", id);

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
			return card;

		},

		buildCharacterRow: function(myElement,appendedClass,myCharacters){
			console.log("building: " + myElement.attr("id"));
			for (var id in myCharacters) {
				var card = this.buildCharacterCard(id, myCharacters[id]);
				card.addClass(appendedClass);
				console.log(card.attr("class"));
			    myElement.append(card);
			}
		},
	};

	game.buildCharacterRow($("#characterSelect"), CHAR_SELECT_CLASS, game.characters);

    $(document).on('click', '.myCard', function() {
    	console.log($(this).attr("class"));
    	if(game.playing === false){
	    	var myEnemies = {};
	    	var myId = $(this).attr("data-character");
	    	game.playing = true;
	    	for (var id in game.characters) {
				if (game.characters.hasOwnProperty(id)) {
					if(myId === id) {
				    	game.hero = game.characters[id];
				    	var heroCard = game.buildCharacterCard(myId, game.hero);
				    	heroCard.addClass(CHAR_SELECT_CLASS);
				    	$("#chosenCharacter").append(heroCard);
				  	} else {
				  		myEnemies[id] = game.characters[id];
				  	}
				}
			}
	    	game.enemies = myEnemies;
    		game.buildCharacterRow($("#enemyCharacters"), ENEMIES_CLASS, game.enemies);
    	} else {
    		console.log("hello");
    		var characterId = $(this).attr("data-character");
    		if(!(game.defendingCharacter)){
    			if(characterId !== game.hero.getId()){
    				game.defendingCharacter = game.characters[characterId];
    				var defenderCard = game.buildCharacterCard(characterId, game.defendingCharacter);
    				defenderCard.addClass(DEFEND_CHAR_CLASS);
    				$("#defendingCharacter").append(defenderCard);
    				$(this).remove();
    			}
    		}else{
    			if((characterId !== game.hero.getId()) && (characterId !== game.defendingCharacter.getId())){
    				$(this).remove();

    				var villainCard = game.buildCharacterCard(game.defendingCharacter.getId(), game.defendingCharacter);
    				villainCard.addClass(ENEMIES_CLASS);
    				$("#enemyCharacters").append(villainCard);

    				game.defendingCharacter = game.characters[characterId];
    				var defenderCard = game.buildCharacterCard(characterId, game.defendingCharacter);
    				defenderCard.addClass(DEFEND_CHAR_CLASS);
    				$("#defendingCharacter").html(defenderCard);
    			}
    		}
    	}
    });

});