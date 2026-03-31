class CitizenManager {
    constructor() {
        this._population = [];
        this._growthRate = 3;
    }

    // ============ GETTERS ============

    get population() {
        return this._population;
    }
    get totalCitizens() {
        return this._population.length;
    }
    get growthRate() {
        return this._growthRate;
    }

    get happinessAverage() {
        if (this.population.length === 0) return 0;
        const total = this.population.reduce((suma, c) => suma + c._happiness, 0);
        return Math.round(total / this.population.length);
    }

    get employedCount() {
        return this.population.filter(c => c._hasJob).length;
    }

    get unemployedCount() {
        return this.population.filter(c => !c._hasJob).length;
    }

    // ============ SETTERS ============
    set population(population) {
        this._population = population;
    }

    set growthRate(value) {
        if (value > 0) this._growthRate = value;
    }

    // ============ MÉTODOS ============

    addCitizen(citizen) {
        this.population.push(citizen);
    }

    deleteCitizen(id) {
        const cantidadInicial = this.population.length;
        this.population = this.population.filter(citizen => citizen._id !== id);
        return this.population.length < cantidadInicial;
    }

    createCitizen(id, happiness, hasHome, hasJob) {
        const citizen = new Citizen(id, happiness, hasHome, hasJob);
        this.addCitizen(citizen);
        return citizen;
    }

    calculateHappiness(buildings) {
        let happinessBonus = 0;

        buildings.forEach(building => {
            if (building instanceof ServiceBuilding || building instanceof Park) {
                happinessBonus += building._happinessBonus || 0;
            }
        });

        this.population.forEach(citizen => {
            let happiness = 0; 
            // Factores positivos
            if (citizen._hasHome) happiness += 20;
            if (citizen._hasJob) happiness += 15;
            // Factores negativos
            if (!citizen._hasHome) happiness -= 20;
            if (!citizen._hasJob) happiness -= 15;
            happiness += happinessBonus;
            citizen._happiness = Math.min(100, Math.max(0, happiness));
        });
        return this.happinessAverage;
    }

    assignHomes(buildings) {
        const residentials = buildings.filter(b => b instanceof ResidentialBuilding);

        this.population.forEach(citizen => {
            if (!citizen._hasHome) {
                const building = residentials.find(b => b._residents < b._capacity);
                if (building) {
                    building._residents++;
                    citizen._hasHome = true;
                }
            }
        });
    }

    assignJobs(buildings) {
        const commercials = buildings.filter(b => b instanceof CommercialBuilding);
        const industrials = buildings.filter(b => b instanceof IndustrialBuilding);
        const buildingsWithJobs = [...commercials, ...industrials];

        this.population.forEach(citizen => {
            if (!citizen._hasJob) {
                const building = buildingsWithJobs.find(building => building._employeesCount < building._jobs);
                if (building) {
                    building._employeesCount = (building._employeesCount || 0) + 1;
                    citizen._hasJob = true;
                }
            }
        });
    }

    growPopulation(buildings) {
    const thereIsHouse = this.thereIsResidentialCapacity(buildings);
    const thereIsJob = this.thereIsJobAvailability(buildings);
    const happinessOk = this.population.length === 0 ? true : this.happinessAverage > 60;

    if (!thereIsHouse) {
        return;
    }
    if (!thereIsJob) {
        return;
    }
    if (!happinessOk) {
        return;
    }

    const news = Math.floor(Math.random() * this._growthRate) + 1;

    for (let i = 0; i < news; i++) {
        if (!this.thereIsResidentialCapacity(buildings)) {
            break;
        }
        this.createCitizen(`citizen`, 50, false, false);
        
    }
}

    thereIsResidentialCapacity(buildings) {
        return buildings
            .filter(b => b instanceof ResidentialBuilding)
            .some(b => b._residents < b._capacity);
    }

    thereIsJobAvailability(buildings) {
        const builds = buildings.filter(
            b => b instanceof CommercialBuilding || b instanceof IndustrialBuilding
        );
        return builds.some(b => (b._employeesCount || 0) < b._jobs);
    }

    toJSON() {
        return {
            _population: this._population,
            _growthRate: this._growthRate
        };
    }
}