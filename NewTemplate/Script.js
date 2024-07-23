const apiKey = 'bc74caf431bd4ff3aee191233242307';

// Bảng ánh xạ từ hướng gió quốc tế sang thuần Việt
const windDirectionMap = {
    'N': 'Bắc',
    'NNE': 'Bắc Đông Bắc',
    'NE': 'Đông Bắc',
    'ENE': 'Đông Bắc Đông',
    'E': 'Đông',
    'ESE': 'Đông Đông Nam',
    'SE': 'Đông Nam',
    'SSE': 'Nam Đông Nam',
    'S': 'Nam',
    'SSW': 'Nam Tây Nam',
    'SW': 'Tây Nam',
    'WSW': 'Tây Tây Nam',
    'W': 'Tây',
    'WNW': 'Tây Bắc Tây',
    'NW': 'Tây Bắc',
    'NNW': 'Bắc Tây Bắc'
};
// Bảng ánh xạ mã điều kiện thời tiết sang mô tả tiếng Việt
const weatherConditionMap = {
    1000: 'Trời quang đãng',
    1003: 'Có mây',
    1006: 'Có mây',
    1009: 'Trời nhiều mây',
    1030: 'Sương mù',
    1063: 'Mưa rào lác đác',
    1066: 'Tuyết nhẹ',
    1069: 'Mưa tuyết',
    1072: 'Sương mù và mưa rào nhẹ',
    1087: 'Bão tố',
    1114: 'Tuyết và bão tuyết',
    1117: 'Tuyết dày và bão tuyết',
    1135: 'Mưa nhỏ',
    1139: 'Mưa nhẹ',
    1147: 'Sương mù dày',
    1150: 'Mưa nhỏ và sương mù',
    1153: 'Mưa nhỏ và sương mù',
    1168: 'Mưa nhẹ và băng giá',
    1171: 'Mưa nhẹ và băng giá',
    1180: 'Mưa rào và sương mù',
    1183: 'Mưa rào nhẹ',
    1186: 'Mưa rào nhẹ và sương mù',
    1189: 'Mưa rào',
    1192: 'Mưa rào lớn',
    1194: 'Mưa rào lớn và gió mạnh',
    1195: 'Mưa rào lớn và sấm sét',
    1198: 'Mưa tuyết',
    1199: 'Mưa tuyết dày',
    1200: 'Tuyết nhẹ',
    1201: 'Tuyết dày',
    1204: 'Tuyết và mưa rào nhẹ',
    1207: 'Tuyết và sương mù',
    1210: 'Tuyết rơi',
    1213: 'Tuyết rơi nhẹ',
    1216: 'Tuyết rơi dày',
    1219: 'Tuyết và sương mù',
    1222: 'Bão tuyết',
    1225: 'Bão tuyết và gió mạnh',
    1230: 'Tuyết và mưa rào',
    1233: 'Bão tuyết và sương mù',
    1234: 'Bão tuyết dày'
};

async function fetchWeather(latitude, longitude) {
    const location = `${latitude},${longitude}`;
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
    const data = await response.json();

    // Xử lý thông tin điều kiện thời tiết
    const conditionCode = data.current.condition.code;
    const conditionText = weatherConditionMap[conditionCode] || data.current.condition.text;
    const conditionIcon = data.current.condition.icon;

    document.getElementById('location').innerHTML = `<i class="fa-solid fa-location-arrow"></i> ${data.location.name}, ${data.location.region}, ${data.location.country} `;
    document.getElementById('temperature').innerHTML = `<i class="fa-solid fa-temperature-three-quarters"></i> ${data.current.temp_c}°C`;
    document.getElementById('rain_chance').innerHTML = `<i class="fa-solid fa-cloud-rain"></i> ${data.current.precip_mm} mm`;
    document.getElementById('uv_index').innerHTML = `<i class="fa-solid fa-sun"></i> UV: ${data.current.uv}`;

    // Chuyển đổi gió hướng sang định dạng thuần Việt
    const windDir = data.current.wind_dir;
    const windDirection = windDirectionMap[windDir] || windDir;
    document.getElementById('wind_direction').innerHTML = `<i class="fa-solid fa-wind"></i> ${windDirection} với tốc độ ${data.current.wind_kph} km/h`;

    document.getElementById('weather').innerHTML = `<p> ${data.location.name} <i class="fa-solid fa-location-arrow"></i></p>
      <h1>${data.current.temp_c.toFixed(0)}°C</h1>
    `
    // Hiển thị thông tin điều kiện thời tiết
    document.getElementById('condition').innerHTML = `
        <div>Điều kiện thời tiết: ${conditionText}</div>
        <img src="${conditionIcon}" alt="${conditionText}" />
    `;
}
async function getWeatherByIP() {
    try {
        // Thay YOUR_TOKEN bằng token API của bạn từ ipinfo.io
        const ipResponse = await fetch('https://ipinfo.io/json?token=8c35ace05458e6');
        const ipData = await ipResponse.json();

        // Xuất thêm thông tin về IP và tổ chức
        document.getElementById('ip').innerText = `IP: ${ipData.ip}`;
        document.getElementById('organization').innerText = `Tổ chức: ${ipData.org}`;

        if (ipData.loc) {
            const [latitude, longitude] = ipData.loc.split(',');
            fetchWeather(latitude, longitude);
        } else {
            console.error('Không tìm thấy thông tin tọa độ từ IP.');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin từ IP:', error);
    }
}


function getWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(lat, lon);
        }, error => {
            console.error('Lỗi khi lấy thông tin định vị:', error);
        });
    } else {
        alert('Trình duyệt của bạn không hỗ trợ định vị địa lý.');
    }
}

function getWeatherByManual() {
    const manualLocation = document.getElementById('manualLocation').value;
    if (manualLocation) {
        fetchWeather(manualLocation);
    } else {
        alert('Vui lòng nhập địa điểm.');
    }
}

getWeatherByIP();

function weatherAll() {
    var weatherAll = document.getElementById("weatherAll");

    if (weatherAll.style.display === "block") {
        // Thêm lớp fadeOut để làm mờ và ẩn phần tử
        weatherAll.classList.add('animate__fadeOutUp');
        weatherAll.addEventListener('animationend', function() {
            weatherAll.style.display = 'none';
            weatherAll.classList.remove('animate__fadeOutUp');
        }, { once: true });
    } else {
        // Đặt display là block trước khi thêm lớp fadeIn
        weatherAll.style.display = 'block';
        weatherAll.classList.add('animate__fadeInDown');
        weatherAll.addEventListener('animationend', function() {
            weatherAll.classList.remove('animate__fadeInDown');
        }, { once: true });
    }
}
