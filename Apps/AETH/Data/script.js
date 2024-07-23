window.onload = function () {
  const counter = document.getElementById('counter');
  const targetNumber = 34846; // số mục tiêu mà bạn muốn đếm đến
  const duration = 3000; // thời gian đếm (miliseconds)

  let currentNumber = 0;
  const increment = targetNumber / (duration / 100); // giá trị tăng mỗi 100ms

  const updateCounter = () => {
    currentNumber += increment;
    if (currentNumber < targetNumber) {
      counter.textContent = Math.ceil(currentNumber);
      setTimeout(updateCounter, 100);
    } else {
      counter.textContent = targetNumber;
      UpdateTime();
    }
  };

  updateCounter();

};

function UpdateTime() {
  var timeUpdate = new Date('2024-07-24T00:00:00');
  var timeDifference = new Date() - timeUpdate;
  let UpdateTime = ''
  // Chuyển đổi chênh lệch thời gian từ milliseconds sang phút và ngày
  var minutesDifference = Math.floor(timeDifference / (1000 * 60));
  var hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (minutesDifference < 60 && hoursDifference == 0) {
    UpdateTime = minutesDifference + ' phút trước'
  } else if (daysDifference === 0) {
    UpdateTime = hoursDifference + ' giờ trước'
  } else {
    UpdateTime = daysDifference + ' ngày trước'
  }
  document.getElementById('UpdateTime').innerText = UpdateTime;
}

function PlayMusic() {
  var dRingtone = document.getElementById("myAudio2");
  dRingtone.currentTime = 0
  dRingtone.play();S
}