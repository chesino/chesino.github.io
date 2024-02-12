var vDynamic = 0;

function Dynamic() {
  var dAudio = document.getElementById("myAudio");
  var dRingtone = document.getElementById("myAudio2");
  var dAction = document.getElementById('dAction');
  var dOne = document.getElementById('dOne');
  var dTwo = document.getElementById('dTwo');

  vDynamic++;
  if (vDynamic == 1) {
    dAction.style.width = '180px';
    dAction.style.height = '36px';
    dTwo.style.display = 'none';
    dOne.style.display = 'flex';
    dAudio.currentTime = 0
    dAudio.play();
  }
  if (vDynamic == 2) {
    dAction.style.width = '100%';
    dAction.style.height = '76px';
    dOne.style.display = 'none';
    setTimeout(() => {
      dTwo.style.display = 'flex';
    }, 200);
    dAudio.pause();
    dRingtone.currentTime = 0
    dRingtone.play();
  }
  if (vDynamic == 3) {
    vDynamic = 0;
    dAction.style.width = '120px';
    dAction.style.height = '36px';
    dOne.style.display = 'none';
    dTwo.style.display = 'none';
    dAudio.pause();
    dRingtone.pause();
  }
}

var vON = 0;
function offDynamic() {
  var dynamic = document.getElementById('dynamic');
  var voffDynamic = document.getElementById('offDynamic');

  vON++
  if (vON == 1) {
    dynamic.style.display = 'flex';
    voffDynamic.classList.add('Active')
  } else {
    vON = 0;
    dynamic.style.display = 'none';
    voffDynamic.classList.remove('Active')
  }
}

function UNO() {
  Swal.fire({
    title: 'Xác nhận mở UNO',
    text: 'Nếu xác nhận bạn sẽ được chuyển sang UNO.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Thành công',
        'Đã mở UNO.',
        'success',
        window.open('/Apps/UNO', '_blank')
      )
    }
  })
}


function AEUpload() {
  Swal.fire({
    title: 'Xác nhận mở AE Upload',
    text: 'Nếu xác nhận bạn sẽ được chuyển sang AE Upload.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Thành công',
        'Đã mở AE Upload.',
        'success',
        window.open('/HunqD/AETH-Upload', '_blank')
      )
    }
  })
}

function AECloud() {
  Swal.fire({
    title: 'Xác nhận mở AE Cloud',
    text: 'Nếu xác nhận bạn sẽ được chuyển sang AE Cloud.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Thành công',
        'Đã mở AE Cloud.',
        'success',
        window.open('https://drive.google.com/drive/folders/14yrdFluR8wuzHqUVUThQgCLttLFQmFDe?usp=drive_link', '_blank')
      )
    }
  })
}

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


$("#btnAECloud").click(function () {
  $("#AECloud").css("display", "block");

  $([document.documentElement, document.body]).animate({
    scrollTop: $("#AECloud").offset().top
  }, 2000);
  setTimeout(function () {
    $("#Home").css("display", "flex");
  }, 2000);
});


$("#Home").click(function () {
  $("#AETH").css("display", "block");
  $([document.documentElement, document.body]).animate({
    scrollTop: $("#AETH").offset().top
  }, 2000);
  setTimeout(function () {
    $("#AECloud").css("display", "none");
    $("#Home").css("display", "none");
    $("#ShareGo").css("display", "none");
  }, 2000);
});

$("#btnShareGo").click(function () {
  $("#ShareGo").css("display", "block");
  $([document.documentElement, document.body]).animate({
    scrollTop: $("#ShareGo").offset().top
  }, 2000);
  setTimeout(function () {
    $("#Home").css("display", "flex");
  }, 2000);
});




// mapboxgl.accessToken = 'pk.eyJ1IjoiZGVudHVyZTA4IiwiYSI6ImNsczRhaGY3bTExdHIybHF4eHRycHhhdzYifQ.5tZl5IYrRubtihFlnmK4mg';
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVudHVyZTA4IiwiYSI6ImNsczQ5cjhyNTEzbWUybW5xOTdtaDZ6enYifQ.0rvi1bjq-EeSFaCkNRiJhQ';


