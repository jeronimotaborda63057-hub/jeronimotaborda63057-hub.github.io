class WeatherService{
    constructor(){
        //Se crea la URL base con la clave de la API.
        this._baseURL = "https://api.openweathermap.org/data/2.5/weather";
        this.apiKey = "ed5c2857daa0827293da3b4f9b584ff0"
    }

    getWeather(lat,lon){
        //Se crea la URL, con la informacion de latitud, longitud, y la clave de la API (Se pueden hacer 100 llamadas por día.)
        let url = this._baseURL
            + "?lat=" + lat
            + "&lon=" + lon
            + "&appid=" + this.apiKey
            + "&units=metric"
            + "&lang=es"

        return fetch(url).then(function(res){
            if(!res){
                //Sino funciona, manda error.
                throw new Error("Error al conseguir clima.")
            }

            //Devuelve la respuesta de la API en un JSON.
            return res.json();
        });
    }
}