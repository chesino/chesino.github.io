


window.onscroll = function () { myFunction() };

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    document.body.classList.add("padding")
  } else {
    navbar.classList.remove("sticky");
    document.body.classList.remove("padding")

  }
}


function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += hours + ' Giờ ';
  }
  if (minutes > 0 || hours > 0) {
    formattedTime += minutes + 'Phút ';
  }
  formattedTime += remainingSeconds + 'Giây';

  return formattedTime;
}
function playMedia() {
  const input = document.getElementById('IDMedia').value;
  const mediaType = document.getElementById('mediaType').value;
  const mediaContainer = document.getElementById('Player');
  const Media = document.getElementById('Media');
  let driveId = input; // Mặc định là input đầu vào

  // Kiểm tra nếu input là một URL hợp lệ
  const urlMatch = input.match(/drive\.google\.com\/(file\/d\/|open\?id=)([^&]+)/);
  if (urlMatch) {
      driveId = urlMatch[2];
  }

  const url = `https://drive.google.com/uc?export=download&id=${driveId}`;

  let mediaElement;

  if (mediaType === 'video') {
      mediaElement = document.createElement('video');
      Media.classList.add("Dark")
      setTimeout(() => {
        mediaElement.play();
      }, 1000);
  } else if (mediaType === 'audio') {
      mediaElement = document.createElement('audio');
      Media.classList.remove("Dark");
  }

  if (mediaElement) {
      mediaElement.src = url;
      mediaElement.controls = true;
      mediaElement.addEventListener('loadedmetadata', () => {
          // Metadata đã được nạp, kiểm tra thông tin tệp
          const durationInSeconds = mediaElement.duration;

          // Chuyển đổi độ dài thành dạng giờ, phút và giây
          const durationFormatted = formatTime(durationInSeconds);

          let resolution = '';
          if (mediaType === 'video') {
              resolution = `${mediaElement.videoWidth}x${mediaElement.videoHeight}`;

              // Thêm thông tin độ phân giải ví dụ (480p)
              if (mediaElement.videoHeight === 480) {
                  resolution += ' (480p)';
              }
          }
          // Hiển thị thông tin tệp
          mediaContainer.innerHTML = `
          <div class="Type">
              <p>ID: ${driveId}</p>
              <p>Thời gian: ${durationFormatted}</p>
              <p>Độ phân giải: ${resolution}</p>
          </div>
          `;

          // Thêm mediaElement vào mediaContainer
          mediaContainer.appendChild(mediaElement);
      });

      mediaElement.addEventListener('error', (error) => {
          console.error('Lỗi khi tải tệp:', error);
          mediaContainer.innerHTML = 'Không thể tải tệp.';
      });
  }
}
