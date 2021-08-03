
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




  moveOnMax =function (field, nextFieldID) {
    if (field.value.length == 1) {
        document.getElementById(nextFieldID).focus();
    }
}


function openPage() {
  var x = document.getElementById("search").value;

  if (x === "300801") {
      window.open("/300801.html");
  }

  if (x === "TCN") {
      window.open("/191204.html");
  }

  if (x === "HUY123") {
    window.open("/gif001.html");
}
  

}

function server2() {
  alert("Máy chủ không hoạt động");
}

function servervip() {
  if (window.confirm('Bạn không thể truy cập máy chủ này. \nĐây là máy chủ dành riêng cho thành viên trả phí \nNhấn "OK" để mua thành viên trả phí')) 
{
window.location.href='https://m.me/hunqD';
};
}



var time = 30;
var page = "https://docs.google.com/forms/d/1zhn6z1mjn3a-wl_SFSnz04u6g8Vnj6u7iBtNcuI0stI/viewform?edit_requested=true";

function countDown(){
time--;
gett("container").innerHTML = time;
if(time == 0){
window.location = page;
}
}
function gett(id){
if(document.getElementById) return document.getElementById(id);
if(document.all) return document.all.id;
if(document.layers) return document.layers.id;
if(window.opera) return window.opera.id;
}
function init(){
if(gett('container')){
setInterval(countDown, 1000);
gett("container").innerHTML = time;
}
else{
setTimeout(init, 0);
}
}
document.onload = init();