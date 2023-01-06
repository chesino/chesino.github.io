
var vAlert = document.getElementById('Alert');
var iNotifi = document.getElementById('iNotifi');
var pNotifi = document.getElementById('pNotifi');

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
    pNotifi.innerHTML = 'Mở Messenger sau <b id="TimeLeft" ></b>'
    TimeLeft(tMess);
    setTimeout(() => {
        pNotifi.innerHTML = 'Đã chuyển sang Messenger'
        window.open('https://m.me/DMHunq','_blank');
        setTimeout(AlertOFF,1000);
    }, tMess*1000);
    
}
// https://m.me/DMHunq