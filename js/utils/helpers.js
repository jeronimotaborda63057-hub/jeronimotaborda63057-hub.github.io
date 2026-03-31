class helpers {
    static updateUI() {
        document.getElementById('money').textContent = `💵 $${city.money}`;
        document.getElementById('edit-electricity').value = `${city.electricity}`;
        document.getElementById('edit-water').value = `${city.water}`;
        document.getElementById('edit-food').value = `${city.food}`;
        document.getElementById('population').textContent = `👥 ${city.population.length}`;
        document.getElementById('happiness').textContent = `😊 ${city.calculateHappiness(city.buildings)}%`;
        document.getElementById('score-panel').textContent = `${city.score}`;
    }

    static buildNewBuilding(type, x, y) {
        const building = city.buildingManager.createBuilding(type, x, y);

        if (!building) {
            return null;
        }

        if (city.canAfford(building)) {
            city.spendMoney(building);
            city.addBuilding(building);
            city.grid.setCellId(x, y, building.id);
            document.getElementById('money').textContent = `💵 $${city.money}`;
            return building;
        } else {
            alert("No tienes suficiente dinero para construir esto.");
            return null;
        }
    }

    static loadCities() {
        const cityService = new CityService();
        const inputRegion = document.getElementById('input-region');
        inputRegion.innerHTML = '<option value="">— Cargando ciudades —</option>';
        cityService.getCities()
            .then(function (cities) {
                cities.sort(function (city1, city2) {
                    return city1.name.localeCompare(city2.name);
                })
                inputRegion.innerHTML = '<option value="">— Selecciona una ciudad —</option>';
                cities.forEach(function (city) {
                    let option = document.createElement('option')
                    option.value = city.id;
                    option.textContent = city.name;
                    option.dataset.lat = city.latitude;
                    option.dataset.lon = city.longitude;
                    inputRegion.appendChild(option);
                })
            })
            .catch(function (error) {
                alert("Error al cargar ciudades")
                inputRegion.innerHTML = '<option value="">— Error al cargar ciudades —</option>';
            });
    }

    static showScreen(screen_id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screen_id).classList.add('active');
    }

    static buildValidation(x, y, type) {
        if (type === "road") return true;
        x = parseInt(x);
        y = parseInt(y);

        const adyacent = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        for (const [dx, dy] of adyacent) {
            const row = city.grid.cells[y + dy];
            const cell = row ? row[x + dx] : undefined;
            if (cell && cell.id === 'R') return true;
        }

        return false;
    }

    static loadSavedGames(id) {
        let savedGamesList = document.getElementById(id);
        savedGamesList.innerHTML = "";

        if (localStorage.getItem(CityBuilderStorage.keyCity)) {
            savedGamesList.innerHTML = `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>🏙️ Partida guardada</span>
                </div>
            `;
        } else {
            savedGamesList.innerHTML = `<h2 class="screen-subtitle">No hay ciudades guardadas</h2>`;
        }
    }

    static deleteGame() {
        if (localStorage.getItem(CityBuilderStorage.keyCity)) {
            CityBuilderStorage.clear()
            document.getElementById('delete-games-list').innerHTML = `
            <h2 class="screen-subtitle">Ciudades eliminadas</h2>`
            alert("Partida borrada exitosamente.")
            return true;
        } else {
            alert("No hay ciudades para borrar.")
            return false;
        }
    }

    static setupGridListener() {
        const gridContainer = document.getElementById("grid");
        const newContainer = gridContainer.cloneNode(true);
        gridContainer.parentNode.replaceChild(newContainer, gridContainer);

        newContainer.addEventListener("click", function (event) {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            helpers.routing(cell, x, y);
            helpers.renderCellImage(cell, x, y);

        });
        return newContainer;
    }

    static renderCellImage(cell, x, y) {
        if (selectedButton === null) {
            // Solo demoler si hay algo Y el botón demoler está activo en la UI
            const btnDemolish = document.getElementById('btn-demolish');
            if (cell.innerHTML.trim() !== "" && btnDemolish.classList.contains('active')) {
                city._buildingManager.deleteBuilding(x, y);
                city._grid.setCellId(x, y, "g");
                cell.innerHTML = "";
            }
        } else if (cell.innerHTML.trim() === "") {
            if (selectedButton.type === "road") {
                let building = helpers.buildNewBuilding(selectedButton.type, x, y);
                if (building !== null) {
                    cell.innerHTML = `<img src="${selectedButton.img}" class="cell-icon"/>`;
                }
            } else if (helpers.buildValidation(x, y, selectedButton.type)) {
                let building = helpers.buildNewBuilding(selectedButton.type, x, y);
                if (building !== null) {
                    cell.innerHTML = `<img src="${selectedButton.img}" class="cell-icon"/>`;
                }
            } else {
                alert("No puedes construir aquí porque no hay una vía adyacente.");
            }
        }
    }

    static routing(cell, x, y) {
        if (routeMode) {
            const cellData = city.grid.cells[y][x];
            // Solo permite seleccionar edificios, no pasto ni vías
            if (cellData.id === "g" || cellData.id === "R") {
                alert("Selecciona un edificio como origen o destino, no una vía ni terreno vacío.");
                return;
            }

            if (!routeOrigin) {
                // Primer clic: guardar como ORIGEN
                routeOrigin = { x, y };
                cell.classList.add("route-highlight");
                document.getElementById('btn-route').textContent = '🗺️ Selecciona destino...';
            } else {
                // Segundo clic: calcular ruta al DESTINO
                RoutingService.calculateRoute(city.grid, routeOrigin.x, routeOrigin.y, x, y)
                    .then(route => {
                        if (route) RoutingService.highlightRoute(route);
                    });

                // Apagar modo ruta automáticamente
                routeMode = false;
                routeOrigin = null;
                document.getElementById('btn-route').classList.remove('active');
                document.getElementById('btn-route').textContent = '🗺️ Calcular Ruta';
            }
            return; // ← Importante: evita que construya o demuela
        }
    }

    static loadCityFromStorage() {
        let loadedCity = CityBuilderStorage.loadCity();
        if (loadedCity) {
            city = loadedCity;
            document.getElementById('city-name').textContent = `Ciudad: ${city.name}`;
            document.getElementById('city-mayor').textContent = `Alcalde: ${city.mayor}`;
            city.startTurn();
            const container = helpers.setupGridListener(selectedButton);
            GridRenderer.render(city.grid, container);
            helpers.showScreen('game-page');
        } else {
            alert("No se encontró ninguna partida guardada.");
        }
    }

    static saveCityToStorage() {
        try {
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
        } catch (e) {
            alert("Error al guardar partida", e)
        }
    }

    static createNewGame() {
        if (city && city.turnSystem) city.turnSystem.stop();

        const gridSize = parseInt(document.getElementById("input-map-size").value);
        const cityNameInput = document.getElementById('input-city-name');
        const cityMayorInput = document.getElementById('input-mayor-name');
        const cityValue = cityNameInput.value.trim();
        const mayorName = cityMayorInput.value.trim();
        const cityNameContainer = document.getElementById('city-name');
        const cityMayorNameContainer = document.getElementById('city-mayor')
        let electricity = parseInt(document.getElementById("input-init-electricity").value);
        let water = parseInt(document.getElementById("input-init-water").value);
        let food = parseInt(document.getElementById("input-init-food").value);
        const turnDuration = parseInt(document.getElementById("input-turn-duration").value);
        const growthRate = parseInt(document.getElementById("input-growth-rate").value);

        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        city = new City(cityValue, mayorName, 0, 0, gridSize, gridSize, 0, 0, grid, turnDuration);
        city.turnSystem = new TurnSystem(city, turnDuration);
        city.growthRate = growthRate;
        city.electricity = electricity;
        city.water = water;
        city.food = food;
        helpers.updateUI();
        helpers.showScreen('game-page');
        cityNameContainer.textContent = `Ciudad: ${cityValue}`;
        cityMayorNameContainer.textContent = `Alcalde: ${mayorName}`;
        const container = helpers.setupGridListener();
        GridRenderer.render(grid, container);
        city.startTurn();
    }

    static returnToStartPage() {
        let response = confirm("¿Desea salir de la partida?")
        if (response) {
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
            city.stopTurn();
            helpers.showScreen('initial-page');
        }
    }

    static getBuildingInfo(type) {
        const info = {
            'house': { nombre: 'Casa', costo: 1000, capacidad: 4, empleos: null, ingreso: null, produccion: null, electricidad: 5, agua: 3, alimentos: null, felicidad: null, radio: null },
            'apartment': { nombre: 'Apartamento', costo: 3000, capacidad: 12, empleos: null, ingreso: null, produccion: null, electricidad: 15, agua: 10, alimentos: null, felicidad: null, radio: null },
            'store': { nombre: 'Tienda', costo: 2000, capacidad: null, empleos: 6, ingreso: 500, produccion: null, electricidad: 8, agua: null, alimentos: null, felicidad: null, radio: null },
            'commercial-center': { nombre: 'Centro Comercial', costo: 8000, capacidad: null, empleos: 20, ingreso: 2000, produccion: null, electricidad: 25, agua: null, alimentos: null, felicidad: null, radio: null },
            'factory': { nombre: 'Fábrica', costo: 5000, capacidad: null, empleos: 15, ingreso: 800, produccion: null, electricidad: 20, agua: 15, alimentos: null, felicidad: null, radio: null },
            'farm': { nombre: 'Granja', costo: 3000, capacidad: null, empleos: 8, ingreso: null, produccion: 50, electricidad: null, agua: 10, alimentos: 50, felicidad: null, radio: null },
            'police-station': { nombre: 'Policía', costo: 4000, capacidad: null, empleos: null, ingreso: null, produccion: null, electricidad: 15, agua: null, alimentos: null, felicidad: 10, radio: 5 },
            'firefighter-station': { nombre: 'Bomberos', costo: 4000, capacidad: null, empleos: null, ingreso: null, produccion: null, electricidad: 15, agua: null, alimentos: null, felicidad: 10, radio: 5 },
            'hospital': { nombre: 'Hospital', costo: 6000, capacidad: null, empleos: null, ingreso: null, produccion: null, electricidad: 20, agua: 10, alimentos: null, felicidad: 10, radio: 7 },
            'power-plant': { nombre: 'Planta Eléctrica', costo: 10000, capacidad: null, empleos: null, ingreso: null, produccion: 200, electricidad: null, agua: null, alimentos: null, felicidad: null, radio: null },
            'water-plant': { nombre: 'Planta de Agua', costo: 8000, capacidad: null, empleos: null, ingreso: null, produccion: 150, electricidad: 20, agua: null, alimentos: null, felicidad: null, radio: null },
            'park': { nombre: 'Parque', costo: 1500, capacidad: null, empleos: null, ingreso: null, produccion: null, electricidad: null, agua: null, alimentos: null, felicidad: 5, radio: null },
            'road': { nombre: 'Vía', costo: 100, capacidad: null, empleos: null, ingreso: null, produccion: null, electricidad: null, agua: null, alimentos: null, felicidad: null, radio: null },
        };

        return info[type] ?? null;
    }

    static createInfoContainer(type) {
        const data = helpers.getBuildingInfo(type);
        if (!data) return null;

        const container = document.createElement('div');
        container.classList.add('building-info-panel');

        let html = `<ul class="building-info-list">`;

        if (data.costo) html += `<li>💰 Costo: $${data.costo.toLocaleString()}</li>`;
        if (data.capacidad) html += `<li>👥 Capacidad: ${data.capacidad} ciudadanos</li>`;
        if (data.empleos) html += `<li>💼 Empleos: ${data.empleos}</li>`;
        if (data.ingreso) html += `<li>📈 Ingreso: $${data.ingreso}/turno</li>`;
        if (data.produccion) html += `<li>🏭 Producción: ${data.produccion}</li>`;
        if (data.electricidad) html += `<li>⚡ Electricidad: ${data.electricidad} u/t</li>`;
        if (data.agua) html += `<li>💧 Agua: ${data.agua} u/t</li>`;
        if (data.alimentos) html += `<li>🌾 Alimentos: ${data.alimentos}/turno</li>`;
        if (data.felicidad) html += `<li>😊 Felicidad: +${data.felicidad}</li>`;
        if (data.radio) html += `<li>📡 Radio: ${data.radio} celdas</li>`;

        html += '</ul>';
        container.innerHTML = html;

        return container;
    }

    static exportToJSON() {
        const data = CityBuilderStorage.loadCity();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], {
            type: "application/json"
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url;
        a.download = "cityBuilderGame.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
        URL.revokeObjectURL(url);
    }

    static importFromJSON() {
        const input = document.createElement("input")
        input.type = "file";
        input.accept = ".json";

        input.addEventListener("change", (event) => {
            const file = event.target.files[0]
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const datos = JSON.parse(e.target.result);
                    CityBuilderStorage.save(datos, CityBuilderStorage.keyCity)
                } catch {
                    alert("Archivo inválido.")
                }
            };
            reader.readAsText(file)
        });

        input.click();
    }

}