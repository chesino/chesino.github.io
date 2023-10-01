// function myFunction() {
//   var x = document.getElementById("myTopnav");
//   if (x.className === "topnav") {
//     x.className += " responsive";
//   } else {
//     x.className = "topnav";
//   }
// }

// document.addEventListener('DOMContentLoaded', function () {
//   const members = document.querySelectorAll('.Member');
//   let currentIndex = 0;

//   function showMember(index) {
//       members.forEach(member => member.classList.remove('active'));
//       members[index].classList.add('active');
//   }

//   function nextMember() {
//       currentIndex = (currentIndex + 1) % members.length;
//       showMember(currentIndex);
//   }

//   // Initial display
//   showMember(currentIndex);

//   // Automatic slideshow every 3 seconds
//   setInterval(nextMember, 3000);
// });


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
}, 10000);


document.addEventListener('DOMContentLoaded', function () {
  const bg = document.querySelector('.BG');

  window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      if (scrolled <= 1100) {
        bg.style.backgroundPosition = ` -${scrolled}px`;
      }else{
        console.log(scrolled - 1100);
        bg.style.backgroundPosition = `${-1100 + scrolled - 1100}px`;
      }
  
  });
});

