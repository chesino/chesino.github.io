let darkMode = localStorage.getItem('darkMode');
var iconDarkMode = document.getElementById("iDarkMode");

const darkModeToggle = document.querySelector('#fDarkMode');

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'enabled');
    document.getElementById("fDarkMode").checked = true;
    iconDarkMode.className = "fa-solid fa-moon";
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', null);
	document.getElementById("fDarkMode").checked = false;
	iconDarkMode.className = "fa-solid fa-sun";
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

var iMusic = document.getElementById("iMusic");
var x = document.getElementById("myAudio");

function PlayMusic() {
	if (iMusic.className == 'fa-solid fa-circle-play') {
		x.play();
		iMusic.className = 'fa-solid fa-circle-pause'
		} else {
			iMusic.className = 'fa-solid fa-circle-play'
			x.pause();
		}
}


var iLyrics = document.getElementById("iLyrics");
var Midle = document.getElementById("Midle");
function Lyrics() {
	if (iLyrics.className == 'fa-solid fa-quote-left') {
		iLyrics.className = 'fa-solid fa-caret-up'
        Midle.style.display = 'block';
		} else {
			iLyrics.className = 'fa-solid fa-quote-left'
			Midle.style.display = 'none';
		}
}


window.document.onkeydown = function(e) {
    if (!e) {
      e = event;
    }
    if (e.keyCode == 27) {
      lightbox_close();
    }
  }
  
  function lightbox_open() {
    var lightBoxVideo = document.getElementById("VisaChipCardVideo");
    window.scrollTo(0, 0);
    document.getElementById('light').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
    lightBoxVideo.play();
  }
  
  function lightbox_close() {
    var lightBoxVideo = document.getElementById("VisaChipCardVideo");
    document.getElementById('light').style.display = 'none';
    document.getElementById('fade').style.display = 'none';
    lightBoxVideo.pause();
  }