// kiểm tra xem thiết bị có phải là điện thoại di động hay không
// function isMobileDevice() {
//   return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
// };

// if (isMobileDevice()) {
//   console.log('Đây là thiết bị di động');
//   document.body.style.margin = '0';
// } else {
//   console.log('Đây là máy tính');
//   document.body.style.margin = '0 80px';
//   alert('Bạn đang sử dụng trình duyệt máy tính, giao diện có thể bị sai lệch và lỗi.')
// }

function checkReferral() {
  var urlParams = new URLSearchParams(window.location.search);
  var mibextid = urlParams.get('mibextid');
  var fbclid = urlParams.get('fbclid');

  if (mibextid) {
    console.log("Người dùng truy cập từ Facebook qua Mibbit");
  } else if (fbclid) {
    console.log("Người dùng truy cập từ Facebook");
  } else {
    console.log("Người dùng truy cập bằng link thường");
  }
}

checkReferral();


function openTAB(evt, TabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(TabName).style.display = "block";
  evt.currentTarget.className += " active";
}

