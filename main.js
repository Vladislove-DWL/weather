import conditions from './conditions.js';

console.log(conditions);

const apiKey ='48956fa69f2a4932ad862124242504';

// элементы на странице
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const header = document.querySelector('.header');


function removeCard() {
    //удаляем предыдущую карточку
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    //показываем карточку с ошибкой
    const html = `<div class="card">${errorMessage}</div>`;

    //отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
}

function showCard({ name, country, temp, condition, imgPath }) {
    //разметка для карточки
    const html = 
    `<div class="card">

        <h2 class="card-city">${name}<span>${country}</span></h2>

            <div class="card-weather">
                <div class="card-value">${temp}<sup>°с</sup></div>
                <img class="card-img" src="${imgPath}" alt="weather">
            </div>

        <div class="card-description">${condition}</div>  
    </div>`

    //отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
    //адрес запроса
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}


//слушаем отправку формы
form.onsubmit = async function (event) {

    //отменяем отправку формы
    event.preventDefault();

    //берем значение из инпута + обрезаем пробелы
    let city = input.value.trim();

    //получаем данные с сервера
    const data = await getWeather(city);
    
    if (data.error) {
        removeCard();
        showError('Подходящего местоположения не найдено :(');
    } else {
        removeCard();

        console.log(data.current.condition.code);

        const info = conditions.find(function(obj) {
            if (obj.code === data.current.condition.code) return true
        })

        // можно так
        // const info = conditions.find((obj) => obj.code === data.current.condition.code)

        console.log(info);
        console.log(info.languages[23]['day_text']);

        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = info.icon + '.png';
        const imgPath = filePath + fileName;
        console.log(filePath + fileName);

        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: data.current.is_day
            ? info.languages[23]['day_text']
            : info.languages[23]['night_text'],
            imgPath: imgPath,
        }

        showCard(weatherData);
    }
}



