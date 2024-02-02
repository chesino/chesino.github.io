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
    Fail('Vị trí không xác định.','Vui lòng bấm vào định vị để lấy vị trí.');
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

$(function (){
  var star = '.star',
      selected = '.selected';
  
  $(star).on('click', function(){
    $(selected).each(function(){
      $(this).removeClass('selected');
    });
    $(this).addClass('selected');
  });
 
});