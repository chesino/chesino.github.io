
var vAlert = document.getElementById('Alert');
var iNotifi = document.getElementById('iNotifi');
var pNotifi = document.getElementById('pNotifi');
var linkNotifi = document.getElementById('pNotifi');


function TimeLeft(x) {
    var timeleft = x;
    setInterval(function(){
        if(timeleft <= 0){
          clearInterval();
        } else {
          document.getElementById("TimeLeft").innerHTML = timeleft + " giây";
        }
        timeleft -= 1;
      }, 1000);
}

function Alert() {
    vAlert.style.display = 'block'
}
function AlertOFF() {
    vAlert.style.display = 'none'
}

function Messenger() {
    Alert();
    var tMess = 5;
    iNotifi.className = 'fa-brands fa-facebook-messenger';
    pNotifi.innerHTML = 'Đang kiểm tra ChatBot <b id="TimeLeft" ></b>'
    TimeLeft(tMess);
    setTimeout(() => {
      linkNotifi.href = 'https://m.me/DMHunq';
      linkNotifi.innerText = 'Nhắn tin ngay';
      
        setTimeout(() => {
          linkNotifi.click();
        }, 1000);
        
    }, tMess*1000);
    
}
// https://m.me/DMHunq