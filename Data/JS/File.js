// Lấy nút nhấn và thêm sự kiện nhấn vào
const button = document.getElementById('toggle-button');
button.addEventListener('click', toggleMode);

// Khởi tạo chế độ mặc định và lưu vào local storage (nếu chưa có)
let mode = parseInt(localStorage.getItem('mode')) || 1;
setMode(mode);

// Hàm chuyển đổi chế độ
function toggleMode() {
  // Tăng chế độ lên 1 và quay về chế độ 1 nếu chế độ hiện tại là 3
  mode = mode < 3 ? mode + 1 : 1;
  setMode(mode);
  // Lưu chế độ vào local storage
  localStorage.setItem('mode', mode);
}

// Hàm thiết lập chế độ
function setMode(mode) {
  switch (mode) {
    case 1:
      button.style.backgroundImage = 'url(/Data/Images/DarkMode/Sun.gif)';
      // Chạy hàm cho chế độ 1
      mode1();
      break;
    case 2:
      button.style.backgroundImage = 'url(/Data/Images/DarkMode/Moon.gif)';
      // Chạy hàm cho chế độ 2
      mode2();
      break;
    case 3:
      button.style.backgroundImage = 'url(/Data/Images/DarkMode/Device.png)';
      // Chạy hàm cho chế độ 3
      mode3();
      break;
    default:
      break;
  }
}

// Hàm cho chế độ 1 chế độ sáng
function mode1() {
  console.log('Chế độ 1');

  var body = document.querySelector('body');
  body.classList.remove('dark-mode');
}

// Hàm cho chế độ 2 chế độ tối
function mode2() {
  console.log('Chế độ 2');

  var body = document.querySelector('body');
  body.classList.add('dark-mode');
}

// Hàm cho chế độ 3 chế độ sáng / tối
function mode3() {
  console.log('Chế độ 3');

  var body = document.querySelector('body');
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
  } else {
   body.classList.remove('dark-mode');
  }
}


/* JavaScript cho nút 3 gạch */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
