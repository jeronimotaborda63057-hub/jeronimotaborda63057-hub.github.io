class CityService{
    //Se crea un objeto de tipo CityService, con la informacion contenida en cities.json.
    constructor(citiesURL = "../../data/cities.json"){
        this._url = citiesURL;
    }

    getCities(){
        return fetch(this._url).then(function (res){
            if(!res.ok){
                //Sino hay respuesta del archivo, lanza error.
                throw new Error("Error al obtener ciudades")
            } 
            //Devuelve la respuesta del archivo en formato JSON.
            return res.json();
        })
    }
}