
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#iDarkMode');

const enableDarkMode = () => {
  // 1. Add the class to the body
  document.body.classList.add('darkmode');
  // 2. Update darkMode in localStorage
  localStorage.setItem('darkMode', 'enabled');
  document.getElementById("dark-mode-toggle").className = "fa-solid fa-moon";

}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove('darkmode');
  // 2. Update darkMode in localStorage 
  localStorage.setItem('darkMode', null);
  document.getElementById("dark-mode-toggle").className = "fa-solid fa-sun";
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

window.onscroll = function () { myBar() };

function myBar() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  var Head = document.getElementById("Head");
  var SpaceMenu = document.getElementById("SpaceMenu");
  var idProgress = document.getElementById("idProgress");
  
  document.getElementById("myBar").style.width = scrolled  + "%";

  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 220) {
    SpaceMenu.style.display = "block";
    idProgress.style.display = 'block';
    Head.style.position = "fixed";
    Head.style.backdropFilter = "blur(60px)";
    Head.style.backgroundColor = "var(--backgroundMenu)";
  }
  else {
    SpaceMenu.style.display = "none";
    idProgress.style.display = 'none';
    Head.style.position = "relative";
    document.getElementById("Head").style.backdropFilter = "blur(0px)";
    document.getElementById("Head").style.backgroundColor = "transparent";
    Head.style.padding = "10px 5px 15px 15px";
    
  }
}

$('#LogoHead').click(function () {
  setTimeout(function () {
    $('html,body').animate({
      scrollTop: '0'
    },
      'slow');

  }, 100);
});

function NavMenu() {
  $("body").css("overflow","hidden");
  var NavCheck = document.getElementById('NavCheck');
  if (NavCheck.className == 'fa-solid fa-bars-staggered') {
    NavCheck.className = 'fa-solid fa-x'
    openNav();
  } else {
    $("body").css("overflow","auto");
    NavCheck.className = 'fa-solid fa-bars-staggered'
    closeNav();
  }
}

function openNav() {
  document.getElementById("myNav").style.height = "100%";
  document.getElementById("Head").style.backgroundColor = "var(--backgroundBody)";
}

function closeNav() {
  document.getElementById("myNav").style.height = "0%";
  document.getElementById("Head").style.backgroundColor = "transparent";}


function openCategory(evt, Category) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(Category).style.display = "block";
  evt.currentTarget.className += " active";
}