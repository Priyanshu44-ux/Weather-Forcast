const API_KEY = "0a09faef31d6e03cefaa9df426d1565a";

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();
  
  if (!city) {
    alert("Please enter a city name");
    const marker = document.getElementById("earthMarker");
    marker?.classList.add("hidden");
    return;
  }

  // Show loading message
  const card = document.getElementById("weatherDisplay");
  card.classList.remove("hidden");
  card.innerHTML = `<p style="padding: 20px; font-size: 1.1rem;">⏳ Loading weather for ${city}...</p>`;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod === 401) {
      card.innerHTML = `
        <p style="color: #ff6b6b; padding: 20px;">
          ❌ Invalid API Key.<br><br>
          Your key is probably still activating.<br>
          Please wait 1–2 hours and try again.
        </p>`;
      const marker = document.getElementById("earthMarker");
      marker?.classList.add("hidden");
      return;
    }
    if (data.cod === 404) {
      alert("City not found! Please check spelling.");
      card.classList.add("hidden");
      const marker = document.getElementById("earthMarker");
      marker?.classList.add("hidden");
      return;
    }
    if (data.cod !== 200) {
      alert("Error: " + (data.message || "Something went wrong"));
      card.classList.add("hidden");
      const marker = document.getElementById("earthMarker");
      marker?.classList.add("hidden");
      return;
    }

    // Success - show weather
    displayWeather(data);
  } catch (error) {
    card.innerHTML = `<p style="color: #ff6b6b; padding: 20px;">Network error. Check your internet.</p>`;
    const marker = document.getElementById("earthMarker");
    marker?.classList.add("hidden");
  }
}

function displayWeather(data) {
  const card = document.getElementById("weatherDisplay");
  
  positionEarthMarker(data.coord.lat, data.coord.lon);

  card.innerHTML = `
    <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
    <div class="temp">${Math.round(data.main.temp)}°C</div>
    <div class="description">${data.weather[0].description}</div>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather icon" width="120">
    
    <div class="details">
      <div class="detail-item">
        <strong>Feels like</strong><br>${Math.round(data.main.feels_like)}°C
      </div>
      <div class="detail-item">
        <strong>Humidity</strong><br>${data.main.humidity}%
      </div>
      <div class="detail-item">
        <strong>Wind</strong><br>${data.wind.speed} m/s
      </div>
      <div class="detail-item">
        <strong>Pressure</strong><br>${data.main.pressure} hPa
      </div>
    </div>
  `;
}

function positionEarthMarker(lat, lon) {
  if (!globe) return;

  globe.pointsData([
    {
      lat: lat,
      lng: lon,
      size: 0.5,
      color: "cyan"
    }
  ]);
}

let globe;

function initGlobe() {
  globe = Globe()(document.getElementById("globeContainer"))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('rgba(0,0,0,0)');

  globe.width(260);
  globe.height(260);

  // Auto rotation
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;
}

initGlobe();
