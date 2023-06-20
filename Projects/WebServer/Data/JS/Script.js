var screenH = screen.height;
var screenW = screen.width;
document.getElementById("KichThuocManHinh").innerHTML = screenW + 'x' + screenH;

function openMode(evt, TabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }



    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
}

var vDarkMode = 0;

  
function DarkMode() {
    var body = document.querySelector('body');
    vDarkMode++;
    if (vDarkMode === 1) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        vDarkMode = 0;
    }
}