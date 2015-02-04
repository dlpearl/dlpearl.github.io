function check() {
	if (game.selections.length == 3) {
		if (isSet(game.selections.map(function(arr){return arr[0]}))) {
			game.updateHand(game.selections.map(function(arr){return arr[1]}));
			game.drawBoard;
			game.score++;
		};
		for (var i = 0; i < 3; i++) {
			document.getElementById(game.selections[i][1]).style.opacity = 1;
		};
		while(game.selections.length > 0) {
			game.selections.pop();
		};
	};
};
function select() {
	if (this.style.opacity == 0.8) {
		this.style.opacity = 1
		index = function (arr, elem) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][0][0] == elem[0] &&
					arr[i][0][1] == elem[1] &&
				    arr[i][0][2] == elem[2] &&
					arr[i][0][3] == elem[3])
					{ return i };
			}
			return -1;
		}(game.selections, game.cardMap[this.id]);
		if (index > -1) {
			game.selections.splice(index, 1);
		}
	} else {
		this.style.opacity = 0.8;
		game.selections.push([game.cardMap[this.id], this.id])
	}
};
function startGame() {
	var text = document.getElementsByTagName('p')[0];
	text.parentNode.removeChild(text);
	document.getElementById('board').removeEventListener('click', startGame, false);
	game.drawBoard();

}
var game = new Game(deck, 12);
function showCount() {
	var text = document.getElementById('timer');
	text.innerHTML = game.count.toFixed(2)+"     Your score is: "+game.score;
	game.count -= 0.01;
	if (game.count < 0) {
		text.innerHTML = "Game Over";
	}
}

game.start();
//window.requestAnimationFrame(tick);