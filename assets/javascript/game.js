/*********************************************************************************
Character Prototype
*********************************************************************************/
function Character(/*myId,*/ myName, myHealth, myAttackPower, myCounterAttackPower, myImageSource){
	//public variables
	this.health = myHealth;
	this.attackPower = myAttackPower;

	//private variables
	//var charId = myId;
	var name = myName;
	var counterAttackPower = myCounterAttackPower;
	var baseAttackPower = myAttackPower;
	var imageSource = myImageSource;

	//public methods to access private variables
	/*
	this.getCharId = function(){
		return charId;
	}
	*/

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
		enemy.health = enemy.health - this.attackPower;
		if(enemy.health > 0){
			this.health = this.health - enemy.getCounterAttackPower();
			this.attackPower = this.attackPower + this.getBaseAttackPower();
		}
	}
};

/***********************************************************************************
GameSession Prototype
************************************************************************************/
// function GameSession(playing, hero, enemies){
// 	this.playing = true;
// 	this.hero = hero;
// 	this.enemies = enemies;
// 	this.defendingCharacter;
// };

// /***********************************************************************************
// Game Prototype
// ************************************************************************************/
// function Game(session, characters){
// 	this.session = session;
// 	this.characters = characters;

// };
// Game.prototype.buildCharacterInformationDiv = function(parent, information){
// 	var info = $("<div>");
// 	info.addClass("infoContainer");
// 	info.html(information);
// 	parent.append(info);
// }
// Game.prototype.buildCharacterCard = function(parent, id, character){
// 	var card = $("<div>");
// 	card.addClass("myCard");
// 	card.attr("data-character", id);

// 	var cardWrapper = $("<div>");
// 	cardWrapper.addClass("cardWrapper");

// 	var imageWrapper = $("<div>");
// 	imageWrapper.addClass("imageWrapper");

// 	var image = $("<img>");
// 	image.addClass("characterImage");
// 	image.attr("src", character.getImageSource());
// 	image.attr("alt", character.getName());
// 	imageWrapper.append(image);

// 	var characterInformation = $("<div>");
// 	characterInformation.addClass("characterInformation");
// 	this.buildCharacterInformationDiv(characterInformation, character.health);
// 	this.buildCharacterInformationDiv(characterInformation, character.attackPower);
// 	this.buildCharacterInformationDiv(characterInformation, character.getCounterAttackPower());

// 	cardWrapper.append(imageWrapper);
// 	cardWrapper.append(characterInformation);
// 	card.append(cardWrapper);
// 	parent.append(card);

// }
// Game.prototype.buildCharacterSelect = function(){
// 	var characterSelectContainer = $("#characterSelect");
// 	// for(i = 0; i < this.characters.length; i++){
// 	// 	this.buildCharacterCard(characterSelectContainer, this.characters[i]);
// 	// }
// 	for (var id in this.characters) {
// 	  //if (this.characters.hasOwnProperty(id)) {
// 	    this.buildCharacterCard(characterSelectContainer, id, this.characters[id]);
// 	  //}
// 	}
// }


/************************************************************************************
Executed Code and Event Listeners
************************************************************************************/
//must decide if it's worth it to have both a game and a game session object
// var myCharacters = [
// 	new Character("luke-skywalker", "Luke Skywalker", 100, 10, 5, "assets/images/lukeSkywalker.jpg"),
// 	new Character("obi-wan-kenobi", "Obi-Wan Kenobi", 50, 20, 20, "assets/images/obiWanKenobi.jpg"),
// 	new Character("yoda", "Yoda", 50, 30, 5, "assets/images/yoda.jpg"),
// ];

//this seems dumb (could possible identify characters as indices in an array, avoids this for-loop)
// var myCharactersObj = {};
// for(i = 0; i < myCharacters.length; i++){
// 	myCharactersObj[myCharacters[i].getCharId()] = myCharacters[i];
// }

var myCharactersObj = {
	"luke-skywalker" : new Character("Luke Skywalker", 100, 10, 5, "assets/images/lukeSkywalker.jpg"),
	"obi-wan-kenobi" : new Character("Obi-Wan Kenobi", 50, 20, 20, "assets/images/obiWanKenobi.jpg"),
	"yoda" : new Character("Yoda", 50, 30, 5, "assets/images/yoda.jpg"),
}

var game = {
	characters : myCharactersObj,
	playing : false,
	hero : undefined,
	enemies : undefined,
	defendingCharacter : undefined,

	buildCharacterInformationDiv: function(parent, information){
		var info = $("<div>");
		info.addClass("infoContainer");
		info.html(information);
		parent.append(info);
	},

	buildCharacterCard: function(parent, id, character){
		var card = $("<div>");
		card.addClass("myCard");
		card.attr("data-character", id);

		var cardWrapper = $("<div>");
		cardWrapper.addClass("cardWrapper");

		var imageWrapper = $("<div>");
		imageWrapper.addClass("imageWrapper");

		var image = $("<img>");
		image.addClass("characterImage");
		image.attr("src", character.getImageSource());
		image.attr("alt", character.getName());
		imageWrapper.append(image);

		var characterInformation = $("<div>");
		characterInformation.addClass("characterInformation");
		this.buildCharacterInformationDiv(characterInformation, character.health);
		this.buildCharacterInformationDiv(characterInformation, character.attackPower);
		this.buildCharacterInformationDiv(characterInformation, character.getCounterAttackPower());

		cardWrapper.append(imageWrapper);
		cardWrapper.append(characterInformation);
		card.append(cardWrapper);
		parent.append(card);

	},

	buildCharacterSelect: function(){
		var characterSelectContainer = $("#characterSelect");
		for (var id in this.characters) {
		    this.buildCharacterCard(characterSelectContainer, id, this.characters[id]);
		}
	},
};

//var myGameSession = new GameSession(false,undefined,undefined);
//var myGame = new Game(myGameSession,myCharactersObj);
game.buildCharacterSelect();

//will there be issues with DOM loading like this?
$( document ).ready(function() {
    $(".myCard").on("click", function(){
    	var myEnemies = [];
    	var myId = $(this).attr("data-character");
    	game.playing = true;
    	for (var id in game.characters) {
			if (game.characters.hasOwnProperty(id)) {
				if(myId === id) {
			    	game.hero = game.characters[id];
			  	} else {
			  		myEnemies.push(game.characters[id]);
			  	}
			}
		}
    	game.enemies = myEnemies;
    	console.log(game);
    	//start playing with gameSession
    });
});