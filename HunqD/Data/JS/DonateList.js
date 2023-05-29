const donateList = [
  { name: "iVi", amount: "5.000", time: "Momo 20:40-14/05/2023" },
];

const donateBtn = document.querySelector('#btnDonate');
const ibtndonate = document.querySelector('#ibtndonate');
const donateDiv = document.querySelector('.Donate');

let isFirstTimeClick = false;
let clickCount = 0;

donateBtn.addEventListener('click', function () {
    if (!isFirstTimeClick) {
        isFirstTimeClick = true;
    }
    donateDiv.classList.toggle('active');
    clickCount++;
    if (clickCount % 2 === 1) {
        ibtndonate.className = "fa-solid fa-star";
    } else {
        ibtndonate.className = "fa-regular fa-star";
    }
});

donateDiv.addEventListener('click', function (event) {
    if (event.target === this) {
        donateDiv.classList.remove('active');
        ibtndonate.className = "fa-regular fa-star";
    }
});

  
  const ddDonate = document.querySelector(".DDonate");
  const listdonate = document.querySelector(".listdonate");
  
  // Function to fade in an element
  function fadeIn(element) {
    element.style.opacity = "0";
    let opacity = 0;
    const interval = setInterval(() => {
      if (opacity < 1) {
        opacity += 0.1;
        element.style.opacity = opacity;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }
  
  // Function to fade out an element
  function fadeOut(element) {
    let opacity = 1;
    const interval = setInterval(() => {
      if (opacity > 0) {
        opacity -= 0.1;
        element.style.opacity = opacity;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }
  
  function showNextDonor(index) {
    const donor = donateList[index];
  
    const item = document.createElement("div");
    item.classList.add("listdonate-item");
    item.innerHTML = `
      <h1><span>Cảm ơn </span>${donor.name}<span> đã ủng hộ.</span></h1>
      <h2>${donor.amount}đ</h2>
      <p>${donor.time}</p>`;
  
    listdonate.appendChild(item);
  
    setTimeout(() => {
      fadeIn(item);
  
      setTimeout(() => {
        fadeOut(item);
  
        setTimeout(() => {
          item.remove();
  
          if (index < donateList.length - 1) {
            showNextDonor(index + 1);
          } else {
            fadeOut(ddDonate);
          }
        }, 3000); // Wait for 3 seconds before fading out
      }, 3000); // Show each donor for 3 seconds
    }, index * 100); // Delay the appearance based on index (6 seconds between each donor)
  }
  
  setTimeout(() => {
    fadeIn(ddDonate);
    showNextDonor(0);
  }, 2000); // Wait 2 seconds before starting the animation
  