const mapboxMap = new mapboxgl.Map({
  container: 'mapboxMap',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [106.722, 10.795], // Tọa độ mặc định
  zoom: 10
});

let currentMarker = null; // Biến để lưu trữ tham chiếu đến đánh dấu hiện tại

function searchAddress() {
  const address = document.getElementById('address').value;

  if (address) {
    // Sử dụng Mapbox Geocoding API để tìm kiếm địa chỉ
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].center;

          // Xoá đánh dấu cũ nếu tồn tại
          if (currentMarker) {
            currentMarker.remove();
          }

          // Thêm đánh dấu mới và hiển thị popup
          currentMarker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(mapboxMap)
            .setPopup(new mapboxgl.Popup().setHTML('Vị trí của bạn'))
            .togglePopup();

          mapboxMap.flyTo({ center: coordinates, zoom: 15 });
        } else {
          alert('Không tìm thấy địa chỉ.');
        }
      })
      .catch(error => {
        console.error('Lỗi khi tìm kiếm địa chỉ:', error);
      });
  }
}

function changeMapType() {
  const mapType = document.getElementById('mapType').value;
  mapboxMap.setStyle(`mapbox://styles/mapbox/${mapType}`);
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Sử dụng Mapbox Geocoding API để lấy địa chỉ từ tọa độ
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)

        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const address = data.features[2].place_name;

            // Gán địa chỉ vào ô input có id là 'address'
            document.getElementById('address').value = address;

            // Xoá đánh dấu cũ nếu tồn tại
            if (currentMarker) {
              currentMarker.remove();
            }

            // Thêm đánh dấu mới và hiển thị popup
            currentMarker = new mapboxgl.Marker()
              .setLngLat([lng, lat])
              .addTo(mapboxMap)
              .setPopup(new mapboxgl.Popup().setHTML('Vị trí của bạn'))
              .togglePopup();

            mapboxMap.flyTo({ center: [lng, lat], zoom: 15 });
          } else {
            alert('Không thể lấy địa chỉ từ tọa độ.');
          }
        })
        .catch(error => {
          console.error('Lỗi khi lấy địa chỉ từ tọa độ:', error);
          alert('Không thể lấy địa chỉ từ tọa độ.');
        });
    }, error => {
      console.error('Lỗi khi lấy vị trí:', error);
      alert('Không thể lấy vị trí hiện tại.');
    });
  } else {
    alert("Trình duyệt không hỗ trợ định vị.");
  }
}

function Google() {
  if (currentMarker) {
    const latLng = currentMarker.getLngLat();
    const lat = latLng.lat;
    const lng = latLng.lng;

    // Tạo liên kết Google Maps và mở trong một cửa sổ mới
    const googleMapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(googleMapsLink, '_blank');
  } else {
    Fail('Vị trí không xác định.', 'Vui lòng bấm vào định vị để lấy vị trí.');
  }
}


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

document.addEventListener("DOMContentLoaded", function () {
  showHistory();
});

function showHistory() {
  var historyContainer = document.getElementById('historyList');
  historyContainer.innerHTML = ''; // Xóa nội dung cũ của historyContainer trước khi cập nhật lịch sử mới

  var history = JSON.parse(localStorage.getItem('history'));

  // Lặp qua mỗi mục trong lịch sử và tạo một div riêng cho nó
  history.forEach(function (entry, index) {
    var historyItem = document.createElement('div');
    historyItem.classList.add('history-item');

    // Tạo nội dung cho mỗi mục trong lịch sử
    var content = `
  <!-- Thêm nút Xóa vào mỗi mục trong lịch sử -->
  <button class="delete-btn" onclick="deleteHistoryItem(${index})"><i class="fa-solid fa-trash-can"></i></button>
  <h3>${entry.placeName}</h3>
  <p><strong>Địa chỉ:</strong> <a href="${entry.address}." target="_blank"><i class="fa-brands fa-google"></i>Maps</a></p>
  <p><strong>Số người:</strong> ${entry.numberOfPeople}.</p>
  <p><strong>Đánh giá:</strong> ${entry.rating}<i class="fa-solid fa-star"></i>.</p>
  <p><strong>Thời gian:</strong> ${entry.time} ${entry.date}.</p>
  <p><strong>Ghi chú:</strong> ${entry.note}.</p>
  <p><strong>Tổng:</strong> ${entry.price}đ.</p>
  <p><strong>Mỗi người:</strong> ${entry.paymentPerPerson}đ.</p>
`;


    historyItem.innerHTML = content;
    historyContainer.appendChild(historyItem);
  });
}

