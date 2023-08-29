window.onscroll = function() {
  scrollFunction();
};

// Dark Mode 
// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#iDarkMode');

const enableDarkMode = () => {
    // 1. Add the class to the body
    document.body.classList.add('darkmode');
    // 2. Update darkMode in localStorage
    localStorage.setItem('darkMode', 'enabled');
    document.getElementById("dark-mode-toggle").className = "fa-solid fa-moon";
    document.getElementById("imgLogo").style.backgroundImage = "url(/DataWeb/img/LogoBanner.png)";
    
}

const disableDarkMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove('darkmode');
    // 2. Update darkMode in localStorage 
    localStorage.setItem('darkMode', null);
    document.getElementById("dark-mode-toggle").className = "fa-solid fa-sun";
    document.getElementById("imgLogo").style.backgroundImage = "url(/DataWeb/img/LogoBanner2.png)";
}

// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
    enableDarkMode();
}

// When someone clicks the button
darkModeToggle.addEventListener('click', () => {
    // get their darkMode setting
    darkMode = localStorage.getItem('darkMode');

    // if it not current enabled, enable it
    if (darkMode !== 'enabled') {
        enableDarkMode();
        // if it has been enabled, turn it off  
    } else {
        disableDarkMode();
    }
});

var MenuRule = 100;
var MainRule = 0; 
var MenuBorder = 0;
function ifMenu(mediarule) {
  if (mediarule.matches) { // If media query matches
    setInterval(MenuRule = 100);
    setInterval(MainRule = 0) ;
    setInterval(MenuBorder = 0)
  } else {
    setInterval(MenuRule = 25);
    setInterval(MainRule = 25);
    setInterval(MenuBorder = 3)
  }
}

var mediarule = window.matchMedia("(max-width: 800px)")
ifMenu(mediarule) // Call listener function at run time
mediarule.addListener(ifMenu) // Attach listener function on state changes


function openNav() {
    document.getElementById("mySidenav").style.width = MenuRule + '%';  
    document.getElementById("main").style.marginLeft =  MainRule + '%'; 
    document.getElementById("mySidenav").style.borderRight = MenuBorder + 'px solid var(--color)';  
  }
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = '0';  
    document.getElementById("mySidenav").style.borderRight = 'none';  
  }

  function Language() {
    var x = document.getElementById("Language");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}


  function LangSelectPopUp() {
    alert('Có thể sẽ phát sinh lỗi, Nhấn tải lại ở kế bên.');
    LangSelect();
  }
  function LangSelect() {
    var x = document.getElementById("idLangSelect");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    var a = document.getElementById("idGoogle");
    if (a.style.display === "block") {
      a.style.display = "none";
    } else {
      a.style.display = "block";
    }
  }

function ShowForm() {
  document.getElementById('ShowForm').textContent = "Thư đã được gửi đi.";
  document.getElementById('Form').style.display = "none";
  document.getElementById('idBtn').className = "fa-solid fa-circle-check";
  
}




var mybutton = document.getElementById("myBtn");

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}