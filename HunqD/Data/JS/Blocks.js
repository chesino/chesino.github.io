// kiểm tra xem thiết bị có phải là điện thoại di động hay không
function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if (isMobileDevice()) {
  console.log('Đây là thiết bị di động');
  document.body.style.margin = '0';
} else {
  console.log('Đây là máy tính');
  document.body.style.margin = '0 100px';
  alert('Bạn đang sử dụng trình duyệt máy tính nên giao diện có thể bị lỗi.')
}
