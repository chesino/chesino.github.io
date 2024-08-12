const storedUser = localStorage.getItem('currentUser');
if (storedUser) {
    try {
        const user = JSON.parse(storedUser);
        var customIcon = L.icon({
            iconUrl: `${user.avatarUrl}`, // Đường dẫn đến hình ảnh của biểu tượng
            iconSize: [45, 45], // Kích thước của biểu tượng (chiều rộng, chiều cao)
            popupAnchor: [0, -20] // Điểm neo của popup so với biểu tượng
        });

    } catch (error) {
        console.error("Error parsing stored user data:", error);
    }
} else {
    var customIcon = L.icon({
        iconUrl: './Data/frog.png', // Đường dẫn đến hình ảnh của biểu tượng
        iconSize: [45, 45], // Kích thước của biểu tượng (chiều rộng, chiều cao)
        popupAnchor: [0, -20] // Điểm neo của popup so với biểu tượng
    });
}

// Tạo bản đồ và các lớp bản đồ
var map = L.map('mapboxMap').setView([10.7763897, 106.6985642], 15); // Đặt mức zoom mặc định là 18

var dark = L.tileLayer('https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=bJnZQVl8zwoZ2OblPXlr', {
    attribution: '<a href="https://www.facebook.com/HunqD/">Hùng Đinh</a> Maptiler',
    maxZoom: 22 // Đặt maxZoom 
});

var light = L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=bJnZQVl8zwoZ2OblPXlr', {
    attribution: '<a href="https://www.facebook.com/HunqD/">Hùng Đinh</a> Maptiler',
    maxZoom: 22 // Đặt maxZoom 
});

var satellite = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bJnZQVl8zwoZ2OblPXlr', {
    attribution: '<a href="https://www.facebook.com/HunqD/">Hùng Đinh</a> Maptiler',
    maxZoom: 22 // Đặt maxZoom 
});

// Mặc định sử dụng lớp bản đồ Streets v2 Dark
dark.addTo(map);
map.invalidateSize();

// Hàm thay đổi loại bản đồ
function changeMapType() {
    var mapType = document.getElementById('mapType').value;

    if (mapType === 'streets-v2-dark') {
        map.removeLayer(light);
        map.removeLayer(satellite);
        dark.addTo(map);
    } else if (mapType === 'basic-v2') {
        map.removeLayer(dark);
        map.removeLayer(satellite);
        light.addTo(map);
    } else if (mapType === 'satellite') {
        map.removeLayer(dark);
        map.removeLayer(light);
        satellite.addTo(map);
    }

    map.invalidateSize(); // Đảm bảo kích thước bản đồ được cập nhật
}
// Biến để lưu trữ đánh dấu hiện tại
let currentMarker = null;

const addressInput = document.getElementById('address');
const suggestionsContainer = document.getElementById('suggestions');
const geocoder = new L.Control.Geocoder.Nominatim(); // Sử dụng Geocoder Nominatim

// Hàm debounce để giảm số lượng yêu cầu gửi đến server
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Hàm tìm kiếm địa chỉ và cập nhật gợi ý
function updateSuggestions(query) {
    if (query.length > 2) {
        geocoder.geocode(query, function(results) {
            suggestionsContainer.innerHTML = ''; // Xóa gợi ý cũ

            if (results.length > 0) {
                results.forEach(result => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.textContent = result.name;

                    div.addEventListener('click', function () {
                        addressInput.value = result.name;
                        suggestionsContainer.innerHTML = ''; // Xóa gợi ý
                        const coordinates = [result.center.lat, result.center.lng];
                        if (currentMarker) {
                            currentMarker.remove();
                        }
                        currentMarker = L.marker(coordinates, { icon: customIcon }).addTo(map)
                            .bindPopup(result.properties.name)
                            .openPopup();
                        map.setView(coordinates, 18);
                    });
                    suggestionsContainer.appendChild(div);
                });
            } else {
                suggestionsContainer.innerHTML = '<div class="suggestion-item">Không tìm thấy</div>';
            }
        });
    } else {
        suggestionsContainer.innerHTML = ''; // Xóa gợi ý khi không đủ ký tự
    }
}

