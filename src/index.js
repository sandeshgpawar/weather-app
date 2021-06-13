import css from './style.css';
import {
  getWeatherData,
  getLocationDetails,
  getUserPosition,
} from './modules/data';

async function appStart() {
  try {
    const userPosition = await getUserPosition();
    let coords = {
      lat: userPosition.coords.latitude,
      lon: userPosition.coords.longitude,
    };

    const getCity = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=027f71f3deef4424ea3b9f0d6b11dc68`
    );
    const getCityObject = await getCity.json();
    const cityAndCountry = {
      name: getCityObject.name,
      country: getCityObject.sys.country,
    };

    Object.assign(coords, cityAndCountry);
    getWeatherData(coords);
  } catch {
    let defaultCoords = {
      lat: 28.6448,
      lon: 77.21672,
      name: 'Delhi',
      country: 'IN',
    };

    getWeatherData(defaultCoords);
  }
}

appStart();

const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const whatewa = getLocationDetails(searchBar.value);
    getWeatherData(whatewa);
  }
});

const buttons = document.querySelectorAll('button');
const details = document.querySelectorAll('.forecast-details');

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    if (button.classList.contains('active')) {
      return;
    } else {
      for (let i = 0; i < 2; i++) {
        buttons[i].classList.toggle('active');
        details[i].classList.toggle('show');
      }
    }
  });
});
