class Park extends Building {
    static number = 1;
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, happinessBonus) {
        super(id, name+"-"+Park.number++, cost, electricityConsumption, waterConsumption, x, y);
        this._happinessBonus = happinessBonus ?? 0;
    }

    //========SETTERS============
    set happinessBonus(happinessBonus) {
        if (happinessBonus >= 0) {
            this._happinessBonus = happinessBonus;
        }
    }
}