import { setWeatherDetails } from './details';

function getUserPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getWeatherData(latitude, longitude) {
  try {
    const location = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=027f71f3deef4424ea3b9f0d6b11dc68`,
      { mode: 'cors' }
    );

    return location.json();
  } catch (err) {
    console.log(err.message);
  }
}

function displayLocationData(data) {
  const location = document.querySelector('.location');
  const city = location.querySelector('.city');
  const icon = location.querySelector('i');
  const temp = location.querySelector('.temp');
  const description = location.querySelector('.weather');

  city.textContent = data.name + ', ' + data.sys.country;
  temp.textContent = Math.round(data.main.temp);
  description.textContent = data.weather[0].description;
}

async function setWeatherData() {
  try {
    const userPosition = await getUserPosition();
    const lat = userPosition.coords.latitude;
    const long = userPosition.coords.longitude;

    getWeatherData(lat, long).then((value) => {
      console.log(value);
      displayLocationData(value);
      setWeatherDetails(value);
    });
  } catch {
    getWeatherData(52.2297, 21.0122).then((value) => {
      displayLocationData(value);
      setWeatherDetails(value);
    });
  }
}

export { setWeatherData };
