var number = [1,2,3];
var color = ["Red", "Purple", "Green"];
var shape = ["Squiggles", "Diamonds", "Ovals"];
var shade = ["Solid", "Striped", "Empty"];

function getDeck(paramArray) {
  function addTo(curr, args) {
    var i, copy, 
        rest = args.slice(1),
        last = !rest.length,
        result = [];
    for (i = 0; i < args[0].length; i++) {
      copy = curr.slice();
      copy.push(args[0][i]);
      if (last) {
        result.push(copy);
      } else {
        result = result.concat(addTo(copy, rest));
      }
    }
    return result;
  }
  return addTo([], Array.prototype.slice.call(arguments));
};

function isSet(combo) {
	if (!(combo[0] && combo[1] && combo[2])) {
		return false;
	}
	for (var i = 0; i < combo[0].length; i++) {
		var a = combo[0][i];
		var b = combo[1][i];
		var c = combo[2][i];
		if ( (a==b && (b!=c)) || (a==c && (b!=c)) || (b==c && (b!=a)) ) {
			return false;
		}
	}
	return true;
};

Array.prototype.shuffle = function() {
	var i = this.length, j, temp;
	while(--i > 0) {
		j = Math.floor(Math.random() * (i+1));
		temp = this[j];
		this[j] = this[i];
		this[i] = temp;
	}
};
var deck = getDeck(shade, shape, color, number);
var imageMap = {};
for (var i = 0; i < deck.length; i++) {
	console.log(deck[i]);
	var num = (i+1 < 10) ? ("0" + (i+1)) : (i+1);
	imageMap[deck[i]] = "images/" + num + ".gif";
}
for (var i = 0; i < deck.length; i++) {
	console.log(imageMap[deck[i]]);
}
deck.shuffle();

function Game(deck, handsize) {
	this.deck = deck;
	this.handsize = handsize;
	this.hand = this.getHand();
	this.sets = this.getSetsInHand();
	this.setSize = 3;
	this.cardMap = this.generateMap();
	this.selections = [];
	this.count = 100;
	this.score = 0;
};

Game.prototype.generateMap = function() {
	var cardMap = {};
	for (var i = 0; i < this.handsize; i++) {
		cardMap['card_'+i] = this.hand[i];
		//cardMap[this.hand[i]] = 'card_'+i;
	}
	return cardMap;
}
Game.prototype.getHand = function() {
	var hand = [];
	for (var i = 0; i < this.handsize; i++) {
		hand.push(this.deck.pop());
		console.log(this.deck.length)
	};
	return hand;
};

Game.prototype.getSetsInHand = function() {
	var sets = [];
	for (var i = 0; i < this.hand.length; i++) {
		for (var j = i+1; j < this.hand.length; j++) {
			for (var k = j+1; k < this.hand.length; k++) {
				if (isSet([this.hand[i], this.hand[j], this.hand[k]])) {
					sets.push([this.hand[i], this.hand[j], this.hand[k]])
				}
			}
		}
	}
	return sets;
};

Game.prototype.updateHand = function(indices) {
	if (this.deck.length != 0) {
		for (var i = 0; i < 3; i++) {
			var index = this.hand.indexOf(this.cardMap[indices[i]]);
			var new_card = this.deck.pop();
			this.hand[index] = new_card;
			this.cardMap[indices[i]] = new_card;
			var elem = document.getElementById(indices[i]);
			elem.innerHTML = '<img src="'+imageMap[this.cardMap[indices[i]]]+'">';
		};
	};
	while (this.getSetsInHand().length == 0) {
		var board = document.getElementById('board');
		board.style.width = 666+'px';
		var start = this.hand.length;
		for (var i = start; i < start + 3; i++) {
			var new_card = this.deck.pop();
			this.hand.push(new_card);
			this.cardMap['card_'+i] = this.hand[i];
			var iDiv = document.createElement('div');
			iDiv.id = 'card_'+i;
			//console.log('hi');
			board.appendChild(iDiv);
			iDiv.addEventListener('mousedown', select, false);
			iDiv.innerHTML = '<img src="'+imageMap[this.cardMap[iDiv.id]]+'">';
		}
	}
	console.log(this.getSetsInHand());
};
Game.prototype.start = function() {
	var board = document.getElementById('board');
	board.innerHTML = "<p>Click anywhere</p>"
	board.addEventListener('click', startGame, false);

};
Game.prototype.drawBoard = function() {
	var board = document.getElementById('board');
	board.addEventListener('mouseup', check, false);
	for (var i = 0; i < this.hand.length; i++) {
		var iDiv = document.createElement('div');
		iDiv.id = 'card_'+i;
		board.appendChild(iDiv);
		iDiv.addEventListener('mousedown', select, false);
		iDiv.innerHTML = '<img src="'+imageMap[this.cardMap[iDiv.id]]+'">';
	};
	window.setInterval(showCount, 1000);
};




