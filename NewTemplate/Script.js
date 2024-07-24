const apiKey = 'KZH7P9GUL9SBMVQ5MV4WDF23L'; // Thay thế bằng API Key của bạn

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
    'clear-day': 'Trời quang đãng',
    'clear-night': 'Trời quang đãng',
    'partly-cloudy-day': 'Có mây',
    'partly-cloudy-night': 'Có mây',
    'cloudy': 'Trời nhiều mây',
    'rain': 'Mưa rào',
    'sleet': 'Mưa tuyết',
    'snow': 'Tuyết rơi',
    'wind': 'Gió',
    'fog': 'Sương mù',
    'hail': 'Mưa đá',
    'thunderstorm': 'Bão tố'
};

async function fetchWeather(latitude, longitude) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=${apiKey}&contentType=json`);
    const data = await response.json();


    
    // Xử lý thông tin điều kiện thời tiết
    const currentConditions = data.currentConditions;
    const conditionCode = currentConditions.icon;
    const conditionText = weatherConditionMap[conditionCode] || currentConditions.conditions;
    const conditionIcon = `/DATA/Weather/${conditionCode}.svg`;

    
    document.getElementById('temperature').innerHTML = `${currentConditions.temp.toFixed(0)}°C`;
    document.getElementById('rain_chance').innerHTML = `<i class="fa-solid fa-cloud-rain"></i> ${currentConditions.precip !== null ? currentConditions.precip.toFixed(1) : 0} mm`;
    document.getElementById('uv_index').innerHTML = `<i class="fa-solid fa-sun"></i> UV: ${currentConditions.uvindex}`;

    // Chuyển đổi gió hướng sang định dạng thuần Việt
    const windDir = currentConditions.winddir;
    const windDirection = windDirectionMap[windDir] || windDir;
    document.getElementById('wind_direction').innerHTML = `<i class="fa-solid fa-wind"></i> ${windDirection} ${currentConditions.windspeed.toFixed(1)} km/h`;
    
    reverseGeocodeNominatim(latitude, longitude).then(address => {
        document.getElementById('location').innerHTML = address;
        document.getElementById('weather').innerHTML = `<p> ${address} <i class="fa-solid fa-location-arrow"></i></p>
        <h1>${currentConditions.temp.toFixed(0)}°C</h1>
      `;
    }).catch(error => {
        console.error(error);
    });
    
   

    // Hiển thị thông tin điều kiện thời tiết
    document.getElementById('condition').innerHTML = `<p>${conditionText}</p>
        <img src="${conditionIcon}" alt="${conditionText}" />
    `;

    // Hiển thị cảnh báo UV nếu chỉ số UV cao
    const uvIndex = currentConditions.uvindex;
    const uvWarningDiv = document.getElementById('uv_warning');
    const uvWarningText = document.getElementById('uv_warning_text');
    let uvWarningMessage = '';
    let uvWarningColor = '';

    if (uvIndex <= 2) {
        uvWarningMessage = 'UV Thấp: Thích hợp tắm nắng';
        uvWarningColor = '#8fc900';
    } else if (uvIndex <= 5) {
        uvWarningMessage = 'UV Trung Bình: Cần che da';
        uvWarningColor = '#fb0';
    } else if (uvIndex <= 7) {
        uvWarningMessage = 'UV Cao: Hạn chế ra ngoài trời';
        uvWarningColor = '#ff8a00';
    } else if (uvIndex <= 10) {
        uvWarningMessage = 'UV Rất cao: Không nên ra ngoài trời';
        uvWarningColor = '#ff3d00';
    } else {
        uvWarningMessage = 'UV Gắt: Rất có hại';
        uvWarningColor = 'purple';
    }

    if (uvWarningMessage) {
        uvWarningDiv.style.display = 'block';
        uvWarningDiv.style.backgroundColor = uvWarningColor;
        uvWarningText.innerHTML = uvWarningMessage;
    } else {
        uvWarningDiv.style.display = 'none';
    }
}

async function reverseGeocodeNominatim(latitude, longitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        console.log(data);
        
        let address = '';

        if (data.address) {
            if (data.address.village !== undefined) {
                const originalSuburb = data.address.village || '';  // Đảm bảo có giá trị mặc định
                const formattedSuburb = originalSuburb.replace(/^Xã\s/, 'X.');
                address = formattedSuburb;
            } else {
                const originalSuburb = data.address.suburb || '';  // Đảm bảo có giá trị mặc định
                const formattedSuburb = originalSuburb.replace(/^Phường\s/, 'P.');
                address = formattedSuburb;
            }
            
            return address.trim();
        } else {
            throw new Error('Không thể tìm thấy địa điểm.');
        }
    } catch (error) {
        console.error('Lỗi khi tìm địa điểm:', error);
        throw error;  // Ném lỗi để xử lý ở nơi gọi hàm
    }
}



async function getWeatherByIP() {
    try {
        const ipResponse = await fetch('https://ipinfo.io/json?token=8c35ace05458e6');
        const ipData = await ipResponse.json();
         
        document.getElementById('ip').innerText = `IP: ${ipData.ip}`;
        document.getElementById('organization').innerText = `Nhà mạng: ${ipData.org}`;

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
async function geocodeAddress(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
    const data = await response.json();

    if (data.length > 0) {
        const location = data[0];
        return {
            latitude: location.lat,
            longitude: location.lon
        };
        
    } else {
        throw new Error('Không tìm thấy địa điểm.');
    }
  
}

async function getWeatherByManual() {
    const manualLocation = document.getElementById('manualLocation').value;
    if (manualLocation) {
        try {
            const { latitude, longitude } = await geocodeAddress(manualLocation);
            fetchWeather(latitude, longitude);
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert('Vui lòng nhập địa điểm.');
    }
}

function weatherAll() {
    var weatherAll = document.getElementById("weatherAll");

    if (weatherAll.style.display === "block") {
        weatherAll.classList.add('animate__fadeOutUp');
        weatherAll.addEventListener('animationend', function() {
            weatherAll.style.display = 'none';
            weatherAll.classList.remove('animate__fadeOutUp');
        }, { once: true });
    } else {
        weatherAll.style.display = 'block';
        weatherAll.classList.add('animate__fadeInDown');
        weatherAll.addEventListener('animationend', function() {
            weatherAll.classList.remove('animate__fadeInDown');
        }, { once: true });
    }
}
