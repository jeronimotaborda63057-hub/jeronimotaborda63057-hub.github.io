class TurnSystem {
    constructor(city, turnDuration) {
        this._city = city;
        this._turnDuration = turnDuration * 1000 ?? 5;// convertir a milisegundos
        this._interval = null;
    }

    get turnDuration(){
        return this._turnDuration;
    }

    set turnDuration(duration) {
        if(duration>0){
            this._turnDuration = duration;
        }
    }

    start() {
        this._interval = setInterval(() => {
            this.nextTurn();
        }, this._turnDuration);
    }

    stop() {
        clearInterval(this._interval);
        this._interval = null;
    }

    nextTurn() {
        CityBuilderStorage.save(this._city, "city")

        // 1. Actualizar recursos
        this._city.updateResources();
        
        // 2. Hacer crecer población
        this._city.growPopulation();
        
        // 3. Asignar hogares y empleos
        this._city.assignHomes();
        this._city.assignJobs();
        
        // 4. Calcular felicidad
        this._city.calculateHappiness();
        
        // 5. Calcular puntuación
        this._city.calculateScore();
        
        // 6. Actualizar UI
        helpers.updateUI();

        // 7. Verificar game over
        const gameOver = this._city.checkGameOver();
        if (gameOver.gameOver) {
            this.stop();
            document.getElementById('game-over-reason').textContent = gameOver.reason;
            document.getElementById('game-over-score').textContent =
                `Puntuación final: ${this._city._scoreManager._score > 0 ? this._city._scoreManager._score : 0}`;
            helpers.showScreen("game-over-page");
        }
    }

    toJSON() {
        return {
            _turnDuration: this._turnDuration / 1000, // guarda en segundos
            _turnNumber: this._turnNumber
        };
    }
}