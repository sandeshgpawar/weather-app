import {
  createHourlyForecast,
  displayLocationData,
  displayWeatherDetails,
  createDailyForecast,
} from './dom';

function processHourlyData(data) {
  const arr = data.hourly;
  const newArr = [];
  for (let i = 1; i < 22; i++) {
    const hour = {
      date: arr[i].dt,
      weatherID: arr[i].weather[0].id,
      pressure: arr[i].pressure,
      humidity: arr[i].humidity,
      temp: arr[i].temp,
      sunset: data.current.sunset,
      sunrise: data.current.sunrise,
    };

    newArr.push(hour);
  }

  return newArr;
}

function processDailyData(data) {
  const arr = data.daily;
  const newArr = [];
  arr.forEach((element) => {
    const daily = {
      date: element.dt,
      weatherID: element.weather[0].id,
      pressure: element.pressure,
      humidity: element.humidity,
      temp: Math.round(element.temp.max) + ' | ' + Math.round(element.temp.min),
      sunset: element.sunset,
      sunrise: element.sunrise,
    };

    newArr.push(daily);
  });

  return newArr;
}

async function processData(data) {
  const myData = {
    temp: data.current.temp,
    feels: data.current['feels_like'],
    date: data.current.dt,
    humidity: data.current.humidity,
    pressure: data.current.pressure,
    sunrise: data.current.sunrise,
    sunset: data.current.sunset,
    weather: data.current.weather[0].description,
    weatherID: data.current.weather[0].id,
    hourly: processHourlyData(data),
    daily: processDailyData(data),
    timezone: data['timezone_offset'],
    wind: data.current['wind_speed'],
  };

  return myData;
}

function getUserPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getLocationDetails(location) {
  try {
    const locationDetails = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=027f71f3deef4424ea3b9f0d6b11dc68`,
      { mode: 'cors' }
    );
    const locationObject = await locationDetails.json();

    const userLocation = {
      name: locationObject[0].name,
      country: locationObject[0].country,
      lat: locationObject[0].lat,
      lon: locationObject[0].lon,
    };

    return userLocation;
  } catch {
    alert('Oops! Something went wrong...');
  }
}

async function getWeatherData(location, units = 'metric') {
  try {
    const coords = await location;
    const weather = await fetch(
      `http://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&units=${units}&appid=027f71f3deef4424ea3b9f0d6b11dc68`,
      { mode: 'cors' }
    );
    const data = await weather.json();

    processData(data).then((value) => {
      displayLocationData(coords, value);
      displayWeatherDetails(value);
      createHourlyForecast(value);
      createDailyForecast(value);
    });
  } catch {
    alert('Oops! Something went wrong...');
  }
}

export { getWeatherData, getLocationDetails, getUserPosition };
