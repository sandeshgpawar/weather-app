import {
  createHourlyForecast,
  displayLocationData,
  displayWeatherDetails,
  setWeatherDetails,
} from './dom';

function processHourlyData(arr) {
  const newArr = [];
  for (let i = 1; i < 22; i++) {
    const hour = {
      time: arr[i].dt,
      icon: arr[i].weather[0].id,
      pressure: arr[i].pressure,
      humidity: arr[i].humidity,
      temp: arr[i].temp,
    };

    newArr.push(hour);
  }

  return newArr;
}

function processDailyData(arr) {
  const newArr = [];
  arr.forEach((element) => {
    const daily = {
      day: element.dt,
      icon: element.weather[0].id,
      pressure: element.pressure,
      humidity: element.humidity,
      temp_max: element.temp.max,
      temp_min: element.temp.min,
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
    hourly: processHourlyData(data.hourly),
    daily: processDailyData(data.daily),
  };

  console.log(myData);
  return myData;
}

/* function getUserPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
} */

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

    console.log(userLocation);
    return userLocation;
  } catch (err) {
    console.log(err.message);
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

    processData(data).then((value) => displayLocationData(coords, value));
  } catch (err) {
    console.log(err.message);
  }
}

export { getWeatherData, getLocationDetails };
