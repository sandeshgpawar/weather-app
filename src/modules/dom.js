function switchIcon(icon, weatherData) {
  icon.className = 'wi';

  if (
    (weatherData.date < weatherData.sunrise &&
      weatherData.date < weatherData.sunset) ||
    weatherData.date > weatherData.sunset
  ) {
    icon.classList.add(`wi-owm-night-${weatherData.weatherID}`);
  } else if (
    (weatherData.date > weatherData.sunrise &&
      weatherData.date < weatherData.sunset) ||
    (weatherData.date > weatherData.sunrise &&
      weatherData.date > weatherData.sunset)
  ) {
    icon.classList.add(`wi-owm-day-${weatherData.weatherID}`);
  }
}

function getTime(date, timezone) {
  let hour = new Date((date + timezone) * 1000).getUTCHours();
  let minutes = new Date((date + timezone) * 1000).getUTCMinutes();

  if (hour < 10) {
    hour = '0' + hour;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return `${hour} : ${minutes}`;
}

function getWeekDay(date, timezone) {
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayNumber = new Date((date + timezone) * 1000).getDay();

  return weekDays[dayNumber];
}

function displayLocationData(userLocation, weatherData) {
  const location = document.querySelector('.location');
  const city = location.querySelector('.city');
  const icon = location.querySelector('i');
  const temp = location.querySelector('.temp');
  const description = location.querySelector('.weather');

  city.textContent = userLocation.name + ', ' + userLocation.country;
  temp.textContent = Math.round(weatherData.temp) + ' \xB0C';
  description.textContent = weatherData.weather.toUpperCase();

  switchIcon(icon, weatherData);
}

function displayWeatherDetails(data) {
  const feelsLike = document.querySelector('#fl');
  const humidity = document.querySelector('#hu');
  const windSpeed = document.querySelector('#ws');
  const pressure = document.querySelector('#pr');
  const sunrise = document.querySelector('#sr');
  const sunset = document.querySelector('#ss');

  feelsLike.textContent = Math.round(data.feels) + ' \xB0C';
  humidity.textContent = data.humidity + '%';
  windSpeed.textContent = data.wind + ' km/h';
  pressure.textContent = data.pressure + ' hPa';
  sunrise.textContent = getTime(data.sunrise, data.timezone);
  sunset.textContent = getTime(data.sunset, data.timezone);
}

function createDetailsHeaders() {
  const heading = document.createElement('div');
  const headersList = ['HOUR', '', 'PRESSURE', 'HUMIDITY', 'TEMPERATURE'];

  for (let i = 0; i < headersList.length; i++) {
    const header = document.createElement('h3');
    header.textContent = headersList[i];
    heading.appendChild(header);
  }

  heading.className = 'headers';
  return heading;
}

function createDetailsTemplate() {
  const hourContainer = document.createElement('div');
  const date = document.createElement('h2');
  const icon = document.createElement('i');
  const pressure = document.createElement('h2');
  const wind = document.createElement('h2');
  const temp = document.createElement('h2');

  hourContainer.append(date, icon, pressure, wind, temp);

  return hourContainer;
}

function createHourlyForecast(data) {
  const hourlyContent = document.querySelector('.hourly');
  const hourlyData = data.hourly;
  hourlyContent.innerHTML = '';
  hourlyContent.appendChild(createDetailsHeaders());

  for (let i = 0; i < 12; i++) {
    const details = createDetailsTemplate();

    details.classList.add('hour');
    details.children[0].textContent = getTime(
      hourlyData[i].date,
      data.timezone
    );
    details.children[2].textContent = hourlyData[i].pressure + ' hPa';
    details.children[3].textContent = hourlyData[i].humidity + '%';
    details.children[4].textContent = Math.round(hourlyData[i].temp) + '\xB0C';

    switchIcon(details.children[1], hourlyData[i]);

    hourlyContent.appendChild(details);
  }
}

function createDailyForecast(data) {
  const dailyContent = document.querySelector('.daily');
  const dailyData = data.daily;
  const headers = createDetailsHeaders();
  headers.children[0].textContent = 'DAY';
  headers.lastChild.textContent = 'TEMP MAX/MIN';
  dailyContent.innerHTML = '';
  dailyContent.appendChild(headers);

  for (let i = 1; i < dailyData.length; i++) {
    const details = createDetailsTemplate();

    details.classList.add('day');
    details.children[0].textContent = getWeekDay(
      dailyData[i].date,
      data.timezone
    );
    details.children[2].textContent = dailyData[i].pressure + ' hPa';
    details.children[3].textContent = dailyData[i].humidity + ' %';
    details.children[4].textContent = dailyData[i].temp + ' \xB0C';

    switchIcon(details.children[1], dailyData[i]);
    dailyContent.appendChild(details);
  }
}

export {
  displayLocationData,
  displayWeatherDetails,
  createHourlyForecast,
  createDailyForecast,
};
