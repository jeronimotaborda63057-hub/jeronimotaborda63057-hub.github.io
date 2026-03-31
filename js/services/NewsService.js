class NewsService{
    constructor(){
        //Se asigna URL y API cuando se crea un objeto de tipo NewsService. Ahora, para la API que nos dio el profesor en el word, toca usar un proxy para que funcione correctamente, sino sale error en consola de GET. 
        this.newsUrl = "https://newsapi.org/v2/top-headlines";
        this.apiKey = "4a3bc36a6daf4c7bb48ff123d0e3c3ce";
        this.proxy   = "https://cors-anywhere.herokuapp.com/";
    }

    getNews(countryCode){
        //Se crea la url que va a ser la API con el codigo del pais, y la clave del API (Se pueden hacer 60 llamados cada minuto.)
        let url = this.proxy + this.newsUrl
            + "?country=" + countryCode
            + "&pageSize=5"
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