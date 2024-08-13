// USER LOGIN
function restoreUserInfo() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            document.getElementById('avatar').src = user.avatarUrl;
            document.getElementById('username').textContent = user.name;
            document.getElementById('rank').textContent = user.rank;
            CheckRank(user);
        } catch (error) {
            console.error("Error parsing stored user data:", error);
        }
    } else {
        console.log("No user info found in localStorage.");
    }
}

function loadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.querySelector('.progress');
    if (loadingScreen.style.display == 'none') {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = 1;
        let progress = 0;

        function updateProgress() {
            if (progress < 100) {
                progress += 1;
                progressBar.style.width = progress + '%';
                setTimeout(updateProgress, 20); // Điều chỉnh tốc độ tiến trình nếu cần
            } else {
                // Đợi 0.5 giây trước khi ẩn trang loading
                setTimeout(() => {
                    loadingScreen.style.opacity = 0;
                    mainContent.style.display = 'block';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 300); // Đợi 0.5 giây để hiệu ứng chuyển tiếp hoạt động
                }, 500); // Đợi 0.5 giây sau khi đạt 100%
            }
        }
        updateProgress();
    }
}

function CheckRank(user = null) {
    if (!user) {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            console.log("No user info found in localStorage.");
            return;
        }
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
            console.error("Error parsing stored user data:", error);
            return;
        }
    }

    const body = document.querySelector('body');
    const bannerImg = document.querySelector('.banner img');
    const rank = user.rank || 'Normal';
    
    loadingScreen();
    body.classList.remove('AETH-mode', 'Priority-mode', 'Normal-mode');
    
    // Thay đổi lớp của body dựa trên giá trị rank
    if (rank === 'Priority') {
        body.classList.add('Priority-mode');
        // Thay đổi nguồn của hình ảnh nếu rank là 'Priority'
        bannerImg.src = '/DATA/Banner/PriorityDark.png';
    } else if (rank === 'AETH - Priority') {
        body.classList.add('AETH-mode', 'Priority-mode');
        // Thay đổi nguồn của hình ảnh nếu rank là 'AETH - Priority'
        bannerImg.src = '/DATA/Banner/PriorityDark.png';
    } else if (rank === 'Admin - Ultimate') {
        body.classList.add('AETH-mode', 'Priority-mode', 'Dev-mode');
        // Thay đổi nguồn của hình ảnh nếu rank là 'Admin - Ultimate'
        bannerImg.src = '/DATA/Banner/PriorityDark.png';
    } else {
        body.classList.add('Normal-mode');
        // Thay đổi nguồn của hình ảnh nếu rank là khác
        bannerImg.src = '/DATA/Banner/Dark.png';
    }
    
}


function Login() {
    Swal.fire({
        title: 'Nhập ID Facebook:',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        showLoaderOnConfirm: true,
        preConfirm: (userInput) => {
            userInput = userInput.trim();
            if (userInput) {
                return fetch('/DATA/DataBase/UserFull.csv')
                    .then(response => {
                        if (!response.ok) throw new Error(response.statusText);
                        return response.text();
                    })
                    .then(csvText => parseCSV(csvText, userInput))
                    .catch(error => {
                        Swal.showValidationMessage('Người dùng không tồn tại.');
                    });
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            const user = result.value;
            updateUserInfo(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            DoneSignIn('Đăng nhập thành công');
            CheckRank(user);
        }
    });
}

function parseCSV(csvText, userInput) {
    let foundUser = null;
    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const users = results.data;
            for (const user of users) {
                const uid = user.UID.trim();
                const name = user.Name.trim();
                const link = user.Link.trim();
                let rank = user.Rank ? user.Rank.trim() : "Thành viên";

                if (userInput === uid || userInput === link ) {
                    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
                    foundUser = { uid, name, avatarUrl, rank };
                    break;
                }
            }
        }
    });
    if (!foundUser) throw new Error('Người dùng không tồn tại.');
    return foundUser;
}

function updateUserInfo(user) {
    document.getElementById('avatar').src = user.avatarUrl;
    document.getElementById('username').textContent = user.name;
    document.getElementById('rank').textContent = user.rank;
}

// WEATHER
const apiKey = 'KZH7P9GUL9SBMVQ5MV4WDF23L'; // Thay thế bằng API Key của bạn

