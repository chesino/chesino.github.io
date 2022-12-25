const input = document.querySelector("#input");
const city = document.querySelector("#city");

const cityName = document.querySelector("#cityName");
const Temp = document.querySelector("#temp");
const main = document.querySelector("#main");
const discription = document.querySelector("#discription");
const image = document.querySelector("#image");

input.onsubmit = (e) => {
  e.preventDefault();
  weatherUpdate(city.value);
  city.value = "";
};

weatherUpdate = (city) => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cad7ec124945dcfff04e457e76760d90`);
  // in place of appid enter your open weather API Key
  // You can create it for free
  // https://home.openweathermap.org/users/sign_up

  xhr.send();
  xhr.onload = () => {
    if (xhr.status === 404) {
      alert("Không tìm thấy");
    } else {
      var data = JSON.parse(xhr.response);
      cityName.innerHTML = data.name;
      Temp.innerHTML = `${Math.round(data.main.temp - 273.15)}°C`;
      main.innerHTML = data.weather[0].main;
     
      image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      
      var TrangThai = data.weather[0].main;
      if (TrangThai == 'Clouds') {
        main.innerHTML = 'Có Mây';
      }else {
        if (TrangThai == 'Snow') {
            main.innerHTML = 'Có Tuyết';
          }else{
            main.innerHTML = data.weather[0].main;
          }
      }
      
      
      var dTrangThai = data.weather[0].description;
      if (dTrangThai == 'overcast clouds') {
        discription.innerHTML = 'Nhiều Mây';
      }else {
        if (dTrangThai == 'light snow') {
            discription.innerHTML = 'Có Tuyết Nhẹ';
          }else {
            discription.innerHTML = data.weather[0].description;
          }
      }
      



    }
  };
};

weatherUpdate("Long+Thành");

