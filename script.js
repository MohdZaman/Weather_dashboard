const apiKey = "7ced87751ac776502b878e8edc2d7961";

const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const errorDiv = document.getElementById("error");
const languageSelect = document.getElementById("languageSelect");

// Fetch weather by city name
async function getWeather(city, lang = "en") {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${lang}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod != 200) throw new Error(data.message);

    displayWeather(data, lang);
  } catch (err) {
    showError(err.message);
  }
}

// Fetch weather by coordinates
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

// Display weather data
function displayWeather(data, lang) {
  errorDiv.classList.add("hidden");
  weatherInfo.classList.remove("hidden");

  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("date").textContent = new Date().toLocaleDateString(lang, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("description").textContent = capitalize(data.weather[0].description);
  document.getElementById("temp").textContent = data.main.temp.toFixed(1);
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  // 🌤️ Change background according to weather
 // Determine if it's night or day using icon code (e.g. "01n" for night)
const isNight = data.weather[0].icon.includes("n");
changeBackgroundImage(data.weather[0].main, isNight);

}

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show error
function showError(msg) {
  weatherInfo.classList.add("hidden");
  errorDiv.textContent = `⚠️ ${msg}`;
  errorDiv.classList.remove("hidden");
}

// 🌈 Change background image dynamically
function changeBackgroundImage(condition, isNight) {
  let imageUrl;

  const c = condition.toLowerCase();

  if (isNight) {
    // 🌙 Night backgrounds
    switch (c) {
      case "clear":
        imageUrl = "https://images.unsplash.com/photo-1507502707541-f369a3b18502?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688"; // clear night (stars)
        break;
      case "clouds":
        imageUrl = "https://i.gifer.com/5UdL.gif"; // cloudy night
        break;
      case "rain":
      case "drizzle":
        imageUrl = "https://i.gifer.com/7hi3.gif"; // rainy night
        break;
      case "thunderstorm":
        imageUrl = "https://i.gifer.com/OtX.gif"; // lightning night
        break;
      case "snow":
        imageUrl = "https://i.gifer.com/YY5R.gif"; // snowy night
        break;
      case "mist":
      case "fog":
      case "haze":
        imageUrl = "https://i.gifer.com/1KCm.gif"; // foggy night
        break;
      default:
        imageUrl = "https://i.gifer.com/Ir3.gif"; // fallback starry
    }
  } else {
    // 🌞 Day backgrounds
    switch (c) {
      case "clear":
        imageUrl = "https://images.unsplash.com/photo-1563630381190-77c336ea545a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=689"; // sunny
        break;
      case "clouds":
        imageUrl = "https://i.gifer.com/1KL8.gif"; // cloudy
        break;
      case "rain":
      case "drizzle":
        imageUrl = "https://i.gifer.com/Ma4.gif"; // rain
        break;
      case "thunderstorm":
        imageUrl = "https://i.gifer.com/7OVu.gif"; // thunderstorm
        break;
      case "snow":
        imageUrl = "https://i.gifer.com/YWuH.gif"; // snow
        break;
      case "mist":
      case "fog":
      case "haze":
        imageUrl = "https://i.gifer.com/1KCm.gif"; // fog
        break;
      default:
        imageUrl = "https://i.gifer.com/7VE.gif"; // fallback sunny
    }
  }

  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.transition = "background-image 1s ease-in-out";
}


// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  const lang = languageSelect.value || "en";
  if (city) getWeather(city, lang);
});

locBtn.addEventListener("click", () => {
  const lang = languageSelect.value || "en";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      success => {
        const { latitude, longitude } = success.coords;
        getWeatherByCoords(latitude, longitude, lang);
      },
      () => showError("Location access denied.")
    );
  } else {
    showError("Geolocation not supported.");
  }
});

// On load
window.addEventListener("load", () => {
  weatherInfo.classList.add("hidden");
  errorDiv.classList.add("hidden");
});