function getWeatherAuto() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                localStorage.setItem('location', `${lat},${lon}`);
                fetchWeather(lat, lon);
            },
            () => {
                // Nếu không thể lấy vị trí, sử dụng IP để lấy thời tiết
                getWeatherByIP();
            }
        );
    } else {
        // Nếu trình duyệt không hỗ trợ định vị, sử dụng IP để lấy thời tiết
        getWeatherByIP();
    }
}

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

    reverseGeocodeNominatim(latitude, longitude).then(({ address, addressFull }) => {
        // Cập nhật nội dung trên giao diện người dùng
        document.getElementById('location').innerHTML = addressFull;
        document.getElementById('weather').innerHTML = `<p>${address} <i class="fa-solid fa-location-arrow" aria-hidden="true"></i></p>
  <div class="flex">
    <img src="${conditionIcon}" alt="${conditionText}" />
      <h1>${currentConditions.temp.toFixed(0)}°C</h1></div>
    </div>
      
      `;
    }).catch(error => {
        console.error('Lỗi khi lấy địa điểm:', error);
    });

    // Hiển thị thông tin điều kiện thời tiết
    document.getElementById('condition').innerHTML = `<img src="${conditionIcon}" alt="${conditionText}" /><h5>${conditionText}</h5>
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
        // Khởi tạo giá trị mặc định cho address và addressFull
        let address = '';
        let addressFull = '';

        if (data.address) {
            if (data.address.village !== undefined) {
                const originalSuburb = data.address.village || '';  // Đảm bảo có giá trị mặc định
                const formattedSuburb = originalSuburb.replace(/^Xã\s/, 'X.');
                address = formattedSuburb;
            } else if (data.address.quarter !== undefined) {
                address = data.address.quarter;
            } else {
                const originalSuburb = data.address.suburb || '';  // Đảm bảo có giá trị mặc định
                const formattedSuburb = originalSuburb.replace(/^Phường\s/, 'P.');
                address = formattedSuburb;
            }
            addressFull = data.display_name;

        } else {
            throw new Error('Không thể tìm thấy địa điểm.');
        }

        return {
            address: address.trim(),
            addressFull: addressFull.trim()
        };
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
        Info('Vui lòng nhập địa điểm.');
    }
}

//ANIMATION
function weatherAll() {
    var weatherAll = document.getElementById("weatherAll");

    if (weatherAll.style.display === "block") {
        weatherAll.classList.add('animate__fadeOutUp');
        weatherAll.addEventListener('animationend', function () {
            weatherAll.style.display = 'none';
            weatherAll.classList.remove('animate__fadeOutUp');
        }, { once: true });
    } else {
        weatherAll.style.display = 'block';
        weatherAll.classList.add('animate__fadeInDown');
        weatherAll.addEventListener('animationend', function () {
            weatherAll.classList.remove('animate__fadeInDown');
        }, { once: true });
    }
}

function SettingAll() {
    var SettingAll = document.getElementById("SettingAll");

    if (SettingAll.style.display === "block") {
        SettingAll.classList.add('animate__fadeOutUp');
        SettingAll.addEventListener('animationend', function () {
            SettingAll.style.display = 'none';
            SettingAll.classList.remove('animate__fadeOutUp');
        }, { once: true });
    } else {
        SettingAll.style.display = 'block';
        SettingAll.classList.add('animate__fadeInDown');
        SettingAll.addEventListener('animationend', function () {
            SettingAll.classList.remove('animate__fadeInDown');
        }, { once: true });
    }
}

//SweetAlert2
function Done(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'success'
    )
}

function Fail(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'error'
    )
}

function Warning(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'warning'
    )
}

function Info(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'info'
    )
}

function DoneSignIn(T1) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: T1
    });
}


//MENU
const list = document.querySelector('.list');
let isDown = false;
let startX;
let scrollLeft;

list.addEventListener('mousedown', (e) => {
    isDown = true;
    list.classList.add('active');
    startX = e.pageX - list.offsetLeft;
    scrollLeft = list.scrollLeft;
});

list.addEventListener('mouseleave', () => {
    isDown = false;
    list.classList.remove('active');
});

list.addEventListener('mouseup', () => {
    isDown = false;
    list.classList.remove('active');
});

list.addEventListener('mousemove', (e) => {
    if (!isDown) return; // Nếu không nhấn chuột thì không làm gì
    e.preventDefault();
    const x = e.pageX - list.offsetLeft;
    const walk = (x - startX) * 2; // Tốc độ kéo
    list.scrollLeft = scrollLeft - walk;
});


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

//SETTING

const defaultSwitchStates = {
    toggleGas: false,        // Mặc định là tắt
    toggleWeather: false,    // Mặc định là tắt
    toggleLogin: true        // Mặc định là bật
};

// Lấy trạng thái từ localStorage khi tải trang
document.addEventListener("DOMContentLoaded", function () {
    // Cài đặt trạng thái mặc định từ cấu hình
    for (const [id, defaultState] of Object.entries(defaultSwitchStates)) {
        const savedState = localStorage.getItem(id);
        const isChecked = savedState !== null ? savedState === 'true' : defaultState;
        document.getElementById(id).checked = isChecked;

        // Gọi hàm tương ứng nếu công tắc được bật
        if (isChecked) {
            switch (id) {
                case 'toggleGas':
                    fetchData();
                    break;
                case 'toggleWeather':
                    getWeatherAuto();
                    break;
                case 'toggleLogin':
                    restoreUserInfo();
                    break;
            }
        }
    }
});

// Xử lý sự kiện khi nhấn công tắc
document.querySelectorAll('.switch input').forEach(function (el) {
    el.addEventListener('change', function () {
        const id = this.id;
        const status = this.checked;
        localStorage.setItem(id, status);

        // Gọi hàm tương ứng nếu công tắc được bật
        if (status) {
            switch (id) {
                case 'toggleGas':
                    fetchData();
                    break;
                case 'toggleWeather':
                    getWeatherAuto();
                    break;
                case 'toggleLogin':
                    restoreUserInfo();
                    break;
            }
        }
    });
});

function ClearData() {
    Swal.fire({
        title: 'Xác nhận đặt tất cả ?',
        text: 'Nếu xác nhận toàn bộ dữ liệu [Ngoại trừ lịch sử chuyến đi] sẽ bị xoá và đặt lại.',
        icon: 'warning',

        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            Swal.fire(
                'Đã xoá thành công',
                'Tất cả mục đã bị xoá.',
                'success',
            ).then(() => {
                localStorage.clear();
                location.reload();
            });
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.querySelector('.progress');

    let progress = 0;

    function updateProgress() {
        if (progress < 100) {
            progress += 1;
            progressBar.style.width = progress + '%';
            setTimeout(updateProgress, 20); // Điều chỉnh tốc độ tiến trình nếu cần
        } else {
            // Đợi 0.5 giây trước khi ẩn trang loading
            setTimeout(() => {
                loadingScreen.style.opacity = 0;
                mainContent.style.display = 'block';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300); // Đợi 0.5 giây để hiệu ứng chuyển tiếp hoạt động
            }, 500); // Đợi 0.5 giây sau khi đạt 100%
        }
    }
    updateProgress();
});


// Lưu trữ các hàm console gốc
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;
const originalInfo = console.info;

// Hàm để định dạng thời gian hiện tại
function formatTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').replace('Z', '');
}

// Hàm để ghi log vào #ErrorLog với kiểu
function writeToErrorLog(message, type) {
    const errorLog = document.getElementById('ErrorLog');
    if (errorLog) {
        const newMessage = document.createElement('div');
        newMessage.className = type;

        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'timestamp';
        timestampSpan.textContent = `[${formatTimestamp()}] `;

        const messageSpan = document.createElement('span');
        messageSpan.className = 'message';
        messageSpan.textContent = (typeof message === 'object' && message !== null) ? JSON.stringify(message, null, 2) : message;

        newMessage.appendChild(timestampSpan);
        newMessage.appendChild(messageSpan);
        errorLog.appendChild(newMessage);
        errorLog.scrollTop = errorLog.scrollHeight; // Tự động cuộn xuống cuối
    }
}

// Ghi đè console.log
console.log = function (...args) {
    writeToErrorLog(args.length === 1 ? args[0] : args, 'log');
    originalLog.apply(console, args);
};

// Ghi đè console.error
console.error = function (...args) {
    writeToErrorLog(args.length === 1 ? args[0] : args, 'error');
    originalError.apply(console, args);
};

// Ghi đè console.warn
console.warn = function (...args) {
    writeToErrorLog(args.length === 1 ? args[0] : args, 'warn');
    originalWarn.apply(console, args);
};

// Ghi đè console.info
console.info = function (...args) {
    writeToErrorLog(args.length === 1 ? args[0] : args, 'info');
    originalInfo.apply(console, args);
};


//DarkMode
const toggleThemeButton = document.getElementById('toggle-theme');
const bodyElement = document.body;

// Set the initial state based on localStorage
const isDarkModeFromLocalStorage = localStorage.getItem('darkMode') === 'true';
if (isDarkModeFromLocalStorage) {
    bodyElement.classList.add('Dark-mode');
    toggleThemeButton.checked = true;
} else {
    toggleThemeButton.checked = false;
}

toggleThemeButton.addEventListener('change', () => {
    const isDarkMode = toggleThemeButton.checked;

    if (isDarkMode) {
        bodyElement.classList.add('Dark-mode');
    } else {
        bodyElement.classList.remove('Dark-mode');
    }
    // Save the state in localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
});
