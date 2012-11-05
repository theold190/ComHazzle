var CELL_WIDTH = 142;
var CELL_HEIGHT = 142;

var BOARD_ROWS = 3;
var BOARD_COLS = 4;

function getIndex(i, j)
{
    return i + j * BOARD_COLS;
}

function getColorByIndex(index)
{
    switch(index) {
        case 0: return "#B2DB11";
        case 1: return "#FFFF00";
        case 2: return "#FF0000";
        case 3: return "#00A0C6";
        case 4: return "#66B821";
        case 5: return "#FFB200";
        case 6: return "#F0027F";
        case 7: return "#0A50A1";
        case 8: return "#008837";
        case 9: return "#FF6600";
        case 10: return "#81017E";
        case 11: return "#13007C";
    }
}

var CELL_TYPE_FULL = 0;
var CELL_TYPE_EMPTY = 1;

Crafty.c("Cell", {
    init: function() {
        this._type = CELL_TYPE_FULL;
        this.addComponent("2D, DOM, Color");
        this.attr({w:CELL_WIDTH, h:CELL_HEIGHT});
        this.color("#FF0000");

        if (DEBUG) {
            this.addComponent("Text");
            this.css({textAlign: 'center'});
            this.textFont({size: '50px', family: 'Arial'});
        }
    },
    _updateShape: function(index) {
        this.css({"border-radius": ""});
        switch(this._index) {
            case 0: this.css({"border-top-left-radius": "40px"}); break;
            case 3: this.css({"border-top-right-radius": "40px"}); break;
            case 8: this.css({"border-bottom-left-radius": "40px"}); break;
            case 11: this.css({"border-bottom-right-radius": "40px"}); break;
        }
    },
    _makeCell: function(x, y, color, type, index) {
        this.attr({x: x, y: y});
        this.color(color);
        this._index = index;

        if (DEBUG) {
            this.text(index);
        }

        this._type = type;
        if (this._type == CELL_TYPE_EMPTY) {
            this.alpha = 0.5;
        } else {
            this.alpha = 1.0;
        }

        return this;
    },
    _clearCell: function() {
        this._makeCell(this.x, this.y, "#FFFFFF", CELL_TYPE_EMPTY, this._index);
    },
    _isInsideCell: function(x, y) {
        return this.contains(x, y, 1, 1);
    }
});

Crafty.c("Board", {
    init: function() {
        this.addComponent("2D, DOM");
        this._setupBoard(15, 15, BOARD_ROWS, BOARD_COLS, CELL_WIDTH, CELL_HEIGHT);
    },
    _setupBoard: function(x, y, rows, cols, cw, ch) {
        this._board = [];
        for (var i=0; i<cols; i++) {
            for (var j=0; j<rows; j++) {
                var index = getIndex(i,j);
                var cell = Crafty.e("Cell")._makeCell(x + i*cw, y + j*ch, getColorByIndex(index), CELL_TYPE_FULL, index);
                cell._updateShape(index);
                this._board[index] = cell;
            }
        }
    },
    _getRandomCell: function() {
        var length = this._board.length;
        var cell;

        var index = Crafty.math.randomInt(0, length-1);
        return this._board[index];
    },
    _getEmptyCell: function() {
        var length = this._board.length;
        for (var i=0; i<length; i++) {
            if(this._board[i]._type == CELL_TYPE_EMPTY) {
                return this._board[i];
            }
        }
    },
    _getBoardSize: function() {
        return this._board.length;
    },
    _getCellByIndex: function(index) {
        return this._board[index];
    },
    _getCellByCoords: function(x, y) {
        var length = this._board.length;

        for (var i=0; i<length; i++) {
            if(this._board[i]._isInsideCell(x,y)) {
                return this._board[i];
            }
        }
    },
    _getCellOnTop: function(cell) {
        return this._getCellByCoords(cell.x, cell.y-CELL_HEIGHT);
    },
    _getCellOnBottom: function(cell) {
        return this._getCellByCoords(cell.x, cell.y+CELL_HEIGHT);
    },
    _getCellOnLeft: function(cell) {
        return this._getCellByCoords(cell.x-CELL_WIDTH, cell.y);
    },
    _getCellOnRight: function(cell) {
        return this._getCellByCoords(cell.x+CELL_WIDTH, cell.y);
    },
    _swapCells: function(first, second) {
        if (first == undefined
            || second == undefined) {
            return;
        }
        var x = first.x;
        var y = first.y;
        var color = first.color();
        var type = first._type;
        var index = first._index;

        first._makeCell(first.x, first.y, second.color(), second._type, second._index);
        second._makeCell(second.x, second.y, color, type, index);
    }
});
