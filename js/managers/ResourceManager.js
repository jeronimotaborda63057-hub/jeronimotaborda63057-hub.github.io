class ResourceManager {
    constructor(money, electricity, electricityProduction, electricConsumption,
        water, waterProduction, waterConsumption, food) {

        this._money = money ?? 50000;
        this._electricity = electricity ?? 0;
        this._electricityProduction = electricityProduction ?? 0;
        this._electricConsumption = electricConsumption ?? 0;
        this._water = water ?? 0;
        this._waterProduction = waterProduction ?? 0;
        this._waterConsumption = waterConsumption ?? 0;
        this._food = food ?? 0;
    }

    // ============ SETTERS ============

    set money(value) {
        if (value >= 0) {

            this._money = value;
        }
    }

    set electricity(value) {
        if (value >= 0) {
            this._electricity = value;
        }
    }
    set electricityProduction(value) {
        if (value >= 0) {
            this._electricityProduction = value;
        }
    }
    set electricConsumption(value) {
        if (value >= 0) {
            this._electricConsumption = value;
        }
    }
    set water(value) {
        if (value >= 0) {
            this._water = value;
        }
    }
    set waterProduction(value) {
        if (value >= 0) {
            this._waterProduction = value;
        }
    }
    set waterConsumption(value) {
        if (value >= 0) {
            this._waterConsumption = value;
        }
    }
    set food(value) {
        if (value >= 0) {
            this._food = value;
        }
    }

    get electricity(){
        return this._electricity;
    }

    get electricityBalance() {
        return this._electricityProduction - this._electricConsumption;
    }

    get electricityProduction(){
        return this._electricityProduction;
    }

    get electricityConsumption(){
        return this._electricityConsumption
    }

    get water(){
        return this._water;
    }

    get waterBalance() {
        return this._waterProduction - this._waterConsumption;
    }

    get waterProduction(){
        return this._waterProduction;
    }

    get waterConsumption(){
        return this._waterConsumption
    }

    get money() {
        return this._money;
    }

    get food() {
        return this._food;
    }

    // ============ MÉTODOS ============

    // ¿Hay suficiente dinero para construir edificio?
    canAfford(building) {
        if (this._money >= building._cost) {
            return true;
        };
        return false;
    }

    // Gastar dinero (al construir un edificio o vía)
    // Retorna true si pudo gastar, false si no alcanzaba el dinero
    spendMoney(building) {
        if (building._cost > 0 && this.canAfford(building)) {
            this._money -= building._cost;
            return true;
        }
        return false;
    }

    // Sumar ingresos al dinero total
    addIncome(amount) {
        if (amount > 0) {
            this._money += amount;
        }
    }

    // Método principal: se llama cada turno desde TurnSystem.
    // Recorre todos los edificios, calcula qué producen y qué consumen,
    // y actualiza todos los recursos de la ciudad.
    updateResources(buildings) {
        let totalElectricityProduction = 0;
        let totalElectricityConsumption = 0;
        let totalWaterProduction = 0;
        let totalWaterConsumption = 0;
        let totalFoodProduction = 0;
        let totalIncome = 0;

        buildings.forEach(building => {

            // Todos los edificios consumen electricidad y agua (los parques consumen 0)
            totalElectricityConsumption += building._electricityConsumption || 0;
            totalWaterConsumption += building._waterConsumption || 0;

            // Plantas de utilidad: producen electricidad o agua
            if (building instanceof UtilityPlant) {
                if (building._productionType === "electricity") {
                    totalElectricityProduction += building._productionAmount || 0;
                } else if (building._productionType === "water") {
                    totalWaterProduction += building._productionAmount || 0;
                }
            }

            // Edificios comerciales: generan dinero solo si hay electricidad
            if (building instanceof CommercialBuilding) {
                const thereIsElectricity = (totalElectricityProduction - totalElectricityConsumption) >= 0;
                if (thereIsElectricity) {
                    totalIncome += building._incomePerTurn || 0;
                }
            }

            // Edificios industriales: fábricas (dinero) o granjas (comida)
            if (building instanceof IndustrialBuilding) {
                const thereIsElectricity = (totalElectricityProduction - totalElectricityConsumption) >= 0;
                const thereIsWater = (totalWaterProduction - totalWaterConsumption) >= 0;

                if (building._productionType === "money") {
                    // Fábrica: necesita electricidad Y agua
                    if (thereIsElectricity && thereIsWater) {
                        totalIncome += building._incomePerTurn || 0;
                    }
                } else if (building._productionType === "food") {
                    // Granja: solo necesita agua
                    if (thereIsWater) {
                        totalFoodProduction += building._incomePerTurn || 0;
                    } 
                }
            }
        });

        // Guardamos los totales de producción y consumo
        this._electricityProduction = totalElectricityProduction;
        this._electricConsumption = totalElectricityConsumption;
        this._waterProduction = totalWaterProduction;
        this._waterConsumption = totalWaterConsumption;

        // El stock nunca baja de 0 (Math.max hace que no sea negativo)
        // Si el balance es negativo, checkGameOver() lo detecta aparte
        this._electricity = Math.max(0, this._electricity + totalElectricityProduction - totalElectricityConsumption);
        this._water = Math.max(0, this._water + totalWaterProduction - totalWaterConsumption);

        // La comida se acumula turno a turno
        this._food += totalFoodProduction;

        // Sumamos los ingresos al dinero total
        this.addIncome(totalIncome);
    }

    // Verifica si el juego debe terminar.
    // Según el documento: electricidad o agua en balance negativo = game over.
    checkGameOver() {
        if (this._electricity <= 0 && this._electricConsumption > 0) {
            return {
                gameOver: true,
                reason: "¡Te quedaste sin electricidad!"
            };
        }
        if (this._water <= 0 && this._waterConsumption > 0) {
            return {
                gameOver: true,
                reason: "¡Te quedaste sin agua!"
            };
        }
        return {
            gameOver: false
        };
    }
}