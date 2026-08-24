class ServiceBuilding extends Building {
    static number = 1;
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, radius, happinessBonus) {
        super(id, name+"-"+ServiceBuilding.number++, cost, electricityConsumption, waterConsumption, x, y);
        this._radius = radius ?? 0;
        this._happinessBonus = happinessBonus ?? 0;
    }

    //==========SETTERS==============

    set radius(radius) {
        if (radius >= 5) {
            this._radius = radius;
        }
    }

    set happinessBonus(happinessBonus) {
        if (happinessBonus >= 0){
            this._happinessBonus = happinessBonus;
        }
    }
}