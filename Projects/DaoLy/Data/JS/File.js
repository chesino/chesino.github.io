let intervalId = null;
let isScrolling = false;
let button = document.getElementById("scroll-button");

button.addEventListener("click", function() {
  if (!isScrolling) {
    intervalId = setInterval(function() {
      window.scrollBy(0, 1);
    }, 120);
    isScrolling = true;

    button.innerHTML = '<i class="fa-solid fa-robot"></i>';
  } else {
    clearInterval(intervalId);
    isScrolling = false;
    button.innerHTML = '<i class="fa-solid fa-book-open-reader"></i>';
  }
});
