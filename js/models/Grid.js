class Grid {
    constructor(width, height, cells) {
        this._width = width ?? 15;
        this._height = height ?? 15;
        this._cells = cells || [];
    }

    // ===== GETTERS =====
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get cells() {
        return this._cells;

    }

    // ===== SETTERS =====
    set width(val) {
        if (val >= 15) this._width = val;
    }
    set height(val) {
        if (val >= 15) this._height = val;
    }
    set cells(cells) {
        if (cells instanceof Array) this._cells = cells;
    }

    initGrid() {
        this._cells = [];
        for (let row = 0; row < this._height; row++) {
            this._cells[row] = [];
            for (let col = 0; col < this._width; col++) {
                this._cells[row][col] = new Cell(row, col);
            }
        }
    }

    setCellId(x,y,id){
        this._cells[y][x]._id = id;
    }
}