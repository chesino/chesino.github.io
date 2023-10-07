function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}


var vWelcome = document.getElementById("Welcome");
var contentArray = ['PROJECT', 'AP2', 'By'];
var contentArray2 = ['AP2', 'Blog', 'HunqD'];
var currentIndex = 0;

function changeContent() {
  vWelcome.innerHTML = `<h1>${contentArray[currentIndex]} <b>${contentArray2[currentIndex]}.</b></h1>`;
  currentIndex = (currentIndex + 1) % contentArray.length;
}

setTimeout(() => {
  vWelcome.style.opacity = 1;
  changeContent();
}, 2000);

// Thay đổi nội dung mỗi 2 giây
setInterval(() => {
  vWelcome.style.opacity = 0;
  setTimeout(() => {
    changeContent();
    vWelcome.style.opacity = 1;
  }, 1000);
}, 5000);


document.addEventListener('DOMContentLoaded', function () {
  const bg = document.querySelector('.BG');

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    bg.style.backgroundPosition = ` -${scrolled}px `;
  });
});



// Phần máy tính
function CalculatorA() {
  var Amin = parseInt(document.getElementById('A-Min').value);
  var Aneed = parseInt(document.getElementById('A-Need').value);
  var Aneed2 = document.getElementById('A-Need');
  var Amax = parseInt(document.getElementById('A-Max').value);
  var Aunit = document.getElementById('A-Unit').value;

  var Bmin = parseInt(document.getElementById('B-Min').value);
  var Bneed = parseInt(document.getElementById('B-Need').value);
  var Bneed2 = document.getElementById('B-Need');

  var Bmax = parseInt(document.getElementById('B-Max').value);
  var Bunit = document.getElementById('B-Unit').value;

  var Result = document.getElementById('Result');

  // Tìm A
  if ( isNaN(Aneed) ) {
    Aneed2.style.backgroundColor = 'green';
    Aneed2.value = (Bneed - Bmin) * ( Amax / (Bmax - Bmin) ).toFixed(4) 
  }

  // Tìm B
  if (isNaN(Bneed)) {
    Bneed2.style.backgroundColor = 'green';
    Bneed2.value =  Aneed / ( Amax / (Bmax - Bmin) ) + Bmin 
  }


}
function ClearA() {
  var Aneed2 = document.getElementById('A-Need');
  var Bneed2 = document.getElementById('B-Need');

  Aneed2.style.backgroundColor = 'white';
  Aneed2.value =  '';

  Bneed2.style.backgroundColor = 'white';
  Bneed2.value =  '';
}
