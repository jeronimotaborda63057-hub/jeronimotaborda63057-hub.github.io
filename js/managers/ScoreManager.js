class ScoreManager {
    constructor(buildingManager, citizenManager, resourceManager) {
        this._buildingManager = buildingManager || null;
        this._citizenManager = citizenManager || null;
        this._resourceManager = resourceManager || null;
        this._score = 0;
    }

    get score() {
        return this._score;
    }
    allHasJob() {
        return this._citizenManager._population.every(c => c._hasJob);
    }

    withoutJob() {
        return this._citizenManager._population.filter(c => !c._hasJob);
    }

    citizensValidation() {
        return this._citizenManager._population.length > 1000;
    }

    positiveResources() {
        return (
            this._resourceManager.electricityBalance > 0 &&
            this._resourceManager.waterBalance > 0 &&
            this._resourceManager._money > 0
        );
    }

    calculateBonus() {
        let bonus = 0;
        if(this._citizenManager.population.length === 0){
            return 0;
        }
        if (this.allHasJob()) {
            bonus += 500;
        }
        if (this.positiveResources()) {
            bonus += 200;
        }
        if (this.citizensValidation()) {
            bonus += 1000;
        }
        if (this._citizenManager.happinessAverage > 80) {
            bonus += 300;
        }
        return bonus;

    }

    calculatePenalization() {
        let penalization = 0;
        if(this._citizenManager.population.length === 0){
            return 0;
        }
        if (this._resourceManager._money < 0) {
            penalization += 500;
        }
        if (this._resourceManager.electricityBalance < 0) {
            penalization += 300;
        }
        if (this._resourceManager.waterBalance < 0) {
            penalization += 300;
        }
        if (this._citizenManager.happinessAverage < 40) {
            penalization += 400;
        }
        penalization += this.withoutJob().length * 10;
        return penalization;
    }

    calculateScore() {
        //Tenemos que resetear el score cada vez que lo calculemos
        this._score = 0;
        //Esta validacion para calcular realmente cuanto dinero ganó el usuario debido a que si no se hace el score inicial es 600 sin hacer nada
        const moneyGained = this._resourceManager.money - 50000;
        this._score += moneyGained > 0 ? moneyGained * 0.01 : 0;
        this._score += this._citizenManager.population.length * 10;
        this._score += this._citizenManager.happinessAverage * 5;
        this._score += this._buildingManager.buildings.length * 50;
        this._score += this._resourceManager.electricityBalance * 2;
        this._score += this._resourceManager.waterBalance * 2;
        this._score += this.calculateBonus() - this.calculatePenalization();
        return this._score;
    }

}