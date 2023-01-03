
// Dark Mode 
// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('#iDarkMode');

const enableDarkMode = () => {
    // 1. Add the class to the body
    document.body.classList.add('darkmode');
    // 2. Update darkMode in localStorage
    localStorage.setItem('darkMode', 'enabled');
    document.getElementById("iDarkMode").checked = true;
    
}

const disableDarkMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove('darkmode');
    // 2. Update darkMode in localStorage 
    localStorage.setItem('darkMode', null);
	document.getElementById("iDarkMode").checked = false;
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


(function () {
	$('.hamburger-menu').on('click', function () {
		$('.hamburger-menu').toggleClass('animate');
	})
})();

function Menu() {
	var Menu = document.getElementById("Menu");
	if (Menu.style.display === "block") {
		Menu.style.display = "none";
	} else {
		Menu.style.display = "block";
	}
}

function Setting() {
	var Setting = document.getElementById("Setting");
	if (Setting.style.display === "block") {
		Setting.style.display = "none";
	} else {
		Setting.style.display = "block";
	}
}

function LogIn() {
	var LogIn = document.getElementById("LogIn");
	if (LogIn.style.display === "block") {
		LogIn.style.display = "none";
	} else {
		LogIn.style.display = "block";
	}
}

function DieuKhoan() {
	var DieuKhoan = document.getElementById("DongYDieuKhoan");
	var FormLogin = document.getElementById("FormLogin");
	if (DieuKhoan.checked === true) {
		FormLogin.style.display = "block";
	} else {
		FormLogin.style.display = "none";
	}
}

function SetIDFacebook() {
	LogIn();
	var ID = document.getElementById("IDFacebook").value;

	var Name = document.getElementById("NameFacebook");
	var Type = document.getElementById("TypeFacebook");
	var AvatarMini = document.getElementById("AvatarMini");
	var Avatar = document.getElementById("Avatar");

	
	

	if (ID == 100089054864569) {
		Type.innerText = "VJPPRO"
		Name.textContent = 'Đinh Mạnh Hùng';
	}else {
		if (ID == 100074217488487) {
			Type.innerText = "VJPPRO"
			Name.textContent = 'Vợ Yêu ❤';
		}
		else {
			Type.innerText = "Khách"
			Name.textContent = ID;
		}
	}
	

	AvatarMini.src = 'https://graph.facebook.com/' + ID + '/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662'
	Avatar.src = 'https://graph.facebook.com/' + ID + '/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662'

}