function saveToLocalStorage() {
  var placeName = document.getElementById('placeName').value;
  var numberOfPeople = parseInt(document.getElementById('numberOfPeople').value);
  var price = parseInt(document.getElementById('price').dataset.rawValue);
  var note = document.getElementById('note').value;
  var time = document.getElementById('time').value;
  var date = document.getElementById('date').value;
  if (!placeName || !numberOfPeople || !price || !date) {
    Fail('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin.');
    return; // Dừng hàm nếu có bất kỳ biến nào là null
  }
  // Lấy giá trị đánh giá đã chọn
  var ratingElement = document.querySelector('.ratings .star.selected');
  var rating = null;
  if (ratingElement) {
    rating = ratingElement.getAttribute('data-rating');
  } else {
    // Thông báo nếu phần tử không tồn tại
    rating = 0;  
  }
  // Tính toán giá trị thanh toán mỗi người
  var paymentPerPerson = price / numberOfPeople;

  if (currentMarker) {
    const latLng = currentMarker.getLngLat();
    const lat = latLng.lat;
    const lng = latLng.lng;

    // Tạo liên kết Google Maps và mở trong một cửa sổ mới
    const googleMapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    var address = googleMapsLink;
  } else {
    Fail('Vị trí không xác định.', 'Vui lòng bấm vào định vị để lấy vị trí.');
  }

  // Lưu thông tin vào local storage
  var historyEntry = {
    placeName: placeName,
    address: address,
    rating: rating, // Lưu giá trị đánh giá
    note: note,
    paymentPerPerson: formatWithDots(paymentPerPerson),
    time: time,
    date: date,
    numberOfPeople: numberOfPeople,
    price: formatWithDots(price),
  };

  // Kiểm tra xem local storage có sẵn không
  if (localStorage.getItem('history') === null) {
    // Nếu không có, tạo một mảng mới và thêm vào
    var history = [];
    history.push(historyEntry);
    localStorage.setItem('history', JSON.stringify(history));
  } else {
    // Nếu có, lấy mảng từ local storage, thêm mới và lưu lại
    var history = JSON.parse(localStorage.getItem('history'));
    history.push(historyEntry);
    localStorage.setItem('history', JSON.stringify(history));
  }
  showHistory();
  // In thông báo hoặc thực hiện hành động khác (nếu cần)
  Done('Thành công', 'Thông tin đã được lưu vào lịch sử.');
}


// Hàm chuyển đổi định dạng ngày tháng
function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
  var year = date.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm

  // Đảm bảo rằng ngày và tháng luôn có 2 chữ số bằng cách thêm số 0 ở trước nếu cần
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return day + '/' + month + '/' + year;
}

// Kiểm tra và thiết lập giá trị mặc định cho các trường input date và time
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
window.onload = function () {
  setDefaultDateTime();
};

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

  // Đổi tên thuộc tính từ placeName sang Tên địa điểm và loại bỏ dấu chấm trong giá
  history = history.map(function (entry) {
    var price = entry.price.replace(/\./g, ''); // Loại bỏ dấu chấm
    var paymentPerPerson = entry.paymentPerPerson.replace(/\./g, ''); // Loại bỏ dấu chấm

    return {
      "Tên địa điểm": entry.placeName,
      "Địa chỉ": entry.address,
      "Số người": entry.numberOfPeople,
      "Đánh giá": entry.rating,
      "Thời gian": entry.time,
      "Ngày": entry.date,
      "Ghi chú": entry.note,
      "Giá": entry.price,
      "Mỗi người": entry.paymentPerPerson,
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


// Chuyển đổi từ chuỗi sang mảng byte
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}


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
        history.splice(index); // Xoá mục tại vị trí index
        localStorage.setItem('history', JSON.stringify(history));
        showHistory(); // Cập nhật hiển thị lịch sử sau khi xoá
      });
    }
  })

}