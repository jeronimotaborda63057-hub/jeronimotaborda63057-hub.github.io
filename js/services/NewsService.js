class NewsService{
    constructor(){
        //Se asigna URL y API cuando se crea un objeto de tipo NewsService. Ahora, para la API que nos dio el profesor en el word, toca usar un proxy para que funcione correctamente, sino sale error en consola de GET. 
        this.newsUrl = "https://newsapi.org/v2/top-headlines";
        this.apiKey = "1d55e7cf797343b3beccf21f53ee5d4d";
        this.proxy   = "https://cors-anywhere.herokuapp.com/";
    }

    getNews(countryCode){
        //Se crea la url que va a ser la API con el codigo del pais, y la clave del API (Se pueden hacer 60 llamados cada minuto.)
        let url = this.proxy + this.newsUrl
            + "?country=" + countryCode
            + "&apikey=" + this.apiKey

        
        return fetch(url).then(function(res){
            if(!res){
                //Sino funciona, lanza error.
                throw new Error("Error al conseguir noticias.")
            }
            //Devuelve la respuesta de la API en un JSON.
            return res.json();
        })
    }
}