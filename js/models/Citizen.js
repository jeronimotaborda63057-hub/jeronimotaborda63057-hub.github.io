class Citizen {
    static number = 1;
    constructor(name, happiness, hasHome, hasJob){
        this._name = name+"-"+Citizen.number++;
        this._happiness = happiness ?? 50;
        this._hasHome = hasHome || false;
        this._hasJob = hasJob || false;
    }
}