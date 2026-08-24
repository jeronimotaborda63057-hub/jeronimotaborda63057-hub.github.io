class CityBuilderStorage {

    static keyCity = "city"

    static save(object, key) {
        localStorage.setItem(key, JSON.stringify(object));
    }

    static loadCity() {
        let cityData = localStorage.getItem(this.keyCity);
        if (!cityData) return null;

        const parsed = JSON.parse(cityData);
        // Reconstruir el grid
        const grid = new Grid(parsed._width, parsed._height);
        grid.initGrid();

        // Restaurar los ids de las celdas
        for (let row = 0; row < parsed._grid._cells.length; row++) {
            for (let col = 0; col < parsed._grid._cells[row].length; col++) {
                const savedCell = parsed._grid._cells[row][col];
                if (savedCell._id !== "g") {
                    grid._cells[row][col]._id = savedCell._id;
                }
            }
        }

        // Reconstruir la ciudad con las propiedades correctas
        const city = new City(
            parsed._name,
            parsed._mayor,
            parsed._regionLat,
            parsed._regionLon,
            parsed._width,
            parsed._height,
            parsed._score,
            parsed._hapinessAverage,
            grid
        );

        // Restaurar buildings
        if (parsed._buildingManager && parsed._buildingManager._buildings) {
            parsed._buildingManager._buildings.forEach(b => {
                const name = b._name.replace(/-\d+$/, "");
                const building = city._buildingManager.createBuilding(name, b._x, b._y);

                if (building) {
                    building._residents = b._residents || 0;
                    building._employeesCount = b._employeesCount || 0;
                    city._buildingManager.addBuilding(building);
                }
            });
        }

        if (parsed._citizenManager && parsed._citizenManager._population) {
            parsed._citizenManager._population.forEach(c => {
                const name = c._name.replace(/-\d+$/, "");
                const citizen = new Citizen(name, c._happiness, c._hasHome, c._hasJob);
                city._citizenManager.addCitizen(citizen);
            });
        }

        // Restaurar growthRate
        if (parsed._citizenManager && parsed._citizenManager._growthRate) {
            city._citizenManager._growthRate = parsed._citizenManager._growthRate;
        }

        // Restaurar resourceManager
        if (parsed._resourceManager) {
            city._resourceManager._money = parsed._resourceManager._money;
            city._resourceManager._electricity = parsed._resourceManager._electricity;
            city._resourceManager._electricityProduction = parsed._resourceManager._electricityProduction;
            city._resourceManager._electricConsumption = parsed._resourceManager._electricConsumption;
            city._resourceManager._water = parsed._resourceManager._water;
            city._resourceManager._waterProduction = parsed._resourceManager._waterProduction;
            city._resourceManager._waterConsumption = parsed._resourceManager._waterConsumption;
            city._resourceManager._food = parsed._resourceManager._food;
        }

        const turnDuration = parsed._turnSystem?._turnDuration ?? 5;
        city.turnSystem = new TurnSystem(city, turnDuration);

        return city;
    }

    static clear() {
        localStorage.removeItem(this.keyCity);
    }
}