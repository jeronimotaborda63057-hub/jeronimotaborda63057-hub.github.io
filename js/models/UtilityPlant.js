class UtilityPlant extends Building {
    static number = 1;
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, productionType, productionAmount) {
        super(id, name+"-"+UtilityPlant.number++, cost, electricityConsumption, waterConsumption, x, y);
        // productionType: "electricity" o "water"
        this._productionType   = productionType   || "electricity";
        this._productionAmount = productionAmount ?? 0;
    }

    // ============ SETTERS ============

    set productionType(value) {
        if (value === "electricity" || value === "water") {
            this._productionType = value;
        }
    }

    set productionAmount(value) {
        if (value >= 0) this._productionAmount = value;
    }
}