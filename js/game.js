var DEBUG = 0;

var DIFFICULTY_EASY = 5;
var DIFFICULTY_MEDIUM = 10;
var DIFFICULTY_HARD = 15;
var DIFFICULTY_IMPOSSIBLE = 30;

Crafty.c("Game", {
    init: function() {
        this._difficulty = DIFFICULTY_EASY;
        this.addComponent("KeyboardEvent");
        this._board = Crafty.e("Board");
        var cell = this._board._getRandomCell();
        cell._clearCell();
        this._randomize();

        this.bind('KeyDown', function(e) {
            if (this._moveTile(e.key)) {
                var score = this._getScore();
                if (score == this._board._getBoardSize()) {
                    alert("You won!");
                }
            }
        });
    },
    _randomize: function() {
        var count = 0;
        while (count < this._difficulty) {
            var cell = this._board._getEmptyCell();
            var direction = Crafty.math.randomInt(0, 3);
            var other;
            switch (direction) {
                case 0: other = this._board._getCellOnRight(cell); break;
                case 1: other = this._board._getCellOnLeft(cell); break;
                case 2: other = this._board._getCellOnTop(cell); break;
                case 3: other = this._board._getCellOnBottom(cell); break;
            }
            if (other != undefined) {
                this._board._swapCells(cell, other);
                count++;
            }
        }
    },
    _getScore: function() {
        var size = this._board._getBoardSize();
        var index = 0;
        var score = 0;
        while(index < size) {
            var cell = this._board._getCellByIndex(index);
            if (cell._index == index) {
                score++;
            }
            index++;
        }
        return score;
    },
    _moveTile: function(key) {
        var cell = this._board._getEmptyCell();
        var other;        
        if(key == Crafty.keys['LEFT_ARROW']) {
            other = this._board._getCellOnRight(cell);
        } else if (key == Crafty.keys['RIGHT_ARROW']) {
            other = this._board._getCellOnLeft(cell);
        } else if (key == Crafty.keys['UP_ARROW']) {
            other = this._board._getCellOnBottom(cell);
        } else if (key == Crafty.keys['DOWN_ARROW']) {
            other = this._board._getCellOnTop(cell);
        }
        if (other != undefined) {
            this._board._swapCells(cell, other);
            return true;
        }
        return false;
    }
});
