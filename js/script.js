import conditions from "./conditions.js";
const baseUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
const apiKey = 'cdbe5dda072545808d0125020250604';
let form = document.getElementById('form');
let input = document.getElementById('input');


const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

function updateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    let now = new Date();
    let day = now.getDate();
    let monthIndex = now.getMonth();
    let year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, '0');

    let dateString = `${day} ${months[monthIndex]} ${year}`;
    let timeString = `${hours}:${minutes}`;

    dateElement.textContent = `${dateString}`;
    timeElement.textContent = `${timeString}`;
}

setInterval(updateTime, 1000);

window.addEventListener("DOMContentLoaded", () => { updateTime(); });


fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            const usdRate = data.Valute.USD.Value.toFixed(2);
            const eurRate = data.Valute.EUR.Value.toFixed(2);
            
            document.getElementById('usd').innerText = `${usdRate}₽`;
            document.getElementById('eur').innerText = `${eurRate}₽`;
        })



form.onsubmit = function (e) {
    e.preventDefault();
    let city = input.value.trim();
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    

    fetch(url)
        .then((response) => {return response.json()})
        .then((data) => {
            let temp = data.current.temp_c;
            document.getElementById('temp').innerText = `${temp}°C`;

            const info = conditions.find(function(obj){
                if (obj.code === data.current.condition.code) return true;
            })

            let weatherName = document.getElementById('weather-name');
            if (data.current.is_day){
                weatherName.innerText = info.languages[23]['day_text']
            } else {
                weatherName.innerText = info.languages[23]['night_text']
            }
    });


}


navigator.geolocation.getCurrentPosition(function (position) {
    function getCityByCoordinates(latitude, longitude, callback) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let cityName = data.address.city || data.address.town || 'Ошибка';
                callback(null, cityName);
            })

    }
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    getCityByCoordinates(latitude, longitude, function(error, city) {
            input.value = city;
            const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

        
    fetch(url)
        .then((response) => {return response.json()})
        .then((data) => {
            let temp = data.current.temp_c;
            document.getElementById('temp').innerText = `${temp}°C`;

            const info = conditions.find(function(obj){
                if (obj.code === data.current.condition.code) return true;
            })

            let weatherName = document.getElementById('weather-name');
            if (data.current.is_day){
                weatherName.innerText = info.languages[23]['day_text']
            } else {
                weatherName.innerText = info.languages[23]['night_text']
            }
    });

    });
});

document.getElementById('location').addEventListener('click', function(erroe, city){
    navigator.geolocation.getCurrentPosition(function (position) {
        function getCityByCoordinates(latitude, longitude, callback) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                .then(response => {
                    return response.json();   // Преобразуем тело ответа в объект JSON
                })
                .then(data => {
                    let cityName = data.address.city || data.address.town || 'Ошибка';
                    callback(null, cityName); // Возвращаем успешное значение
                })
    
        }
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
    
        getCityByCoordinates(latitude, longitude, function(error, city) {
                input.value = city;
                const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    
            
        fetch(url)
            .then((response) => {return response.json()})
            .then((data) => {
                let temp = data.current.temp_c;
                document.getElementById('temp').innerText = `${temp}°C`;
    
                const info = conditions.find(function(obj){
                    if (obj.code === data.current.condition.code) return true;
                })
    
                let weatherName = document.getElementById('weather-name');
                if (data.current.is_day){
                    weatherName.innerText = info.languages[23]['day_text']
                } else {
                    weatherName.innerText = info.languages[23]['night_text']
                }
        });
    
        });
    });
})


const btn = document.querySelector('.btn');

let hideTimeout;

input.addEventListener('focus', () => {
  clearTimeout(hideTimeout);
  btn.style.visibility = "visible";
  btn.style.opacity = '1';
});

input.addEventListener('blur', () => {
  hideTimeout = setTimeout(() => {
    btn.style.opacity = '0';
    setTimeout(() => {
      btn.style.visibility = "visible";
    }, 100);
  }, 100);
});

document.getElementById('input').addEventListener('focus', function() {
    this.type = 'search';
});

document.getElementById('input').addEventListener('blur', function() {
    this.type = 'text';
});
