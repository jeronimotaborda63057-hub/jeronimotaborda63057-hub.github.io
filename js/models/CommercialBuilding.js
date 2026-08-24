class CommercialBuilding extends Building {
    static number = 1;
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, jobs, incomePerTurn) {
        super(id, name + "-" + CommercialBuilding.number++, cost, electricityConsumption, waterConsumption, x, y);
        this._jobs = jobs ?? 0;
        this._incomePerTurn = incomePerTurn ?? 0;
    }

    //=========SETTERS===========

    set jobs(jobs) {
        if (jobs >= 0) {
            this._jobs = jobs;
        }
    }

    set incomePerTurn(incomePerTurn) {
        if (incomePerTurn >= 0) {
            this._incomePerTurn = incomePerTurn;
        }
    }
}