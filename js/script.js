import conditions from "./conditions.js";
const baseUrl = 'https://www.cbr-xml-daily.ru/daily_json.js'; //API Банка
const apiKey = 'cdbe5dda072545808d0125020250604';
let form = document.getElementById('form');
let input = document.getElementById('input');




const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

// Функция обновления текущего времени и даты
function updateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    // Получаем текущую дату и время
    let now = new Date();
    let day = now.getDate();
    let monthIndex = now.getMonth(); // Месяцы отсчитываются от нуля!
    let year = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, '0');

    // Собираем строку с месяцем словом
    let dateString = `${day} ${months[monthIndex]} ${year}`;
    let timeString = `${hours}:${minutes}`;

    // Обновляем элемент с текстом
    dateElement.textContent = `${dateString}`;
    timeElement.textContent = `${timeString}`;
}

// Автоматическое обновление каждые секунды
setInterval(updateTime, 1000);

// Первоначальная инициализация при загрузке страницы
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








