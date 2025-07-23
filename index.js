const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grandAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const wrapper = document.querySelector(".wrapper"); // Ensure this exists


// to know exactly where to switch if you're on yser then current will be user and switch to search and vice versa

// by default current tab will be usertab
let currentTab = userTab;

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const UNSPLASH_ACCESS_KEY = "3vD_Bc-KNxU6Rb-9puDEEJP9Nc90IfcUwTr4VzNkGXA";

// current tab means the tab which is currently selected
//clicked tab means now this tab will bw current tab and previous tab will not be current
// we can say current as old and clicked as new
currentTab.classList.add("current-tab");

getfromSessionStroage();

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    // agar search form me active class enable nahi hai ( disabled hai ) mtlb hame usko enable krna hai kyuki us tab pr hi click hua hai, agar search waa tab active hota hai to user wala tab or grant acess wale tab ko hide krna hoga to unki active class remove kardo or search ki active kro
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grandAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // phle search tab pr the or ab user wale pr jana hai mtlb search wala active hai usko deactive krna hai or user wale ko activate krna hai
      // seach form hidden
      searchForm.classList.remove("active");
      // info showed on display when we search for any city is hidden
      userInfoContainer.classList.remove("active");

      // now we're in your weather tab , so we have to display weather too , so now we have to check local stroage first for coordinates, if we have them there
      getfromSessionStroage();
    }
  }
}

userTab.addEventListener("click", () => {
  // usertab pr click hone pr event listener invoke hoga or switchtab function ko call karega

  //pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // searchtab pr click hone pr event listener invoke hoga or switchtab function ko call karega

  //pass clicked tab as input parameter
  switchTab(searchTab);
});

// check if coordinated are already present in session strogae or not
function getfromSessionStroage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // agar local coordinate nahi mile mtlb saved nahi hai

    grandAccessContainer.classList.add("active");
  } else {
    // agar coordinates hai to unko use krke API call kro

    // convert them into JSON
    const coordinates = JSON.parse(localCoordinates);

    // fetch use weather info according to coordinates
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;

  // make grant coordinates hidden ( we want to show weather information so)
  grandAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // calling API

  try {
    const response = await fetch(
      // API called using lat and lon
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    // remove loader as data is fetched

    loadingScreen.classList.remove("active");

    // make UI visble of user tab to show the fetched data

    userInfoContainer.classList.add("active");

    // this function will extract the values from the response and rendor on UI
    // data is passed as a parameter

    renderWeatherInfo(data);
    fetchCityImage(data.name); // Added function call to fetch background image based on city name
  } catch (err) {
    //hw
    loadingScreen.classList.remove("active");
  }
  
  
}

function renderWeatherInfo(weatherInfo) {
  // firstly we have to fetch the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  console.log(weatherInfo);

  // option chaining operator [.?] -> this operator allows you to safely access deeply nested properties of an ovject without causing error if a property is null or undefined

  // make easier to access nexted properties (JSON INSIDE JSON )

  // if we want to access a particular property from inside json then we can do this via OPTION CHAINING OPERATOR

  // if the value which we want to access is not available then this operator will not throw a error and give a undefine value

  // in simple if property exist then return it, if not then return undefine (not throw error)

  // fetch values from weatherinfo object and put it on UI

  // weather info mese name nikala jo ki response me ayega or vo direct child hai to direct name likha hai
  // ab usko cityname k innertext me store kiya hai so UI me show ho ske'

  cityName.innerText = weatherInfo?.name;

  //   now here cdn ki link hai usme appne weatherinfo k andr sys k andr country ki info thi usko nikala usko lowercase me convert kra then link k thrown icon aagya

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  //   weatherinfo k andr weather k andr description pda hai but weather ek array hai to usko index k through access kra hai yha

  desc.innerText = weatherInfo?.weather?.[0]?.description;

  // weather icon k src me diya hai
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  // temprature
  temp.innerText = `${weatherInfo?.main?.temp} °C`;

  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}



async function fetchCityImage(city) {
  try {
      const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${city} monument&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      const imageUrl = data?.urls?.regular;

      if (imageUrl) {
          wrapper.style.backgroundImage = `url(${imageUrl})`;
      }
  } catch (error) {
      console.error("Error fetching city image:", error);
  }
}

function getLocation() {
  // checking if browser support geolocation or not
  // if yes then find the location
  // callback fucntion is used (showposition)
  if (navigator.geolocation) {
    // finding coordinates
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("No geolocation support available");
  }
}

function showPosition(position) {
  const userCoordinates = {
    // finding longitude and latitude based on coordinates
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  // save the location to use further in sessionstorage and name it as user-coordinates
  // convert into String using json stringfy
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}
// event listener on button , on click it will invoke getlocation function to fetch user location
grantAccessButton.addEventListener("click", getLocation);

// now if we want to search weather for a city, so we have to fetch the input and give it in a api call

const searchInput = document.querySelector("[data-searchInput]");

//adding event listner on input whenever a input is submitted the fucnyion will extact city name and fetch and give it to api
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  // activate loader
  loadingScreen.classList.add("active");
  // remove previocs weather
  userInfoContainer.classList.remove("active");
  // remove
  grandAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    fetchCityImage(data.name); // Added function call to fetch background image based on city name
  } catch (err) {
    //hW
  }
}
