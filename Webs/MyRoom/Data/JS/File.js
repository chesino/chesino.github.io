var vDarkMode = 0;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  vDarkMode = 1;
  DarkMode();
}
function DarkModeOff() {
  if (vDarkMode == 2) {
    vDarkMode--;
  }else {
    vDarkMode++;
  }
  DarkMode();
}

function DarkMode() {
  if (vDarkMode == 1) {
    document.body.classList.add('DarkMode') ;
  } else {
    document.body.classList.remove('DarkMode') ;
  }
}

  


function openTAB(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}




var vQRCODE = 0 ;

function ShareWiFi(){
  vQRCODE++;
  if (vQRCODE == 1) {
    var qrcode = new QRCode("id_qrcode", {
      text:"WIFI:T:WPA;S:HunqD;P:12345679$;H:;;",
      width:150,
      height:150,
      colorDark:"#000000",
      colorLight:"#ffffff",
      correctLevel:QRCode.CorrectLevel.H
    });
    document.getElementById('QRCode').innerText = 'Đã tạo QR thành công !'
  } else {
    document.getElementById('QRCode').innerText = 'Không thể tạo thêm !'
  }
    
}

function ClickPC() {
  document.getElementById('ClickPC').click();
}