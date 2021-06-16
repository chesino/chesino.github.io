
function darkmode() {
    var element = document.body;
    element.classList.toggle("darkmode");
 }

function openMenu() {
    document.getElementById("mySidebar").style.width = "50%";
    document.getElementById("menu").style.marginLeft = "50%";
    
  }
  
function closeMenu() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("menu").style.marginLeft= "0";;
  }

window.onscroll = function() {BarScroll()};

function BarScroll() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
  }

