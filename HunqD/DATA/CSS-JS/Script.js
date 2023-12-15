const Version = '2.1'
document.getElementById('Version').innerText = 'v' + Version;

function handleEnter(event, nextInputId) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById(nextInputId).focus();

    // Nếu là input cuối cùng, thực hiện SignIn()
    if (nextInputId === 'signInButton') {
      SignIn();
    }
  }
}

function SignIn() {
  const searchInput = document.getElementById('searchInput').value;
  const passwordInput = document.getElementById('passwordInput').value;
  const resultDiv = document.getElementById('result');
  const CheckFriend = document.getElementById('CheckFriend');
  const resultText = document.getElementById('resultText');
  const BoxInput = document.getElementById('BoxInput');

  const result = searchByNameOrID(searchInput);

  if (result && result.pass === passwordInput) { // Kiểm tra mật khẩu
    const formattedTime = formatTimestamp(result.timestamp);
    const formattedTime2 = formatTimestamp2(result.timestamp);
    if (result.id === undefined) {
      result.id = 'Chưa cập nhật ID'
      img = '/DATA/logo.png';

    } else {
      result.id
      img = `https://graph.facebook.com/${result.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    }

    var rank = 0;
    var point = result.point;
    let titleRank = 'N/A'
    let nextRank = 'N/A'
    if (point <= 20) {
      rank = 20
      titleRank = 'Bạn FB'
      nextRank = 'Fan Cứng'
    }
    if (point >= 20 && point <= 30) {
      rank = 30
      titleRank = 'Fan Cứng'
      nextRank = 'Fan Cứng 2'
    }

    BoxInput.classList.add('Hidden');
    resultText.innerHTML = 'Đang đăng nhập  <i class="fa-solid fa-circle-notch"></i>';
    setTimeout(() => {
      resultDiv.innerHTML = `
      <div class="Head">
            <div class="Avatar">
              <img src="${img}" alt="Avatar" >
              <div class="Rank">${titleRank}</div>
            </div>
            <div class="Name">
                <h1>${result.name}</h1>
                <h5>ID: ${result.id} <i onclick="navigator.clipboard.writeText(${result.id});Done('Sao chép thành công','Đã sao chép ID: ${result.id}')" class="fa-solid fa-copy"></i></h5>
            </div>
        </div>
        <div class="Body">
            <div class="Card">
                <h1>Điểm tương tác</h1>
                <p>Bạn cần ${rank - point} điểm nữa để trở thành ${nextRank} [${point}/${rank}].</p>
                <div class="progress-container">
                    <div class="progress-bar" id="myProgressBar"></div>
                </div>
                <p class="right">Cập nhật: 1 tuần trước.</p>
            </div>
            <div class="Card Flex">
                <div class="One">
                    <div class="Avatar">
                        <img src="https://graph.facebook.com/61551995024526/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662" alt="Avatar" >
                    </div>
                    <div class="Avatar">
                        <img src="${img}" alt="Avatar" >
                    </div>
                </div>
                <div class="Two">
                    <p>Bạn đã kết nối với Hùng</p>
                    <h1>${formattedTime2}</h1>
                    <p>${formattedTime}</p>
                </div>
            </div>
            <div class="Card Question">
                <h1>Gửi câu hỏi</h1>
                <p>Cho phép bạn gửi tin nhắn ẩn danh hoặc công khai cho Hùng.</p>
                <textarea name="SendMess" id="SendMess" rows="5" placeholder="Hãy đặt câu hỏi"></textarea>
                <button onclick="SendMess()">Gửi</button>
                <h2>OR</h2>
                <iframe src="https://ngl.link/ngl_kakashi" frameborder="0"></iframe>
            </div>
            <div class="Card">
                <h1>Tin nhắn</h1>
                <p>Hiện tại chưa cập nhật tính năng này.</p>
            </div>
            <div class="Card">
                <h1>Thư mục chia sẻ</h1>
                <p>Cho phép bạn chia sẻ tệp, tài liệu, ảnh, video với Hùng.</p>
            </div>
      </div>
      `;

      CheckFriend.classList.add('Hidden');
      CheckFriend.scrollTop = 0;
      Done('Đăng nhập thành công', `Tài khoản: ${result.name}`)
      setTimeout(() => {
        move(point, rank);
      }, 500);

    }, 1500);


  } else {
    if (searchInput !== '' && passwordInput !== '') {
      Fail('Tài khoản không tồn tại', 'Có thể bạn nhập sai tài khoản mật khẩu hoặc chưa đăng ký.');
    } else {
      Fail('Không thể đăng nhập', 'Vui lòng nhập tài khoản & mật khẩu');
    }

  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // Đổi timestamp thành mili giây
  return date.toLocaleString(); // Sử dụng phương thức toLocaleString() để định dạng ngày giờ
}

function formatTimestamp2(timestamp) {
  const now = new Date();
  const date = new Date(timestamp * 1000);

  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };

  const nowFormatted = now.toLocaleDateString('en-US', options);
  const dateFormatted = date.toLocaleDateString('en-US', options);

  console.log(`Ngày hiện tại: ${nowFormatted}`);
  console.log(`Ngày từ timestamp: ${dateFormatted}`);

  // Tính số ngày chênh lệch
  const timeDiff = now.getTime() - date.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const yearsDiff = Math.floor(daysDiff / 365);
  const monthsDiff = Math.floor((daysDiff % 365) / 30);
  const remainingDays = daysDiff % 30;

  let result = '';

  if (yearsDiff > 0) {
    result = `${remainingDays} ngày ${monthsDiff} tháng ${yearsDiff} năm`;
  } else if (monthsDiff > 0) {
    result = `${remainingDays} ngày ${monthsDiff} tháng`;
  } else {
    result = `${remainingDays} ngày`;
  }

  return result;
}


function extractFacebookProfileURL(input) {
  // Kiểm tra xem input có chứa chuỗi cần tìm kiếm hay không
  if (input.includes("https://www.facebook.com/profile.php?id=")) {
    // Sử dụng regular expression để trích xuất URL
    const match = input.match(/(https:\/\/www\.facebook\.com\/profile\.php\?id=\d+)/);

    // Nếu có kết quả, trả về URL, ngược lại trả về null
    return match ? match[1] : null;
  } else {
    return input
  }
}

function searchByNameOrID(query) {
  // Check if the query is a numeric value (potential ID)
  if (!isNaN(query)) {
    // Search by ID
    const idQuery = parseInt(query);
    for (const data of jsonData[0]) {
      if (data.id === idQuery) {
        return data;
      }
    }
  } else {
    if (query.includes("https://")) {
      facebookURL = extractFacebookProfileURL(query);
      for (const data of jsonData[0]) {
        if (data.profileURL === facebookURL) {
          return data;
        }
      }
    } else {
      for (const data of jsonData[0]) {
        if (data.name === query || data.profileURL === query) {
          return data;
        }
      }
    }
  }

  return null;
}


function SignUp() {
  const searchInput = document.getElementById('searchInput').value;
  const passwordInput = document.getElementById('passwordInput').value; // Thêm dòng này để lấy mật khẩu

  if (searchInput !== '' && passwordInput !== '') {
    const redirectUrl = `http://m.me/ChesinoPage?text=${searchInput}:${passwordInput}`;
    window.open(redirectUrl, '_blank');
  } else {
    Fail('Không thể đăng ký', 'Vui lòng điền thông tin để đăng ký.');
  }

}


function move(a, b) {
  var x = (a * 100) / b;
  var elem = document.getElementById("myProgressBar");
  var width = 0;
  var id = setInterval(frame, 10);

  function frame() {
    if (width >= x) {
      clearInterval(id);
    } else {
      width += 0.5; // Tăng giá trị này để đạt được hiệu ứng mượt mà hơn
      elem.style.width = width + '%';
      elem.innerHTML = Math.round(width * (b / 100)); // Cập nhật giá trị hiển thị
    }
  }
}

function Done(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'success'
  )
}

function Fail(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'error'
  )
}


function SendMess() {
  const SendMess = document.getElementById('SendMess').value;

  if (SendMess !== '' ) {
    const redirectUrl = `https://www.messenger.com/t/61551995024526?text=${SendMess}`;
    window.open(redirectUrl, '_blank');
  } else {
    Fail('Ủa alo ?', 'Vui lòng nhập câu hỏi.');
  }

}