// Sử dụng debounce để giảm số lượng yêu cầu
const debouncedUpdateSuggestions = debounce(updateSuggestions, 300);

// Lắng nghe sự kiện input
addressInput.addEventListener('input', function() {
    const query = addressInput.value;
    debouncedUpdateSuggestions(query);
});

// Ẩn danh sách gợi ý khi nhấp ra ngoài
document.addEventListener('click', function(e) {
    if (!addressInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.innerHTML = '';
    }
});




// Hàm tìm kiếm địa chỉ và thêm đánh dấu
function searchAddress() {
    const address = document.getElementById('address').value;

    if (address) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const coordinates = [data[0].lat, data[0].lon];
                    console.log('Coordinates:', coordinates); // Kiểm tra tọa độ

                    if (currentMarker) {
                        currentMarker.remove();
                    }

                    currentMarker = L.marker(coordinates, { icon: customIcon }).addTo(map)
                        .bindPopup('Vị trí của bạn')
                        .openPopup();

                    map.setView(coordinates, 18);
                } else {
                    alert('Không tìm thấy địa chỉ.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi tìm kiếm địa chỉ:', error);
            });
    }
}


// Hàm lấy vị trí hiện tại
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)

                .then(response => response.json())
                .then(data => {
                    if (data.display_name) {
                        document.getElementById('address').value = data.display_name;

                        if (currentMarker) {
                            currentMarker.remove();
                        }

                        currentMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
                            .bindPopup('Bạn đang ở đây')
                            .openPopup();

                        map.setView([lat, lng], 18);
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi lấy địa chỉ hiện tại:', error);
                });
        }, error => {
            console.error('Lỗi khi lấy vị trí hiện tại:', error);
        });
    } else {
        Warning('Trình duyệt của bạn không hỗ trợ Geolocation.');
    }
}

// Hàm mở Google Maps
function Google() {
    if (currentMarker) {
        const lat = currentMarker.getLatLng().lat;
        const lng = currentMarker.getLatLng().lng;
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
        Warning('Không có vị trí hiện tại.');
    }
}

$(function () {
    var star = '.star',
        selected = '.selected';

    $(star).on('click', function () {
        $(selected).each(function () {
            $(this).removeClass('selected');
        });
        $(this).addClass('selected');
    });

});

// Hàm lưu vào localStorage
function saveToLocalStorage() {
    const placeName = document.getElementById('placeName').value;
    let address;

    if (currentMarker) {
        const lat = currentMarker.getLatLng().lat;
        const lng = currentMarker.getLatLng().lng;
        address = `https://www.google.com/maps?q=${lat},${lng}`;
    } else {
        address = document.getElementById('address').value;
    }
    const numberOfPeople = document.getElementById('numberOfPeople').value;
    const price = document.getElementById('price').value;
    const priceraw = document.getElementById('price').dataset.rawValue;
    const time = document.getElementById('time').value;
    const date = document.getElementById('date').value;
    const note = document.getElementById('note').value;
    var ratingElement = document.querySelector('.ratings .star.selected');
    var rating = null;
    if (ratingElement) {
        rating = ratingElement.getAttribute('data-rating');
    } else {
        // Thông báo nếu phần tử không tồn tại
        rating = 0;
    }

    if (!placeName || !numberOfPeople || !price || !date) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
        return;
    }

    var paymentPerPerson = priceraw / numberOfPeople;

    const historyEntry = {
        placeName,
        address,
        numberOfPeople,
        price,
        time,
        date,
        note,
        rating,
        paymentPerPerson
    };

    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(historyEntry);

    localStorage.setItem('history', JSON.stringify(history));
    resetForm();
    showHistory();
}

