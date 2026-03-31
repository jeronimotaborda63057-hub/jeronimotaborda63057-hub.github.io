class City {
    constructor(name, mayor, regionLat, regionLon, width, height, score, hapinessAverage, grid) {
        this._name = name || "";
        this._mayor = mayor || "";
        this._regionLat = regionLat ?? 0;
        this._regionLon = regionLon ?? 0;
        this._width = width ?? 0;
        this._height = height ?? 0;
        this._score = score ?? 0;
        this._hapinessAverage = hapinessAverage ?? 0;
        this._grid = grid;

        // Managers: cada uno controla un aspecto de la ciudad
        this._buildingManager = new BuildingManager();
        this._citizenManager = new CitizenManager();
        this._resourceManager = new ResourceManager();
        this._scoreManager = new ScoreManager(this._buildingManager, this._citizenManager, this._resourceManager);
        this._turnSystem = null;
    }

    // ============ GETTERS (delegados a los managers) ============
    get name(){
        return this._name;
    }

    get mayor(){
        return this._mayor;
    }

    get buildingManager() {
        return this._buildingManager;
    }

    get resourceManager(){
        return this._resourceManager;
    }

    get citizenManager(){
        return this._citizenManager;
    }

    get scoreManager(){
        return this._scoreManager;
    }

    get turnSystem(){
        return this._turnSystem;
    }

    get population() {
        return this.citizenManager.population;
    }

    get buildings() {
        return this.buildingManager.buildings;
    }

    get grid(){
        return this._grid;
    }

    get score() {
        return this.scoreManager.score;
    }

    get happinessAverage() {
        return this.citizenManager.happinessAverage;
    }

    get money(){
        return this.resourceManager.money;
    }

    get electricity(){
        return this.resourceManager.electricity;
    }

    get water() {
        return this.resourceManager.water;
    }

    get food() {
        return this.resourceManager.food;
    }

    get turnDuration(){
        return this.turnSystem.turnDuration ?? 5;
    }

    // ============ SETTERS ============
    set population(population){
        this._citizenManager.population = population;
    }

    set grid(grid){
        this._grid = grid;
    }

    set regionLat(value) {
            this._regionLat = value;
    }
    set regionLon(value) {
            this._regionLon = value;
    }
    set width(value) {
        if (value >= 0) {
            this._width = value;
        }
    }
    set height(value) {
        if (value >= 0) {
            this._height = value;
        }
    }
    set score(value) {
        if (value >= 0) {
            this._score = value;
        }
    }

    set growthRate(number) {
        if(number>0){
            this.citizenManager.growthRate = number;
        }
    }

    set turnSystem(turnSystem){
        this._turnSystem = turnSystem;
    }

    set electricity(electricity){
        this.resourceManager.electricity = electricity;
    }

    set water(water){
        this.resourceManager.water = water; 
    }

    set food(food){
        this.resourceManager.food = food;
    }

    set name(name){
        this._name = name;
    }

    set mayor(mayor){
        this._mayor = mayor;
    }

    canAfford(building){
        return this.resourceManager.canAfford(building);
    }

    spendMoney(building){
        return this.resourceManager.spendMoney(building);
    }

    startTurn(){
        this.turnSystem.start();
    }

    stopTurn(){
        this.turnSystem.stop();
    }

    calculateHappiness(){
        return this.citizenManager.calculateHappiness(this.buildings);
    }

    calculateScore(){
        return this.scoreManager.calculateScore();
    }

    updateResources(){
        return this.resourceManager.updateResources(this.buildings)
    }

    growPopulation(){
        return this.citizenManager.growPopulation(this.buildings);
    }

    assignJobs(){
        this.citizenManager.assignJobs(this.buildings);
    }

    assignHomes(){
        this.citizenManager.assignHomes(this.buildings);
    }

    checkGameOver(){
        return this.resourceManager.checkGameOver();
    }

    deleteBuilding(x,y){
        this.buildingManager.deleteBuilding(x, y);
    }

    addBuilding(building){
        this.buildingManager.addBuilding(building);
    }

    setCellId(x,y,string){
        this.grid.setCellId(x,y,string);
    }

    
    toJSON() {
        return {
            _name: this._name,
            _mayor: this._mayor,
            _regionLat: this._regionLat,
            _regionLon: this._regionLon,
            _width: this._width,
            _height: this._height,
            _score: this._scoreManager._score,
            _hapinessAverage: this._citizenManager.hapinessAverage,
            _grid: this._grid,
            _roads: this._roads,
            _buildingManager: this._buildingManager,
            _citizenManager: this._citizenManager,
            _resourceManager: this._resourceManager,
            _scoreManager: this._scoreManager,
            _turnSystem: this._turnSystem
        };
    }
}
