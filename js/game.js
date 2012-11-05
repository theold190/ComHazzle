var DEBUG = 0;

Crafty.c("Game", {
    init: function() {
        this.addComponent("KeyboardEvent");
        this._board = Crafty.e("Board");
        this.bind('KeyDown', function(e) {
            this._moveTile(e.key);
        });
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
        }
    }
});