// Hàm hiển thị lịch sử
function showHistory() {
    var historyContainer = document.getElementById('historyList');
    historyContainer.innerHTML = ''; // Xóa nội dung cũ của historyContainer trước khi cập nhật lịch sử mới

    var history = JSON.parse(localStorage.getItem('history')) || [];

    // Lặp qua mỗi mục trong lịch sử và tạo một div riêng cho nó
    history.forEach(function (entry, index) {
        var historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        // Tạo nội dung cho mỗi mục trong lịch sử
        var ratingStars = '';
        for (var i = 0; i < entry.rating; i++) {
            ratingStars += '<i class="fa-solid fa-star"></i>';
        }
        var content = `
        <!-- Thêm nút Xóa vào mỗi mục trong lịch sử -->
        <button class="delete-btn" onclick="deleteHistoryItem(${index})"><i class="fa-solid fa-trash-can"></i></button>
        <h3>${entry.placeName}</h3>
        <p><strong>Địa chỉ:</strong> <a href="${entry.address}" target="_blank"><i class="fa-brands fa-google"></i>Maps</a></p>
        <p><strong>Số người:</strong> ${entry.numberOfPeople}</p>
        <p><strong>Đánh giá:</strong> ${ratingStars}</p>
        <p><strong>Thời gian:</strong> ${entry.time} ${entry.date}</p>
        <p><strong>Ghi chú:</strong> ${entry.note}</p>
        <p><strong>Tổng:</strong> ${entry.price}đ</p>
        <p><strong>Mỗi người:</strong> ${formatWithDots(entry.paymentPerPerson)}đ</p>
      `;
        historyItem.innerHTML = content;
        historyContainer.appendChild(historyItem);
    });
}

// Hàm xóa một mục lịch sử
function deleteHistoryItem(index) {
    Swal.fire({
        title: 'Xác nhận xoá ?',
        text: 'Nếu xác nhận mục này sẽ được xoá.',
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
                'Mục này đã bị xoá.',
                'success',
            ).then(() => {
                const history = JSON.parse(localStorage.getItem('history')) || [];
                history.splice(index, 1); // Xoá mục tại vị trí index
                localStorage.setItem('history', JSON.stringify(history));
                showHistory(); // Cập nhật hiển thị lịch sử sau khi xoá
            });
        }
    })
}

// Hàm xóa toàn bộ lịch sử
function deleteHistoryAllItem() {
    Swal.fire({
        title: 'Xác nhận xoá tất cả ?',
        text: 'Nếu xác nhận toàn bộ mục này sẽ được xoá.',
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
                localStorage.removeItem('history');
                showHistory();
            });
        }
    })
}

// Hàm reset form
function resetForm() {
    document.getElementById('placeName').value = '';
    document.getElementById('address').value = '';
    document.getElementById('numberOfPeople').value = '';
    document.getElementById('price').value = '';
    document.getElementById('time').value = '';
    document.getElementById('date').value = '';
    document.getElementById('note').value = '';
    document.querySelectorAll('.ratings .star').forEach(star => {
        star.classList.remove('selected');
    });
}


function adjustNumberOfPeople(operation) {
    var input = document.getElementById('numberOfPeople');
    var currentValue = parseInt(input.value) || 0;

    if (operation === 'minus') {
        currentValue = currentValue > 0 ? currentValue - 1 : 0; // Ensure value does not go below 0
    } else if (operation === 'plus') {
        currentValue += 1;
    } else {
        currentValue += 6;
    }

    input.value = currentValue;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('minusButton').addEventListener('click', function () {
        adjustNumberOfPeople('minus');
    });

    document.getElementById('plusButton').addEventListener('click', function () {
        adjustNumberOfPeople('plus');
    });

    document.getElementById('6People').addEventListener('click', function () {
        adjustNumberOfPeople('6People');
    });

});

const inputElements = document.querySelectorAll('.inputFM');
inputElements.forEach((input) => {
    input.addEventListener('input', formatNumber);
});

function formatNumber(event) {
    let input = event.target;
    let rawValue = input.value.replace(/\./g, ''); // Lưu trữ giá trị gốc (loại bỏ dấu chấm)
    let formattedValue = formatWithDots(rawValue);
    input.value = formattedValue;
    input.dataset.rawValue = rawValue; // Lưu trữ giá trị gốc trong thuộc tính 'data-raw-value'
}

function formatWithDots(value) {
    if (isNaN(value)) {
        return ''; // Nếu không phải là số thì trả về chuỗi rỗng
    }

    // Chuyển đổi giá trị thành số nguyên từ chuỗi đã loại bỏ dấu chấm
    let intValue = parseInt(value, 10);

    let parts = intValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
}

