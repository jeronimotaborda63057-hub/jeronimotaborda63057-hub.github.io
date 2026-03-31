let city = null;
let turnSystem = null;
let selectedButton = null;

// Variables globales para el modo ruta
let routeMode = false;
let routeOrigin = null;

document.addEventListener("DOMContentLoaded", () => {
    let btnNewCityPage = document.getElementById('btn-new-city-page');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnLoadGamePage = document.getElementById('btn-load-game-page');
    let btnDeleteGamePage = document.getElementById('btn-delete-game-page');
    let btnReturnStartPage = document.getElementById('return-start-page');
    let btnBack = document.querySelectorAll(".btn-back");
    let btnGameInfo = document.getElementById('btn-game-rules-page');
    let btnLoadGame = document.getElementById('btn-load-game');
    let mapSizeDisplay = document.getElementById('map-size-display');
    let mapSizeSlider = document.getElementById('input-map-size');
    let inputRegion = document.getElementById('input-region');
    let exportButton = document.getElementById('export')
    let btnLoadJSON = document.getElementById('btn-load-json');
    let deleteGameButton = document.getElementById('delete-game-button');
    let btnRoute = document.getElementById('btn-route');
    let constructionsInfo = document.querySelectorAll('.chevron');
    let constructionsInfoDivs = document.querySelectorAll('[id$="-info"]')

    const weatherRepository = new WeatherService();
    const newsRepository = new NewsService();

    // =====================================================

    let buttonList = [
        document.getElementById('btn-demolish'),
        document.getElementById('btn-house'),
        document.getElementById('btn-apartment'),
        document.getElementById('btn-store'),
        document.getElementById('btn-commercial-center'),
        document.getElementById('btn-factory'),
        document.getElementById('btn-farm'),
        document.getElementById('btn-police-station'),
        document.getElementById('btn-firefighters'),
        document.getElementById('btn-hospital'),
        document.getElementById('btn-power-plant'),
        document.getElementById('btn-water-plant'),
        document.getElementById('btn-park'),
        document.getElementById('btn-road')
    ];

    btnNewCityPage.addEventListener('click', () => {
        helpers.showScreen('city-info-page');
        helpers.loadCities();
    });

    btnDeleteGamePage.addEventListener('click', () => {
        helpers.showScreen('delete-game-page');
        helpers.loadSavedGames('delete-games-list');
    });

    btnLoadGamePage.addEventListener('click', () => {
        helpers.showScreen('load-game-page');
        helpers.loadSavedGames('saved-games-list');
    });

    deleteGameButton.addEventListener('click', () => {
        if (helpers.deleteGame()) {
            helpers.showScreen('initial-page');
        }
    })

    btnGameInfo.addEventListener('click', () => {
        helpers.showScreen('game-info-page')
    });

    btnLoadGame.addEventListener('click', () => {
        helpers.loadCityFromStorage();

        constructionsInfo.forEach(btn => {
            btn.textContent = '∨';
            btn.classList.remove('open');
        });

        constructionsInfoDivs.forEach(div => {
            div.innerHTML = '';
        });
    });

    btnBack.forEach(function (btn) {
        btn.addEventListener("click", function () {
            helpers.showScreen('initial-page')
        })
    });

    btnReturnStartPage.addEventListener('click', () => {
        helpers.returnToStartPage();
    });

    mapSizeSlider.addEventListener('input', () => {
        mapSizeDisplay.textContent = `${mapSizeSlider.value}x${mapSizeSlider.value}`;
    });

    exportButton.addEventListener('click', () => {
        response = confirm("Se guardará un archivo con la información de la ciudad.")

        if(response) {
            helpers.exportToJSON();
        }
    });

    btnLoadJSON.addEventListener('click', () => {
        helpers.importFromJSON();
        helpers.loadCityFromStorage();
    });

    inputRegion.addEventListener('change', function () {
        let option = this.options[this.selectedIndex];
        let lat = option.dataset.lat;
        let lon = option.dataset.lon;

        weatherRepository.getWeather(lat, lon)
            .then(data => {
                document.getElementById('city-temperature').textContent = `Temperatura: ${data.main.temp}°C`;
                document.getElementById('city-condition').textContent = `Condición: ${data.weather[0].description}`;
                document.getElementById('city-humidity').textContent = `Humedad: ${data.main.humidity}%`;
                document.getElementById('city-wind-velocity').textContent = `Velocidad del viento: ${data.wind.speed}m/s`;
            })
            .catch(() => {
                document.getElementById('city-temperature').textContent = `Temperatura: Error al conseguir temperatura.`;
                document.getElementById('city-condition').textContent = `Condición: Error al conseguir condición.`;
            });

        newsRepository.getNews("us")
            .then(data => {
                let newsPanel = document.getElementById('news-panel');
                newsPanel.innerHTML = '';
                data.articles.slice(0, 5).forEach(article => {
                    let card = document.createElement('div');
                    card.className = 'card mb-2';
                    card.innerHTML = `
                        <div class="card-body">
                            <h5 class="article-title">${article.title}</h5>
                            <p>${article.description}</p>
                            <a href="${article.url}">Link</a>
                            <img src="${article.urlToImage}" alt="news image" class="news-image">
                        </div>
                    `;
                    newsPanel.appendChild(card);
                });
            })
            .catch(() => {
                document.getElementById('news-title').textContent = `Título noticia: Error al conseguir el titulo`;
                document.getElementById('news-info').textContent = `Descripcion: Error al conseguir descripcion.`;
            });
    });

    btnCreateGame.addEventListener('click', () => {
        helpers.createNewGame();
    });

    buttonList.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-demolish') {
                selectedButton = null;
            } else {
                selectedButton = {
                    img: btn.dataset.image,
                    type: btn.dataset.type
                };
            }
            buttonList.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    constructionsInfo.forEach(btn => {
        btn.addEventListener('click', () => {
            let isOpen = btn.textContent.trim() === '∧';
            let type = btn.previousElementSibling.dataset.type;
            let infoDiv = document.getElementById(btn.dataset.target);

            btn.textContent = isOpen ? '∨' : '∧';
            btn.classList.toggle('open', !isOpen);

            if (!isOpen) {
                let panel = helpers.createInfoContainer(type);
                infoDiv.appendChild(panel);
            } else {
                infoDiv.innerHTML = '';
            }

        });
    });

    btnRoute.addEventListener('click', () => {
        routeMode = !routeMode;  // Encender o apagar el modo ruta
        routeOrigin = null;      // Reiniciar origen cada vez

        RoutingService.clearRoute(); // Limpiar ruta pintada anterior

        if (routeMode) {
            // Modo ruta encendido: desactivar botones de construcción
            buttonList.forEach(b => b.classList.remove('active'));
            selectedButton = null;
            btnRoute.classList.add('active');
            btnRoute.textContent = '🗺️ Selecciona origen...';
        } else {
            // Modo ruta apagado
            btnRoute.classList.remove('active');
            btnRoute.textContent = '🗺️ Calcular Ruta';
        }
    });

    document.querySelectorAll('.resource-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!city) return;

        const resource = btn.dataset.resource;
        const value = parseInt(document.getElementById(`edit-${resource}`).value) || 0;

        if (resource === 'electricity') city.electricity = value;
        if (resource === 'water') city.water = value;
        if (resource === 'food') city.food = value;

        helpers.updateUI();
    });
});

});
