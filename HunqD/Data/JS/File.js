window.onload = function()
{
  typeWriter();
  isMobileDevice();
};

var Welcome = document.getElementById('Welcome');
function Two() {
  setTimeout(() => {
    Welcome.style.display='none'
  }, 2000);
  ;
}

var imgBanner = document.getElementById('Banner');

var BannerX = 0
function Banner() {
  if (BannerX < 3) {
    BannerX++;
    imgBanner.src = './Data/IMG/Banner/'+ BannerX +'.png'
  } else {
    BannerX = 0;
    imgBanner.src = './Data/IMG/Banner/'+ BannerX +'.png'
  }
  
}




let darkMode = localStorage.getItem('darkMode');
var iconDarkMode = document.getElementById("iDarkMode");
const darkModeToggle = document.querySelector('#fDarkMode');
const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'enabled');
    document.getElementById("fDarkMode").checked = true;
    iconDarkMode.src = './Data/IMG/Func/moon.png';
}
const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', null);
	document.getElementById("fDarkMode").checked = false;

  iconDarkMode.src = './Data/IMG/Func/eye-glasses.png';
}
if (darkMode === 'enabled') {
    enableDarkMode();
}
darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');
    if (darkMode !== 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

$(document).ready(function() {
  $("a[href*='#']:not([href='#])").click(function() {
    let target = $(this).attr("href");
    $('html,body').stop().animate({
      scrollTop: $(target).offset().top
    }, 1000);
    event.preventDefault();
  });
});

var i = 0;
var txt = "Chào mừng bạn ghé thăm trang quản lý của Hùng, tại đây Hùng chia sẻ bảng xếp hạng tương tác, xác nhận kết bạn, danh sách bị hạn chế,... ";
var speed = 20;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("typing1").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
};

function openTab(evt, tabName) {
  var i, tabcontent, Function;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  Function = document.getElementsByClassName("Function");
  for (i = 0; i < Function.length; i++) {
    Function[i].className = Function[i].className.replace(" Active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " Active";
}