function setDefaultDateTime() {
    var currentDate = new Date();
    var currentDateISO = currentDate.toISOString().slice(0, 10); // Lấy định dạng yyyy-mm-dd của ngày hiện tại
    var currentTime = currentDate.toTimeString().slice(0, 5); // Lấy giờ và phút của giờ hiện tại

    var dateInput = document.getElementById('date');
    var timeInput = document.getElementById('time');

    // Kiểm tra xem trường date có giá trị không
    if (!dateInput.value) {
        dateInput.value = currentDateISO; // Thiết lập ngày mặc định là ngày hiện tại nếu không có dữ liệu
    }

    // Kiểm tra xem trường time có giá trị không
    if (!timeInput.value) {
        timeInput.value = currentTime; // Thiết lập giờ mặc định là giờ hiện tại nếu không có dữ liệu
    }
}
// Gọi hàm setDefaultDateTime() khi trang được tải
setDefaultDateTime();

function deleteHistoryItem(index) {
    Swal.fire({
        title: 'Xác nhận xoá ?',
        text: 'Nếu xác nhận mục này sẽ được xoá.',
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
                'Mục này đã bị xoá.',
                'success',
            ).then(() => {
                const history = JSON.parse(localStorage.getItem('history'));
                history.splice(index, 1); // Xoá mục tại vị trí index
                localStorage.setItem('history', JSON.stringify(history));
                showHistory(); // Cập nhật hiển thị lịch sử sau khi xoá
            });
        }
    })
}

function exportToExcel() {
    var history = JSON.parse(localStorage.getItem('history'));

    if (!history || history.length === 0) {
        alert("Không có dữ liệu để xuất ra file Excel.");
        return;
    }

    // Đổi tên thuộc tính từ placeName sang Tên địa điểm và loại bỏ dấu chấm trong giá
    history = history.map(function (entry) {
        var price = String(entry.price).replace(/\./g, ''); // Loại bỏ dấu chấm và chuyển thành chuỗi
        var paymentPerPerson = String(entry.paymentPerPerson).replace(/\./g, ''); // Loại bỏ dấu chấm và chuyển thành chuỗi

        return {
            "Tên địa điểm": entry.placeName,
            "Địa chỉ": entry.address,
            "Số người": entry.numberOfPeople,
            "Đánh giá": entry.rating,
            "Thời gian": entry.time,
            "Ngày": entry.date,
            "Ghi chú": entry.note,
            "Giá": price,
            "Mỗi người": paymentPerPerson,
        };
    });

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(history);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'History');

    var workbookURL = URL.createObjectURL(new Blob([s2ab(XLSX.write(workbook, { type: 'binary' }))], { type: 'application/octet-stream' }));
    var link = document.createElement('a');
    link.href = workbookURL;
    link.download = 'history.xlsx';
    link.click();
}

function exportToTxt() {
    var history = JSON.parse(localStorage.getItem('history'));

    if (!history || history.length === 0) {
        alert("Không có dữ liệu để xuất ra file Txt.");
        return;
    }

    // Đổi tên thuộc tính từ placeName sang Tên địa điểm và loại bỏ dấu chấm trong giá
    history = history.map(function (entry) {
        var price = String(entry.price).replace(/\./g, ''); // Loại bỏ dấu chấm và chuyển thành chuỗi
        var paymentPerPerson = String(entry.paymentPerPerson).replace(/\./g, ''); // Loại bỏ dấu chấm và chuyển thành chuỗi

        return {
            "Tên địa điểm": entry.placeName,
            "Địa chỉ": entry.address,
            "Số người": entry.numberOfPeople,
            "Đánh giá": entry.rating,
            "Thời gian": entry.time,
            "Ngày": entry.date,
            "Ghi chú": entry.note,
            "Giá": price,
            "Mỗi người": paymentPerPerson,
        };
    });

    var txtContent = JSON.stringify(history, null, 2);
    var blob = new Blob([txtContent], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'history.txt';
    link.click();
}

// Chuyển đổi từ chuỗi sang mảng byte
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
