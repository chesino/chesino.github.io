// Kiểm tra xem trình duyệt có phải là trình duyệt trên điện thoại không
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  console.log("Đây là trình duyệt trên điện thoại");
} else {
  console.log("Đây là trình duyệt trên máy tính");
}


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
      button.innerHTML = '<i class="fa-regular fa-sun"></i>';
      button.style.backgroundColor = '#40c3da';
      button.style.color = '#000';
      // Chạy hàm cho chế độ 1
      mode1();
      break;
    case 2:
      button.innerHTML = '<i class="fa-regular fa-moon"></i>';
      button.style.backgroundColor = '#211e2c';
      button.style.color = '#eee';

      // Chạy hàm cho chế độ 2
      mode2();
      break;
    case 3:

      button.style.backgroundColor = '#f5c85d';
      button.style.color = '#000';

      if (isMobile) {
        button.innerHTML = '<i class="fa-solid fa-mobile-screen-button"></i>';
      } else {
        button.innerHTML = '<i class="fa-solid fa-desktop"></i>';
      }


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





// Menu 
function openTab(evt, tabName) {
  var i, page, Function;
  page = document.getElementsByClassName("Page");


  Function = document.getElementsByClassName("Function");
  for (i = 0; i < Function.length; i++) {
    Function[i].className = Function[i].className.replace(" Active", "");
  }

  const targetSection = document.getElementById(tabName);
  const targetOffsetTop = targetSection.offsetTop;
  window.scrollTo({
    top: targetOffsetTop,
    behavior: "smooth"
  });

  evt.currentTarget.className += " Active";
}


// Viết chữ 
var i = 0;
const text = "Chào mừng bạn đến với trang web cá nhân của tôi!\n \n Tôi là Hùng hay username là HunqD.\n \n Hiện tại, tôi đang là sinh viên chuyên ngành cơ điện tử tiêu chuẩn Đức.\n \n Trang web cá nhân của tôi được thiết kế để chia sẻ về những kiến thức và kinh nghiệm của tôi, cũng như một nơi để ghi chép lại những thành tựu và học hỏi của mình trong hành trình của tôi.\n \n Cảm ơn bạn đã ghé thăm trang web của tôi và mong được sự ủng hộ của bạn trong tương lai!";
let index = 0;

function type() {
  document.getElementById("text").textContent += text.charAt(index);
  index++;
  if (index < text.length) {
    setTimeout(type, 20);
  }
}
type();

// Chụp màn hình
var screenshot;
var funcCap = 0; 
var iCapture = document.getElementById('Capture');
var element = document.getElementById("Info");

function capture() {
  funcCap++;
  if (funcCap == 1) {
    
    iCapture.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
   
    html2canvas(element).then(function (canvas) {
      screenshot = canvas.toDataURL();
    });
  }
  if (funcCap == 2) {
    save();
    funcCap = 0; 
    iCapture.innerHTML = '<i class="fa-solid fa-camera"></i>';
  }
}

function save() {
  
  if (!screenshot) {
    alert("Please take a screenshot first.");
    return;
  }

  var blob = dataURItoBlob(screenshot);
  saveAs(blob, 'HunqD.png');
  
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}

function shareFacebook() {
  window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href), "facebook-share-dialog", "width=626,height=436");
}