// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//   document.body.style.backgroundColor = '#111' ;
//   document.body.style.color = '#eee' ;
// }





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

function ShareWiFi()
  {
    var qrcode = new QRCode("id_qrcode", {
      text:"WIFI:T:WPA;S:HunqD;P:12345679$;H:;;",
      width:150,
      height:150,
      colorDark:"#000000",
      colorLight:"#ffffff",
      correctLevel:QRCode.CorrectLevel.H
    });
}