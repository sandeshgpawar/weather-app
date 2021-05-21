function setWeatherDetails(data) {
  const feelsLike = document.querySelector('#fl');
  const humidity = document.querySelector('#hu');
  const windSpeed = document.querySelector('#ws');
  const pressure = document.querySelector('#pr');
  const sunrise = document.querySelector('#sr');
  const sunset = document.querySelectorAll('#ss');

  feelsLike.textContent = Math.round(data.main['feels_like']);
  humidity.textContent = data.main.humidity + '%';
  windSpeed.textContent = data.wind.speed;
  pressure.textContent = data.main.pressure + ' hPa';
  sunrise.textContent = formatDate(data.sys.sunrise);
  sunset.textContent = formatDate(data.sys.sunset);
}

function formatDate(date) {
  const hour = new Date(date * 1000).getHours();
  const minutes = new Date(date * 1000).getUTCMinutes();

  return `${hour} : ${minutes}`;
}
export { setWeatherDetails };
