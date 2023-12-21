const Version = '1.1Beta'

var timeUpdate = new Date('2023-12-20T00:00:00');
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

    if (result.name === 'Hùng Đinh') {
      const userListElement = document.getElementById("userList");

      // Lặp qua mỗi đối tượng người dùng trong dữ liệu JSON và thêm vào danh sách
      jsonData[0].forEach(user => {
        // Tạo phần tử .card
        const card = document.createElement("div");
        card.classList.add("CardMember");

        // Tạo phần tử ảnh
        const userImage = document.createElement("img");
        userImage.src = `https://graph.facebook.com/${user.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        userImage.alt = user.name + "'s Image";
        userImage.classList.add("user-image");


        // Tạo phần tử ul để chứa thông tin người dùng
        const userInfoList = document.createElement("ul");

        // Thêm thông tin người dùng vào phần tử ul
        Object.keys(user).forEach(key => {
          if (key !== 'point' && key !== 'mess' && key !== 'pass') {
            const listItem = document.createElement("li");

            // Chuyển đổi timestamp thành định dạng ngày giờ
            const value = key === 'timestamp' ? new Date(user[key] * 1000).toLocaleString() : user[key];

            listItem.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
            userInfoList.appendChild(listItem);
          }
        });

        // Thêm phần tử ảnh và phần tử ul vào phần tử .card
        card.appendChild(userImage);
        card.appendChild(userInfoList);

        // Thêm phần tử .card vào phần tử div
        userListElement.appendChild(card);
      });
    }

    var ranks = [
      { minPoint: 0, maxPoint: 19, title: 'Bạn FB', nextRank: 'Fan Cứng' },
      { minPoint: 20, maxPoint: 29, title: 'Fan Cứng', nextRank: 'Fan Pro' },
      { minPoint: 30, maxPoint: 39, title: 'Fan Pro', nextRank: 'Fan Pro Max' },
      { minPoint: 40, maxPoint: 99, title: 'Fan Pro Max', nextRank: 'Fan Ultra' },
      // Thêm các mức rank khác tương tự ở đây
    ];

    var point = result.point;
    var rank = 0;
    let titleRank = 'N/A';
    let nextRank = 'N/A';

    for (var i = 0; i < ranks.length; i++) {
      if (point >= ranks[i].minPoint && point <= ranks[i].maxPoint) {
        rank = ranks[i].maxPoint;
        titleRank = ranks[i].title;
        nextRank = ranks[i].nextRank;
        break; // Kết thúc vòng lặp khi tìm được mức rank phù hợp
      }
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
                <p>Bạn cần ${rank - point + 1} điểm nữa để trở thành ${nextRank} [${point}/${rank + 1}].</p>
                <div class="progress-container">
                    <div class="progress-bar" id="myProgressBar"></div>
                </div>
                <p class="right red">Tính năng này đang bảo trì.</p>
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
                    <p class="right">Cập nhật: ${UpdateTime}.</p>
                </div>
                <div class="Card">
                <h1>Facebook ToolKit</h1>
                <p>Tăng lượt theo dõi, thích, lượt xem,...</p>
                <div class="SocialToolKit">
                    <label for="">Chọn dịch vụ</label>
                    <select id="selectService">
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
                    <input type="number" id="quantityInput">
            
                    <h5>Tổng số tiền bạn cần thanh toàn là</h5>
                    <h1 id="totalCost">0đ</h1>
            
                    <p id="discountMessage"></p>
            
                    <label for="">Mã giảm giá</label>
                    <input type="text" id="discountCode">
            
                    <label for="">Chọn thương thức thanh toán</label>
                    <select id="selectPaymentMethod">
                        <option value="0">HunqD Point</option>
                        <option value="1">Ví MOMO</option>
                        <option value="2">Chuyển khoản ngân hàng</option>
                    </select>
                    <button onclick="Warning('Sắp ra mắt','Tính năng này sắp ra mắt !')">Thanh toán ngay</button>
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
      resultDiv.classList.remove('Hidden');
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      ToolKit();
      DoneSignIn(`Tài khoản: ${result.name}`)

      setTimeout(() => {
        move(point, rank);
        if (result.pass === '123') {
          Warning('Cảnh báo', 'Bạn đang sử dụng mật khẩu mặc định hãy thay đổi mật khẩu mới để bảo mật tài khoản. Hiện tại chưa thể thay đổi bằng cách tự động hãy nhắn tin cho Hùng để đổi mất khẩu mới!')
        }
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

    if (input.includes("https://www.facebook.com/")) {
      // Sử dụng regular expression để trích xuất URL
      const match = input.match(/(https:\/\/www\.facebook\.com\/[^\?]+)/);

      // Nếu có kết quả, trả về URL, ngược lại trả về null
      return match ? match[1] : null;
    } else {
      return input
    }
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
function Warning(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'warning'
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
    text: 'Để có tài khoản bạn cần kết bạn với Hùng và đợi 24 giờ sau khi kết bạn. Nếu xoá bạn bè tài khoản sẽ bị xoá khỏi danh sách sau 30 ngày.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Kết bạn ngay',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Đã mở Facebook',
        'Bạn sẽ được chuyển tới Facebook của Hùng.',
        'success',
        window.open('https://www.facebook.com/profile.php?id=61551995024526', '_blank')
      )
    }
  })
}

function calculateTotal() {
  var service = document.getElementById('selectService').value;
  var quantity = parseInt(document.getElementById('quantityInput').value);
  var discountCode = document.getElementById('discountCode').value;
  var paymentMethod = document.getElementById('selectPaymentMethod').value;

  // Define the cost per unit for each service
  var costPerUnit = {
    '0': 55, // Cost for Người theo dõi
    '1': 50,  // Cost for Lượt thích bài viết
    '2': 40   // Cost for Lượt xem Story
  };

  // Define discount codes and their required amounts
  var discountCodes = {
    'NOEL': 5000,
    'HUNQD': 10000
    // Add more discount codes and amounts here as needed
  };

  // Calculate total cost
  var totalCost = quantity * costPerUnit[service];

  // Check if a valid discount code is entered and total cost meets the requirement
  if (discountCodes.hasOwnProperty(discountCode)) {
    var requiredAmount = discountCodes[discountCode];

    if (totalCost >= requiredAmount) {
      var discountAmount = discountCodes[discountCode];
      totalCost -= discountAmount;

      // Display discount message
      document.getElementById('discountMessage').textContent = 'Bạn đã giảm được ' +
        formatNumber(discountAmount) + 'đ khi sử dụng mã ' + discountCode;
    } else {
      // Display message when total cost does not meet the requirement
      document.getElementById('discountMessage').textContent = 'Mã ' + discountCode +
        ' chỉ áp dụng cho đơn hàng từ ' + formatNumber(requiredAmount) + 'đ trở lên.';
    }
  } else {
    // Display message when the entered discount code is not valid
    document.getElementById('discountMessage').textContent = 'Mã giảm giá không hợp lệ.';
  }

  // Update the total cost on the page with formatted number or display 0 if NaN
  document.getElementById('totalCost').textContent = isNaN(totalCost) ? '0đ' : formatNumber(totalCost) + 'đ';
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



function ToolKit() {
  document.getElementById('quantityInput').addEventListener('input', calculateTotal);
  document.getElementById('discountCode').addEventListener('input', calculateTotal);
  // Add event listeners for real-time updates
  document.getElementById('selectService').addEventListener('change', function () {
    // Hide both S1 and S2 by default
    document.querySelector('.S1').style.display = 'none';
    document.querySelector('.S2').style.display = 'none';

    // Show the selected element based on the value of selectService
    var selectedService = document.getElementById('selectService').value;
    if (selectedService === '0') {
      document.querySelector('.S1').style.display = 'block';
    } else {
      document.querySelector('.S2').style.display = 'block';
    }

    // Recalculate the total when the service selection changes
    calculateTotal();
  });
}
