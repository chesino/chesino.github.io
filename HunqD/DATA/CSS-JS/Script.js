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
    let Mess = '';
    if (result.mess === 0) {
      Mess = 'Bạn và Hùng chưa có tin nhắn nào 😐.'
    } else {
      Mess = 'Bạn và Hùng đã nhắn tin được ' + `<strong> ${result.mess}</strong>` + ' tin nhắn'
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
                <h5>ID: ${result.id} <i onclick="navigator.clipboard.writeText(${result.id});Done('Sao chép thành công','ID của bạn là: ${result.id}')" class="fa-solid fa-copy"></i></h5>
            </div>
        </div>
        <div class="Body">
            <div class="Card">
                <h1>Điểm tương tác</h1>
                <p>Bạn cần ${rank - point} điểm nữa để trở thành ${nextRank} [${point}/${rank}].</p>
                <div class="progress-container">
                    <div class="progress-bar" id="myProgressBar"></div>
                </div>
                <p class="right red">Tính năng này đang bị lỗi.</p>
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
            <div class="Card">
                    <h1>Tin nhắn</h1>
                    <p>${Mess}</p>
                    <p class="right">Cập nhật: 1 ngày trước.</p>
                </div>
                <div class="Card Hidden">
                    <h1>SocialToolKit</h1>
                    <p>Tăng lượt theo dõi, thích, lượt xem,...</p>
                    <div class="SocialToolKit">
                        <label for="">Chọn dịch vụ</label>
                        <select name="" id="">
                            <option value="0">Người theo dõi</option>
                            <option value="1">Lượt thích bài viết</option>
                            <option value="2">Lượt xem Story</option>
                        </select>
                        <div class="S1">
                            <label for="">Tài khoản
                                <span>Sử dụng link Facebook hoặc ID Facebook.</span>
                            </label>
                            <input type="text" placeholder="Link bài viết">
                        </div>
    
                        <div class="S2">
                            <label for="">Link bài viết
                                <span>Sử dụng Link bài viết hoặc Link Story.</span>
                            </label>
                            <input type="text" placeholder="Link bài viết">
                        </div>
                        <label for="">Số lượng <span>Thấp nhất 100 và cao nhất 10,000 mỗi lần.</span></label>
                        <input type="number" name="" id="">
    
                        <h5>Tổng số tiền bạn cần thanh toàn là</h5>
                        <h1>0đ</h1>
    
                        <label for="">Mã giảm giá</label>
                        <input type="text">
    
                        <label for="">Chọn thương thức thanh toán</label>
                        <select name="" id="">
                            <option value="0">HunqD Point</option>
                            <option value="1">Ví MOMO</option>
                            <option value="2">Chuyển khoản ngân hàng</option>
                        </select>
                        <button>Thanh toán ngay</button>
                    </div>
                </div>
            <div class="Card Question">
                <h1>Gửi câu hỏi</h1>
                <p>Cho phép bạn gửi tin nhắn ẩn danh hoặc công khai cho Hùng.</p>
                <textarea name="SendMess" id="SendMess" rows="5" placeholder="Hãy đặt câu hỏi"></textarea>
                <button onclick="SendMess()">Gửi</button>
                <h2>OR</h2>
                <p class="Tips">Để Hùng chủ động nhắn tin tới bạn hãy sao chép ID và gửi bằng NGL 🧐.</p>
                <iframe src="https://ngl.link/ngl_kakashi" frameborder="0"></iframe>
            </div>
           
      </div>
      `;

      CheckFriend.classList.add('Hidden');
      CheckFriend.scrollTop = 0;

      DoneSignIn(`Tài khoản: ${result.name}`)
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

function DoneSignIn(T1) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "success",
    title: T1
  });
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

  if (SendMess !== '') {
    const redirectUrl = `https://www.messenger.com/t/61551995024526?text=${SendMess}`;
    window.open(redirectUrl, '_blank');
  } else {
    Fail('Ủa alo ?', 'Vui lòng nhập câu hỏi.');
  }

}




function SignUp() {
  Swal.fire({
    title: 'Bạn cần kết bạn với Hùng',
    text: 'Để có tài khoản bạn cần kết bạn với Hùng và đợi 24 giờ sau khi kết bạn. Nếu bạn xoá bạn bè tài khoản sẽ bị xoá khỏi danh sách sau 1 - 7 ngày.',
    icon: 'warning',
    
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Kết bạn ngay',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Đang mở Facebook',
        'Bạn sẽ được chuyển tới Facebook của Hùng sau 3 giây.',
        'success',
        setTimeout(() => {
          window.open('https://www.facebook.com/profile.php?id=61551995024526', '_blank');
        }, 3000)
      )
    }
  })
}

