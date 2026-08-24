class IndustrialBuilding extends Building {
    static number = 1;
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, jobs, productionType, incomePerTurn) {
        super(id, name+"-"+IndustrialBuilding.number++, cost, electricityConsumption, waterConsumption, x, y);
        this._jobs             = jobs             ?? 0;
        // productionType: "money" (fábrica) o "food" (granja)
        this._productionType   = productionType   || "money";
        this._incomePerTurn    = incomePerTurn    ?? 0;   // para fábricas
        this._employeesCount   = 0;
    }

    // ============ SETTERS ============

    set jobs(value) {
        if (value >= 0) this._jobs = value;
    }

    set productionType(value) {
        if (value === "money" || value === "food") {
            this._productionType = value;
        }
    }

    set incomePerTurn(value) {
        if (value >= 0) this._incomePerTurn = value;
    }

    set productionAmount(value) {
        if (value >= 0) this._productionAmount = value;
    }

    set employeesCount(value) {
        if (value >= 0 && value <= this._jobs) this._employeesCount = value;
    }
}