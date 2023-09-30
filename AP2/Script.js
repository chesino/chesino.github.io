function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const members = document.querySelectorAll('.Member');
  let currentIndex = 0;

  function showMember(index) {
      members.forEach(member => member.classList.remove('active'));
      members[index].classList.add('active');
  }

  function nextMember() {
      currentIndex = (currentIndex + 1) % members.length;
      showMember(currentIndex);
  }

  // Initial display
  showMember(currentIndex);

  // Automatic slideshow every 3 seconds
  setInterval(nextMember, 3000);
});