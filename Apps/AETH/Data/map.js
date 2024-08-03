// Tạo bản đồ và các lớp bản đồ
var map = L.map('mapboxMap').setView([21.02745, 105.85485], 15); // Đặt mức zoom mặc định là 18

var dark = L.tileLayer('https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=bJnZQVl8zwoZ2OblPXlr', {
    attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
    maxZoom: 22 // Đặt maxZoom 
});

var light = L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=bJnZQVl8zwoZ2OblPXlr', {
    attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
    maxZoom: 22 // Đặt maxZoom 
});

var satellite = L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bJnZQVl8zwoZ2OblPXlr', {
    attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
    maxZoom: 22 // Đặt maxZoom 
});

// Mặc định sử dụng lớp bản đồ Streets v2 Dark
dark.addTo(map);

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
}

// Biến để lưu trữ đánh dấu hiện tại
let currentMarker = null;

// Hàm tìm kiếm địa chỉ và thêm đánh dấu
// Hàm tìm kiếm địa chỉ và thêm đánh dấu
function searchAddress() {
    const address = document.getElementById('address').value;

    if (address) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const coordinates = [data[0].lat, data[0].lon];

                    if (currentMarker) {
                        currentMarker.remove();
                    }

                    currentMarker = L.marker(coordinates).addTo(map)
                        .bindPopup('Vị trí của bạn')
                        .openPopup();

                    map.setView(coordinates, 18); // Đặt mức zoom là 18
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

                        currentMarker = L.marker([lat, lng]).addTo(map)
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

document.addEventListener('DOMContentLoaded', function () {
    showHistory();
});
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

document.addEventListener('DOMContentLoaded', function () {
    showHistory();

    document.querySelectorAll('.ratings .star').forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            document.querySelectorAll('.ratings .star').forEach(star => {
                star.classList.remove('selected');
            });
            for (let i = 0; i < rating; i++) {
                document.querySelectorAll('.ratings .star')[i].classList.add('selected');
            }
        });
    });
});


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
