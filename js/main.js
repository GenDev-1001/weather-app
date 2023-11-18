const form = document.querySelector("#form");
const input = document.querySelector(".form__input");

const weatherTemp = document.querySelector(".weather__temp");
const weatherCity = document.querySelector(".weather__city");
const weatherHumidity = document.querySelector("#humidity");
const weatherWindSpeed = document.querySelector("#windSpeed");
const weatherImg = document.querySelector(".weather__img");

const KEY = "6420e2b699c73deace7ab3e593fcb62a";

const submitHandler = async (e) => {
	e.preventDefault();

	if (!input.value.trim()) {
		console.log("Enter city name");
		return;
	}

	const cityName = input.value.trim();
	input.value = "";

	const cityInfo = await getGeo(cityName);

	if (!cityInfo.length) return;

	const lat = cityInfo[0].lat;
	const lon = cityInfo[0].lon;
	const weatherInfo = await getWeather(lat, lon);

	const weatherData = {
		name: weatherInfo.name,
		temp: weatherInfo.main.temp,
		humidity: weatherInfo.main.humidity,
		windSpeed: weatherInfo.wind.speed,
		main: weatherInfo.weather[0].main,
	};

	renderWeatherData(weatherData);
};

const getGeo = async (name) => {
	const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${KEY}`;

	const res = await fetch(geoUrl);
	const data = await res.json();
	return data;
};

const getWeather = async (lat, lon) => {
	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${KEY}`;

	const res = await fetch(weatherUrl);
	const data = await res.json();
	return data;
};

const renderWeatherData = (weatherData) => {
	document.querySelector(".weather__info").classList.remove("none");
	document.querySelector(".weather__details").classList.remove("none");

	weatherCity.innerText = weatherData.name;
	weatherTemp.innerText = `${Math.round(weatherData.temp)}°c`;
	weatherHumidity.innerText = `${weatherData.humidity}%`;
	weatherWindSpeed.innerText = `${weatherData.windSpeed}km/h`;

	const weatherImgObj = {
		Clear: "clear",
		Clouds: "clouds",
		Drizzle: "drizzle",
		Mist: "mist",
		Rain: "rain",
		Snow: "snow",
	};

	if (weatherImgObj[weatherData.main]) {
		weatherImg.src = `./images/weather/${weatherImgObj[weatherData.main]}.png`;
	}
};

form.addEventListener("submit", submitHandler);
