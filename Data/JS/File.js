
// Dark Mode 
// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');
var iconDarkMode = document.getElementById("iDarkMode");

const darkModeToggle = document.querySelector('#fDarkMode');

const enableDarkMode = () => {
    // 1. Add the class to the body
    document.body.classList.add('darkmode');
    // 2. Update darkMode in localStorage
    localStorage.setItem('darkMode', 'enabled');
    document.getElementById("fDarkMode").checked = true;
    iconDarkMode.className = "fa-solid fa-moon";
}

const disableDarkMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove('darkmode');
    // 2. Update darkMode in localStorage 
    localStorage.setItem('darkMode', null);
	document.getElementById("fDarkMode").checked = false;
	iconDarkMode.className = "fa-solid fa-sun";
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


function Menu() {
	var iconMenu = document.getElementById("iconMenu");
	var NavMenu = document.getElementById("NavMenu");
	
	if (iconMenu.style.rotate == '45deg') {
		iconMenu.style.rotate = '0deg';
		iconMenu.className = 'fa-solid fa-arrows-up-down-left-right';
		NavMenu.style.display = 'none';	
		
	} else {
		iconMenu.style.rotate = '45deg';
		iconMenu.className = 'fa-solid fa-arrows-to-dot';


		setTimeout(() => {
			NavMenu.style.display = 'block';
		}, 150);
	}

  }


  
  
