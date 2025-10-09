const apiKey = "7ced87751ac776502b878e8edc2d7961";

const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const errorDiv = document.getElementById("error");
const languageSelect = document.getElementById("languageSelect");

async function getWeather(city, lang = "en") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${lang}&t=${Date.now()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod != 200) throw new Error(data.message);

    displayWeather(data, lang);
  } catch (err) {
    showError(err.message);
  }
}

async function getWeatherByCoords(lat, lon, lang = "en") {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod != 200) throw new Error(data.message);
    displayWeather(data, lang);
  } catch (err) {
    showError(err.message);
  }
}

function displayWeather(data, lang) {
  errorDiv.classList.add("hidden");
  weatherInfo.classList.remove("hidden");

  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("date").textContent = new Date().toLocaleDateString(lang, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  document.getElementById("description").textContent = capitalize(data.weather[0].description);
  document.getElementById("temp").textContent = data.main.temp.toFixed(1);
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showError(msg) {
  weatherInfo.classList.add("hidden");
  errorDiv.textContent = `⚠️ ${msg}`;
  errorDiv.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  const lang = languageSelect.value || "en";
  if (city) getWeather(city, lang);
});

locBtn.addEventListener("click", () => {
  const lang = languageSelect.value || "en";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success => {
      const { latitude, longitude } = success.coords;
      getWeatherByCoords(latitude, longitude, lang);
    }, () => showError("Location access denied."));
  } else {
    showError("Geolocation not supported.");
  }
});

// On load, show empty/default page
window.addEventListener("load", () => {
  weatherInfo.classList.add("hidden");
  errorDiv.classList.add("hidden");
});
