ReloadBlog();
function ReloadBlog() {

  const rssUrl1 = 'https://projectap2.wordpress.com/feed/';
  const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';


  fetch(proxyUrl + encodeURIComponent(rssUrl1))
    .then(response => response.text())
    .then(str => new DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");

      let storyCount = 0;
      let storyHTML = '';

      items.forEach((item, index) => {
        storyCount++;
        const reverseIndex = items.length - index; // Tính chỉ số đếm ngược
        const storyId = `FeedID${reverseIndex}`; // Tạo id của div Feed


        const title = item.querySelector("title").textContent;
        const encoded = item.querySelector("encoded").textContent;
        const pubDate = item.querySelector("pubDate").textContent;
        const creator = item.querySelector("creator").textContent;

        const pubDateTimeStamp = Date.parse(pubDate);
        const nowTimeStamp = Date.now();
        const timeDiff = nowTimeStamp - pubDateTimeStamp;

        // Chuyển khoảng thời gian từ millisecond sang giây, phút, giờ hoặc ngày
        const secondDiff = Math.floor(timeDiff / 1000);
        const minuteDiff = Math.floor(timeDiff / (1000 * 60));
        const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        let timeDiffText = '';

        var dateObj = new Date(pubDate);
        var daysOfWeek = ["Chủ Nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        var dayOfWeek = daysOfWeek[dateObj.getDay()];
        var day = dateObj.getDate();
        var month = dateObj.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
        var year = dateObj.getFullYear();

        var formattedDate = dayOfWeek + ". " + day + "/" + month + "/" + year;


        if (dayDiff >= 365) {
          timeDiffText = formattedDate;
        } else if (dayDiff > 0) {
          timeDiffText = dayDiff + " ngày trước";
        } else if (hourDiff > 0) {
          timeDiffText = hourDiff + " giờ trước";
        } else if (minuteDiff > 0) {
          timeDiffText = minuteDiff + " phút trước";
        } else {
          timeDiffText = "Vừa xong";
        }

        let author = '';
        let srcIMG = '';
        if (creator === 'HunqD') {
          author = 'Đinh Mạnh Hùng';
          srcIMG = 'https://graph.facebook.com/100045640179308/picture?type=large&amp;access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662';
        } else {
          author = 'Không rõ';
          srcIMG = '/DATA/logo.png';
        }


        storyHTML += `
      <div class="Feed" id="${storyId}">
        <div class="Head">
            <div class="Author">
                <div class="Avatar">
                    <img src="${srcIMG}" alt="${author}">
                </div>
                <div class="Info">                                                                             
                    <div class="Name">${author}</div>
                    <div class="Time">${timeDiffText}</div>
                </div>
                <div class="Func Share">
                <i class="fa-solid fa-share-from-square"></i>
              </div>
            </div>
        </div>
        
        <div class="Body">
            <div class="Status">
                <h1>${title}</h1>
                <div class="Content">${encoded}</div>
            </div>
        </div>
      </div>
      `;
      });


      document.querySelector('#rss-feed').innerHTML = storyHTML;

      // Lấy tất cả các div có lớp wp-block-video
      var videoDivs = document.querySelectorAll('.wp-block-video');
      // Lặp qua từng div và tìm thẻ video trong mỗi div
      videoDivs.forEach(function (videoDiv) {
        var video = videoDiv.querySelector('video');
        if (video) {
          video.setAttribute('webkit-playsinline', '');
          video.setAttribute('playsinline', '');
          video.removeAttribute('controls', ''); // Thêm thuộc tính controls nếu chưa có
        }
      });


      const videos = document.querySelectorAll('.wp-block-video video');

      videos.forEach(video => {
        video.addEventListener('click', function () {
          // Dừng tất cả các video khác
          videos.forEach(otherVideo => {
            if (otherVideo !== video) {
              otherVideo.pause();
            }
          });
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
      });


      const shareButtons = document.querySelectorAll('.Func.Share');

      shareButtons.forEach(button => {
        button.addEventListener('click', function () {
          const story = button.closest('.Feed');
          const storyId = story.id;
          const currentUrl = 'https://chesino.github.io/AP2/';
          const shareUrl = `${currentUrl}#${storyId}`;

          // Cập nhật URL chứa #StoryID vào clipboard
          if (navigator.share) {
            navigator.share({
              url: shareUrl,
            })
              .then(() => console.log('Chia sẻ thành công'))
              .catch((error) => console.error('Lỗi chia sẻ:', error));
          } else {
            // Hiển thị thông báo cho các trình duyệt không hỗ trợ API Web Share
            alert('Trình duyệt của bạn không hỗ trợ chức năng chia sẻ.');
          }
        });
      });


      setTimeout(() => {
        const hash = window.location.hash;

        if (hash && hash !== '') {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            document.getElementById('tablinksStory').click();
            targetElement.className += " Active";
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 200);



      let latestItem = null;
      let latestPubDate = null;

      items.forEach(item => {
        const pubDate = item.querySelector("pubDate").textContent;
        const pubDateTimeStamp = Date.parse(pubDate);

        if (latestPubDate === null || pubDateTimeStamp > latestPubDate) {
          latestItem = item;
          latestPubDate = pubDateTimeStamp;
        }
      });
      Modal();
    })
    .catch(error => console.log(error));
}




var highlightedIndex = 0; // Index của phần tử .Feed đang được tô sáng
var foundFeedElements = []; // Mảng chứa các phần tử .Feed đã tìm thấy

function searchFeeds() {
  // Lấy giá trị từ ô input
  var searchText = document.getElementById("searchInput").value.toLowerCase();

  // Lấy tất cả các phần tử .Feed
  var feedElements = document.querySelectorAll("#rss-feed .Feed");

  // Xóa mảng phần tử .Feed đã tìm thấy từ trước
  foundFeedElements = [];

  // Thiết lập lại trạng thái khi tìm kiếm mới
  highlightedIndex = 0;
  updateHighlight();

  // Biến để kiểm tra xem có phần tử nào tìm thấy không
  var found = false;

  // Duyệt qua từng phần tử .Feed
  feedElements.forEach(function (feedElement, index) {
    // Lấy văn bản trong phần tử .Feed
    var feedText = feedElement.innerText.toLowerCase();

    // Kiểm tra xem văn bản tìm kiếm có xuất hiện trong phần tử .Feed không
    if (feedText.includes(searchText)) {
      // Nếu tìm thấy, đặt biến found là true và tô sáng phần tử .Feed
      found = true;
      feedElement.classList.add("highlighted");

      // Thêm phần tử .Feed vào mảng các phần tử đã tìm thấy
      foundFeedElements.push(feedElement);

      // Cập nhật index của phần tử .Feed đang được tô sáng
      highlightedIndex = foundFeedElements.length - 1;
    } else {
      // Nếu không tìm thấy, đảm bảo rằng phần tử không được tô sáng
      feedElement.classList.remove("highlighted");
    }
  });

  // Nếu không tìm thấy, thông báo
  if (!found) {
    alert("Không tìm thấy kết quả");
  }

  // Cuộn đến phần tử .Feed đầu tiên trong danh sách đã tìm thấy
  if (foundFeedElements.length > 0) {
    foundFeedElements[highlightedIndex].scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function scrollToHighlighted() {
  // Kiểm tra xem có phần tử .Feed đã tìm thấy không
  if (foundFeedElements.length > 0) {
    // Cuộn đến phần tử .Feed đang được tô sáng
    foundFeedElements[highlightedIndex].scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateHighlight() {
  // Loại bỏ tất cả các lớp "highlighted" để đảm bảo không có phần tử nào được tô sáng
  foundFeedElements.forEach(function (feedElement) {
    feedElement.classList.remove("highlighted");
  });

  // Tô sáng phần tử .Feed ở vị trí hiện tại của biến highlightedIndex
  if (foundFeedElements[highlightedIndex]) {
    foundFeedElements[highlightedIndex].classList.add("highlighted");
  }
}

function scrollUp() {
  // Giảm index và cập nhật tô sáng
  highlightedIndex = Math.max(0, highlightedIndex - 1);
  updateHighlight();
  scrollToHighlighted();
}

function scrollDown() {
  // Tăng index và cập nhật tô sáng
  highlightedIndex = Math.min(foundFeedElements.length - 1, highlightedIndex + 1);
  updateHighlight();
  scrollToHighlighted();
}
function scrollToTop() {
  // Cuộn đến đầu trang
  window.scrollTo({ top: 0, behavior: 'smooth' });
}



$(document).ready(function () {
  // Xác định nút nhấn và thực hiện chức năng khi được nhấn
  $('#hideImagesButton').on('click', function () {
    // Ẩn toàn bộ ảnh trong các .Feed
    $('.Feed .Content').children().not('blockquote').toggle();

    var iconClass = $(this).find('i').hasClass('fa-eye-slash') ? 'fa-eye' : 'fa-eye-slash';
    $(this).find('i').removeClass().addClass('fa-solid ' + iconClass);
  });

});


function Modal() {
  // Lấy tất cả các thẻ img có class là wp-block-gallery trong Feed
  var images = document.querySelectorAll('.Feed .Status img');

    images.forEach(function (img) {
        img.addEventListener('click', function () {
            var modal = document.createElement('div');
            modal.className = 'modal';
            
            // Thêm hình ảnh và chữ HunqD vào modal
            modal.innerHTML = '<span class="close">&times;</span><img class="modal-content" src="' + img.src + '"><div class="caption">Power by HunqD.</div>';
            
            document.body.appendChild(modal);
            
            var closeBtn = modal.querySelector('.close');
            
            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
                document.body.removeChild(modal);
            });
            
            modal.style.display = 'block';
        });
    });
}



