const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

async function showWeather() {
  // let  latitude = 15.3333;
  // let longitude = 74.0833;
  let city = "goa";

  //calling api
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  // converting fetched data in json
  const data = await response.json();
  //priting data
  console.log("weather data : " , data);
}
