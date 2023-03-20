// Dữ liệu lớp
const userData = [
  { name: "Phạm Doan", id: "100080440555084" },
  { name: "Thanh Anh", id: "100012949321472" },
  { name: "Trần Ngọc Ánh", id: "100088260422422" },
  { name: "Đỗ Thành Danh", id: "100054938422199" },
  { name: "Nguyễn Quang Dưỡng", id: "100021752540372" },
  { name: "Tiến Đạt", id: "100042140778354" },
  { name: "Nguyễn Hồng Hải", id: "100012738306335" },
  { name: "Vănn Hậu", id: "100025837573553" },
  { name: "Đinh Mạnh Hùng", id: "100045640179308" },
  { name: "Quang Huy", id: "100007500015790" },
  { name: "Ngô Khanh", id: "100034337931817" },
  { name: "Khánh Trần", id: "100021976963881" },
  { name: "Nguyễn Lộc", id: "100015186009802" },
  { name: "Luân Nguyễn", id: "100033882906525" },
  { name: "Nam Phan", id: "100022402067051" },
  { name: "Trọng Nghĩa", id: "100052261622413" },
  { name: "Nâu", id: "100004709207159" },
  { name: "Lê Trọng Nhân", id: "100027334579720" },
  { name: "Vuduyquang Pham", id: "100004059293211" },
  { name: "Hoang Quan", id: "100053170133511" },
  { name: "Minh Quân", id: "100014270777334" },
  { name: "Ân Thanh Tân", id: "100010685404349" },
  { name: "Tiến Lê", id: "100014569175965" },
  { name: "Tĩnh Nguyễn", id: "100003941812198" },
  { name: "Mai Thanh Tú", id: "100008538767245" },
  { name: "Lê Đức Thảnh", id: "100029125427972" },
  { name: "Trần Hữu Thắng", id: "100008284500705" },
  { name: "Nguyen Khang Thinh", id: "100012597750961" },
  { name: "Trung Nguyễn", id: "100008045827167" }
];




// Lấy các phần tử HTML
var userImage = document.querySelector(".user-image");
var userName = document.querySelector(".user-name");
var randomButton = document.querySelector(".random-button");
var pyro = document.getElementById("pyro");

// Cài đặt thời gian mặc định là 3s
var timeSET = 3000; 
function Settime(x) {
  timeSET = x*1000
  console.log(timeSET);
  return
}

// Lưu trữ các các người đã được chọn trước đó
var usedIndexes = [];

// Nhấn để ngẫu nhiên người trực nhật
randomButton.addEventListener("click", function () {
  // Hàng chờ
  x.play();
  userImage.src = './random.gif'
  userName.textContent = 'Chờ đợi có đáng sợ ?'
  pyro.style.display = "none";
  // Chờ 5s sau đó chọn ngẫu nhiên
  setTimeout(function () {
    // Chọn một người ngẫu nhiên chưa được sử dụng trước đây
    var randomIndex = Math.floor(Math.random() * userData.length);
    while (usedIndexes.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * userData.length);
    }

    // Thêm người đã được chọn vào lưu trữ đã được chọn
    usedIndexes.push(randomIndex);

    // Cập nhật hình ảnh và tên người với dữ liệu cho người  ngẫu nhiên
    var randomUser = userData[randomIndex];
    userImage.src = 'https://graph.facebook.com/ ' + randomUser.id + '/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662';
   
    
    setTimeout(() => {
      pyro.style.display = "none";
    }, 5000);
    
    setTimeout(() => {
      pyro.style.display = "block";
      userName.textContent = randomUser.name;
    }, 400);
    // Đặt lại
    if (usedIndexes.length === userData.length) {
      alert('Đã ngẫu nhiên toàn bộ thành viên lớp')
      usedIndexes = [];
    }
    SoundMUTEef();
    
  }, timeSET); // Chờ 3s để ngẫu nhiên 
});


function SoundMUTEef() {
  setTimeout(() => {
    x.volume = 0.5;
  }, 100);
  setTimeout(() => {
    x.volume = 0.3;
  }, 200);
  setTimeout(() => {
    x.volume = 0;
  }, 500);
  setTimeout(() => {
    x.volume = 1;
    x.pause(); 
  }, 1000);
}

const themeSwitcherButton = document.querySelector('.theme-switcher-button');
const body = document.querySelector('body');

let isDarkMode = false;

// Kiểm tra xem đã lưu trữ trạng thái chế độ sáng/tối hay chưa
const storedTheme = localStorage.getItem('isDarkMode');
if (storedTheme !== null) {
  isDarkMode = JSON.parse(storedTheme);
  applyTheme();
}

function applyTheme() {
  if (isDarkMode) {
    body.classList.add('dark-mode');
    themeSwitcherButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    body.classList.remove('dark-mode');
    themeSwitcherButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('isDarkMode', isDarkMode); // Lưu trạng thái chế độ sáng/tối

  applyTheme();
}

themeSwitcherButton.addEventListener('click', toggleTheme);


function download(x) {
  alert('Hiện tại chưa có phiên bản dành cho ' + x + '\nSẽ có trong phiên bản sắp tới.' )
}

MySound

var x = document.getElementById("MySound");
var iconMUTE = document.getElementById("iconMUTE");

function SoundMUTE() {
  
  if (iconMUTE.className == "fa-solid fa-volume-high") {
    x.muted = true;
    iconMUTE.className = "fa-solid fa-volume-xmark";
  } else {
    x.muted = false;
    iconMUTE.className = "fa-solid fa-volume-high"
  }
}

function ChangeSound() {
  alert('Vui lòng chờ phiên bản mới')
}