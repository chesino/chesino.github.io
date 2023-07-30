let timerInterval;
let startTime;
let isCounting = false; // Thêm biến để kiểm tra trạng thái đang đếm hay không

const display = document.getElementById("timer");
const daysDisplay = document.getElementById("days");
const monthsDisplay = document.getElementById("months");
const weeksDisplay = document.getElementById("weeks");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

function updateTime() {
  if (isCounting) { // Kiểm tra xem có đang đếm không
    const currentTime = new Date().getTime();
    let timeDiff = currentTime - startTime;

    let seconds = Math.floor(timeDiff / 1000) % 60;
    let minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
    let hours = Math.floor(timeDiff / (1000 * 60 * 60));
    let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    let weeks = Math.floor(days / 7);
    let months = Math.floor(days / 30); // Ước lượng số tháng

    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedHours = hours < 10 ? "0" + hours : hours;

    display.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    daysDisplay.textContent = days;
    monthsDisplay.textContent = months;
    weeksDisplay.textContent = weeks;
  }
}

function resetTime() {
  const confirmation = prompt("Nhập 'ok' để đặt lại thời gian đếm.");
  if (confirmation === "ok") {
    clearInterval(timerInterval);
    startTime = new Date().getTime();
    display.textContent = "00:00:00";
    daysDisplay.textContent = "0";
    monthsDisplay.textContent = "0";
    weeksDisplay.textContent = "0";
    isCounting = false; // Dừng đếm
    startButton.disabled = false;
  }
}

startButton.addEventListener("click", () => {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTime, 1000);
  isCounting = true; // Bắt đầu đếm
  startButton.disabled = true;
});

resetButton.addEventListener("click", resetTime);

// Lưu giá trị thời gian bắt đầu vào Local Storage khi thoát trang
window.addEventListener("beforeunload", () => {
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("isCounting", isCounting); // Lưu trạng thái đếm
});

// Đọc giá trị thời gian bắt đầu từ Local Storage và tiếp tục đếm thời gian khi tải lại trang
window.addEventListener("load", () => {
  const savedStartTime = localStorage.getItem("startTime");
  const savedIsCounting = localStorage.getItem("isCounting");
  if (savedStartTime && savedIsCounting === "true") {
    startTime = parseInt(savedStartTime);
    isCounting = true; // Tiếp tục đếm
    updateTime();
    timerInterval = setInterval(updateTime, 1000);
    startButton.disabled = true;
  }
});
