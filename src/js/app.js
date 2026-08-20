const form = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
let cities = "";
const API_KEY = '6ff8333827614515dcfb3b0c92d52298';


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
        })
    })

    document.addEventListener('mousedown', (mouse) => {
        const item = document.querySelectorAll(".item");

        if (mouse.button === 0){

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
    console.log(weatherInformations);

    const degreeNow = screenResult.querySelector(".degree-now");
    const description = screenResult.querySelector(".description");

    degreeNow.textContent = Math.round(weatherInformations.main.temp - 273.15);
    description.textContent = weatherInformations.weather[0].description;
}

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    let textoInput = searchInput.value;
    let cities = chamarApi(textoInput);
    renderCities(cities)
    const dados = new FormData(evento.target);
    const cidade = dados.get('city');


})

