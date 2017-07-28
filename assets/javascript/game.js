function Character(myName, myHealth, myAttackPower, myCounterAttackPower){
	this.name = myName;
	this.health = myHealth;
	this.attackPower = myAttackPower;
	this.counterAttackPower = myCounterAttackPower;
	this.baseAttackPower = myAttackPower;
};

Character.prototype.attack = function(enemy){
	if(enemy instanceof Character){
		console.log(this.name + " is attacking " + enemy.name);
		enemy.health = enemy.health - this.attackPower;
		if(enemy.health > 0){
			this.health = this.health - enemy.counterAttackPower;
			this.attackPower = this.attackPower + this.baseAttackPower;
		}
	}
};

var luke = new Character("Luke Skywalker", 100, 10, 10);
var obiWanKenobi = new Character("Obi-Wan Kenobi", 50, 20, 20);
luke.attack(obiWanKenobi);
console.log(luke);
console.log(obiWanKenobi);

$( document ).ready(function() {
    
});