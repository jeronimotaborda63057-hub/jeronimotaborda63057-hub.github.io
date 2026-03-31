class Cell {
    constructor(x, y, id) {
        this._x = x ?? 0;
        this._y = y ?? 0;
        this._id = id || "g";
    }

    get id(){
        return this._id;
    }

    get x(){
        return this._x;
    }

    get y() {
        return this._y;
    }

    set id(id){
        this._id = id;
    }

    set x(number){
        if(number > 0){
            this._x = number;
        }
    }

    set y(number){
        if(number > 0){
            this._y = number;
        }
    }
}