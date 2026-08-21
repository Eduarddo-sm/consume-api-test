const form = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
let cities = "";
const API_KEY = '6ff8333827614515dcfb3b0c92d52298';

let history = {}

async function chamarApi(city) {

    let URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

    const resp = await fetch(URL);
    if (resp.status === 200) {
        const obj = await resp.json();
        return obj;
    } else {
        return resp;
    }
}

async function currentWeather(lat, lon){
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const resp = await fetch(URL);

    if (resp.status === 200){
        const obj = await resp.json();
        return obj;
    } else {
        return resp;
    }

}

   async function getWeatherDays(lat, lon){
        const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const resp = await fetch(URL);
        if(resp.status === 200){
            const obj = await resp.json();
            //console.log(data.toLocaleString("pt-BR"));
            return obj;
        } else {
            return null;
        }

    }

function tratarData(stamp) {
    const data = new Date(stamp * 1000);
    const dataPtBr = data.toLocaleString("pt-BR");
    const dataFormatada = dataPtBr.trim().split(",");

    return dataFormatada;
}

function convertDegree(degree){
    return Math.round(degree - 273.15);
}

 async function separeWeatherDays(lat, lon){
        const futureWeather = document.querySelector(".future-weather");
        const days = await getWeatherDays(lat, lon);
        futureWeather.replaceChildren();
        console.log(days);
        for(let day in days.list){
            const data = tratarData(days.list[day].dt);
            const dia = data[0].slice(0, 2);
            const hora = data[1].slice(0, 3);
            const degreeActually = convertDegree(days.list[day].main.temp);
            const weatherState = days.list[day].weather[0].description;
           

            const card = document.createElement("div");
            card.classList.add("hourly-weather");

            const containerTimer = document.createElement("div");
            containerTimer.classList.add("time-weatherFuture");

            const elementDay = document.createElement("p");
            elementDay.classList.add("day");
            elementDay.textContent = `${dia}`;

            const elementHour = document.createElement("p");
            elementHour.classList.add("hour");
            elementHour.textContent = `${hora}`;

            const elementImg = document.createElement("img");
            if ( weatherState === "clear sky") {
                elementImg.src = "https://openweathermap.org/img/wn/01d.png";
                elementImg.alt = "Ceu limpo";
            } else if (weatherState === "few clouds") {
                elementImg.src = "https://openweathermap.org/img/wn/02d.png";
                elementImg.alt = "Poucas nuvens";
            } else if (weatherState === "scattered clouds") {
                elementImg.src = "https://openweathermap.org/img/wn/03d.png";
                elementImg.alt = "Nublado / nuvens dispersas";
            } else if (weatherState === "broken clouds") {
                elementImg.src = "https://openweathermap.org/img/wn/04d.png";
                elementImg.alt = "Nublado";
            } else if (weatherState === "shower rain") {
                elementImg.src = "https://openweathermap.org/img/wn/05d.png";
                elementImg.alt = "pancadas de chuva";
            } else if (weatherState === "rain") {
                elementImg.src = "https://openweathermap.org/img/wn/10d.png";
                elementImg.alt = "chuva";
            } else if (weatherState === "thunderstorm") {
                elementImg.src = "https://openweathermap.org/img/wn/11d.png";
                elementImg.alt = "Tempestade"
            } else if (weatherState === "light rain") {
                elementImg.src = "https://openweathermap.org/img/wn/10d.png";
                elementImg.alt = "Chuva leve"
            } else if (weatherState === "overcast clouds") {
                elementImg.src = "https://openweathermap.org/img/wn/04d.png";
                elementImg.alt = "Chuva leve"
            } else {
                
            }

            const elementDegree = document.createElement("p");
            elementDegree.classList.add("degree");
            elementDegree.textContent = `${degreeActually}°`

            futureWeather.appendChild(card);
            card.appendChild(containerTimer);
            containerTimer.appendChild(elementDay);
            containerTimer.appendChild(elementHour);
            card.appendChild(elementImg);
            card.appendChild(elementDegree);

        }

    }

async function renderCities(param) {
    let cidades = await param;
    const popup = document.querySelector(".searched-states");
    popup.replaceChildren();
    popup.classList.add('active-searched');

    cidades.forEach(city => {
        const novoItem = document.createElement('div');
        novoItem.classList.add('item');

        const novoButton = document.createElement('button');
        novoButton.innerText = city.name;
        const novoState = document.createElement('p');
        novoState.innerText = city.state;

        popup.appendChild(novoItem);
        novoItem.appendChild(novoButton);
        novoItem.appendChild(novoState);

        novoButton.addEventListener("click", ()=>{
            renderCity(city.lat, city.lon);
            separeWeatherDays(city.lat, city.lon);
            renderHistory(city);
            popup.classList.remove('active-searched');
            popup.replaceChildren();
        })
    })

    //Listener novo: mousedown (click)
    document.addEventListener('mousedown', (mouse) => {
        const item = document.querySelectorAll(".item");

        if (mouse.button === 0){

            //metodo novo: contains
            if(!popup.contains(mouse.target) && !form.contains(mouse.target)){
                popup.classList.remove('active-searched');
                popup.replaceChildren();
            }
        }
    }) 
        
}

async function renderCity(lat, lon){
    const weatherInformations = await currentWeather(lat, lon);
    const screenResult = document.querySelector(".search-result");

    const degreeNow = screenResult.querySelector(".degree-now");
    const description = screenResult.querySelector(".description");

    degreeNow.textContent = `${convertDegree(weatherInformations.main.temp)}°`;
    description.textContent = weatherInformations.weather[0].description;
}

function addHistory(city, state, lat, lon){
    //Método novo
    let nextId = Object.keys(history).length + 1;

    history[nextId] = {
        city: city, 
        state: state, 
        lat: lat, 
        lon: lon
    }

}

function renderHistory(city){
    
    addHistory(city.name, city.state, city.lat, city.lon);
    const popup = document.querySelector(".history");
    popup.replaceChildren();

    for (let id in history) {

        const novoItem = document.createElement("button")
        novoItem.classList.add("history-item");

        const cityName = document.createElement("p");
        cityName.textContent = history[id].city;

        const stateName = document.createElement("p");
        stateName.textContent = history[id].state;


        popup.appendChild(novoItem);
        novoItem.appendChild(cityName);
        novoItem.appendChild(stateName);

        novoItem.addEventListener("click", ()=>{
            renderCity(history[id].lat, history[id].lon);
            separeWeatherDays(history[id].lat, history[id].lon);
        })

    }

}

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    let textoInput = searchInput.value;
    let cities = chamarApi(textoInput);
    renderCities(cities)
    const dados = new FormData(evento.target);
    const cidade = dados.get('city');

});



