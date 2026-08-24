class BuildingManager {
    constructor() {
        this._buildings = []
    }

    get buildings(){
        return this._buildings;
    }

    addBuilding(building) {
        this._buildings.push(building)
    }

    deleteBuilding(x, y) {
        let buildingsNumber = this._buildings.length;
        this._buildings = this._buildings.filter(building => !(building._x === x && building._y === y));
        return this._buildings.length < buildingsNumber;
    }

    createBuilding(type, x, y) {
        let building;
        switch (type) {
            case "house":
                building = new ResidentialBuilding("R1", "house", 1000, 5, 3, x, y, 4);
                break;
            case "apartment":
                building = new ResidentialBuilding("R2", "apartment", 3000, 15, 10, x, y, 12);
                break;
            case "store":
                building = new CommercialBuilding("C1", "store", 2000, 8, 8, x, y, 6, 500);
                break;
            case "commercial-center":
                building = new CommercialBuilding("C2", "commercial-center", 8000, 25, 25, x, y, 20, 2000);
                break;
            case "factory":
                building = new IndustrialBuilding("I1", "factory", 5000, 20, 15, x, y, 15, "money", 800);
                break;
            case "farm":
                building = new IndustrialBuilding("I2", "farm", 3000, 0, 10, x, y, 8, "food", 50);
                break;
            case "police-station":
                building = new ServiceBuilding("S1", "police-station", 4000, 15, 0, x, y, 5, 10);
                break;
            case "firefighter-station":
                building = new ServiceBuilding("S2", "fire-fighters", 4000, 15, 0, x, y, 5, 10);
                break;
            case "hospital":
                building = new ServiceBuilding("S3", "hospital", 6000, 20, 10, x, y, 7, 10);
                break;
            case "power-plant":
                building = new UtilityPlant("U1", "power-plant", 10000, 0, 0, x, y, "electricity", 200);
                break;
            case "water-plant":
                building = new UtilityPlant("U2", "water-plant", 8000, 20, 0, x, y, "water", 150);
                break;
            case "park":
                building = new Park("P1", "park", 1500, 0, 0, x, y, 5);
                break;
            case "road":
                building = new Road("R", "road", x, y);
                break;
        }
        return building;
    }
}