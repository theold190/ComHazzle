var CELL_WIDTH = 140;
var CELL_HEIGHT = 140;

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

function getBgColorByIndex(index)
{
    switch(index) {
        case 0: return "#C9D695";
        case 1: return "#FAE331";
        case 2: return "#DF5548";
        case 3: return "#0183CF";
        case 4: return "#729A42";
        case 5: return "#ECA344";
        case 6: return "#DB5475";
        case 7: return "#305292";
        case 8: return "#3F7544";
        case 9: return "#DE7146";
        case 10: return "#6E3A6A";
        case 11: return "#484073";
    }
}

var CELL_TYPE_FULL = 0;
var CELL_TYPE_EMPTY = 1;

Crafty.c("Cell", {
    init: function() {
        this._type = CELL_TYPE_FULL;
        this.addComponent("2D, Canvas, Color");
        this.attr({w:CELL_WIDTH, h:CELL_HEIGHT});
        this.color("#FF0000");
    },
    _makeCell: function(x, y, color, type, index) {
        this.attr({x: x, y: y});
        this.color(color);
        this._index = index;
        this._type = type;
        return this;
    },
    _clearCell: function() {
        this._makeCell(this.x, this.y, "#FFFFFF", CELL_TYPE_EMPTY, this._index);
    },
    _isInsideCell: function(x, y) {
        if (this.x <= x && this.x+this.w > x) {
            if (this.y <= y && this.y+this.h > y) {
                return true;
            }
        }
        return false;
    }
});

Crafty.c("Board", {
    init: function() {
        this.addComponent("2D, Canvas, sprite_background");
        this._setupBoard(this.x, this.y, BOARD_ROWS, BOARD_COLS, CELL_WIDTH, CELL_HEIGHT);
        var cell = this._getRandomCell();
        cell._clearCell();
    },
    _setupBoard: function(x, y, rows, cols, cw, ch) {
        this._board = [];
        for (var i=0; i<cols; i++) {
            for (var j=0; j<rows; j++) {
                var index = getIndex(i,j);
                var cell = Crafty.e("Cell")._makeCell(x + i*cw, y + j*ch, getColorByIndex(index), CELL_TYPE_FULL, index);
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
    _getCell: function(x, y) {
        var cols = this._board.length;
        var rows = this._board[0].length;

        for (var i=0; i<cols; i++) {
            for (var j=0; j<rows; j++) {
                if(this._board[i][j]._isInsideCell(x,y)) {
                    return this._board[i][j];
                }
            }
        }
    },
    _getCellOnTop: function(cell) {
        if (cell != undefined) {
            var index = cell._index - BOARD_COLS;
            return this._board[index];
        }
    },
    _getCellOnBottom: function(cell) {
        if (cell != undefined) {
            var index = cell._index + BOARD_COLS;
            return this._board[index];
        }
    },
    _getCellOnLeft: function(cell) {
        if (cell != undefined) {
            if (cell._index % BOARD_COLS != 0) {
                return this._board[cell._index-1];
            }
        }
    },
    _getCellOnRight: function(cell) {
        if (cell != undefined) {
            if (cell._index % BOARD_COLS != BOARD_COLS - 1) {
                return this._board[cell._index+1];
            }
        }
    },
    _swapCells: function(first, second) {
        if (first == undefined
            || second == undefined) {
            return;
        }
        if (first._type == CELL_TYPE_EMPTY) {
            this._board[first._index]._makeCell(first.x, first.y, second.color(), second._type, first._index);
            this._board[second._index]._clearCell();
        }
        // TODO: do the rest
    }
});
