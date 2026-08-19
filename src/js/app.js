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

async function renderCities(param) {
    let cidades = await param;
    const popup = document.querySelector(".searched-states");
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
    })

    document.addEventListener('mousedown', (mouse) => {
        if (mouse.button === 0){

            if(!popup.contains(mouse.target)){
                popup.classList.remove('active-searched');
            }
        }
    }) 
        
}

function ocultarRenderCities(){
    const popup = document.querySelector(".searched-states");
    
}

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    let textoInput = searchInput.value;
    let cities = chamarApi(textoInput);
    renderCities(cities)
    const dados = new FormData(evento.target);
    const cidade = dados.get('city');


})

