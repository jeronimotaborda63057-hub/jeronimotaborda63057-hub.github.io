class ResidentialBuilding extends Building {
    static number = 1;
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, capacity, residents) {
        super(id, name +"-"+ ResidentialBuilding.number++, cost, electricityConsumption, waterConsumption, x, y)
        this._capacity = capacity ?? 0;
        this._residents = residents ?? 0;
    }
    
    //=========SETTERS===========
    set capacity(capacity) {
        if (capacity >= 0) {
            this._capacity = capacity;
        }
    }

    set residents(residents) {
        if (residents <= capacity && residents >= 0) {
            this._residents = residents;
        }
    }
}