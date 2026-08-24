class Road {
    static number = 1;
    constructor(id, name, x, y) {
        this._id = id || null;
        this._name = name+"-"+Road.number++;
        this._cost = 100;
        this._x = x;
        this._y = y;
    }

    //==========SETTERS=============
    get id(){
        return this._id;
    }

    set id(id){
        this._id = id;
    }
    set x(x) {
        if (x >= 0) {
            this._x = x;
        }
    }
    set y(y) {
        if (y >= 0) {
            this._y = y;
        }
    }

}