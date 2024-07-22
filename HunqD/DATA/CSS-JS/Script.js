const Version = '1.2.2'

var timeUpdate = new Date('2024-07-22T00:00:00');
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

document.addEventListener('DOMContentLoaded', function () {
  const storedLoginInfo = localStorage.getItem('loginInfo');

  if (!storedLoginInfo) {
    // Nếu không có thông tin đăng nhập, chuyển hướng người dùng đến trang đăng nhập hoặc hiển thị thông báo
    // Ví dụ: window.location.href = '/login.html'; hoặc hiển thị thông báo đăng nhập
  } else {
    const { username, password } = JSON.parse(storedLoginInfo);
    document.getElementById('searchInput').value = username;
    document.getElementById('passwordInput').value = password;
    SignIn(); // Gọi hàm đăng nhập
  }
});



function SignIn() {
  const searchInput = document.getElementById('searchInput').value;
  const passwordInput = document.getElementById('passwordInput').value;
  const resultDiv = document.getElementById('result');
  const CheckFriend = document.getElementById('CheckFriend');
  const BoxInput = document.getElementById('BoxInput');

  const result = searchByNameOrID(searchInput);

  if (result && result.pass === passwordInput) { // Kiểm tra mật khẩu
    saveLoginInfo(searchInput, passwordInput);
    const formattedTime = formatTimestamp(result.timestamp);
    const formattedTime2 = formatTimestamp2(result.timestamp);
    if (result.id === undefined || result.name === 'Khách') {
      result.id = 'Tài khoản khách'
      img = '/DATA/logo.png';
    } else {
      result.id
      img = `https://graph.facebook.com/${result.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    }


    if (result.name === 'Hùng Đinh') {
      HunqD();
    }
    // Hùng, Hiền , Thiện , Hoa , Hoàng
    if (result.id === 61551995024526 || result.id === 100022625414871 || result.id === 100028302531768 || result.id === 100037528999692 || result.id === 100015905130912) {
      AETH();
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
      Mess = 'Bạn và Hùng đã nhắn tin được ' + `<strong> ${result.mess}</strong>` + 'tin nhắn'
    }

    BoxInput.classList.add('Hidden');
    resultText.innerHTML = 'Đang đăng nhập  <i class="fa-solid fa-circle-notch"></i>';
    setTimeout(() => {
      document.getElementById('Head').innerHTML = `
          <div class="Avatar">
            <img src="${img}" alt="Avatar" >
            <div class="Rank">${titleRank}</div>
          </div>
          <div class="Name">
              <h1>${result.name}</h1>
              <h5>ID: ${result.id} <i onclick="navigator.clipboard.writeText(${result.id});Done('Sao chép thành công','ID của bạn là: ${result.id}')" class="fa-solid fa-copy"></i></h5>
          </div>
      `
      document.getElementById('Rank').innerHTML = `
          <p>Bạn cần ${rank - point + 1} điểm nữa để trở thành ${nextRank} [${point}/${rank + 1}].</p>
            <div class="progress-container">
              <div class="progress-bar" id="myProgressBar" >0</div>
            </div>
          <p class="right red">Tính năng này đang bảo trì</p>
      `

      document.getElementById('Friend').innerHTML = `
        <h1><i class="fa-regular fa-user"></i> Kết nối</h1>
        <div class="Card Flex" id>
            <div class="One">
                <div class="Avatar">
                    <img src="https://graph.facebook.com/61551995024526/picture?width=9999&amp;access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662"
                        alt="Avatar">
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
      `
      document.getElementById('Mess').innerHTML = `
        <p>${Mess}</p>
        <p class="right">Cập nhật: ${UpdateTime}.</p>
      `

      CheckFriend.classList.add('Hidden');
      resultDiv.classList.remove('Hidden');
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      DoneSignIn(`Tài khoản: ${result.name}`)
      setTimeout(() => {
        move(point, rank);
      }, 500);

      // setTimeout(() => {
      //   if (result.pass === '123') {
      //     Warning('Cảnh báo', 'Bạn đang sử dụng mật khẩu mặc định hãy thay đổi mật khẩu mới để bảo mật tài khoản. Hiện tại chưa thể thay đổi bằng cách tự động hãy nhắn tin cho Hùng để đổi mất khẩu mới!')
      //   }
      //   if (result.name === 'Khách') {
      //     Warning('Cảnh báo', 'Bạn đang sử dụng tài khoản khách nên các tính năng sẽ bị giới hạn!');
      //   }
      // }, 2000);

    }, 1500);


  } else {
    if (searchInput !== '' && passwordInput !== '') {
      Fail('Tài khoản không tồn tại', 'Có thể bạn nhập sai tài khoản mật khẩu hoặc chưa đăng ký.');
    } else {
      Fail('Không thể đăng nhập', 'Vui lòng nhập tài khoản & mật khẩu');
    }

  }
}

function saveLoginInfo(username, password) {
  const loginInfo = { username, password };
  localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
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
function Info(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'info'
  )
}


function SendMess() {
  if (SendMess !== '') {
    const redirectUrl = `https://www.messenger.com/t/61551995024526?text=${SendMess}`;
    window.open(redirectUrl, '_blank');
  } else {
    Fail('Ủa alo ?', 'Vui lòng nhập câu hỏi.');
  }

}

function SignUp() {
  Swal.fire({
    title: 'Bạn sẽ gửi 1 tin nhắn đăng ký tới Hùng',
    text: 'Nếu xoá bạn bè tài khoản sẽ bị xoá khỏi danh sách sau 30 ngày.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Gửi ngay',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Đã mở Facebook',
        'Bạn sẽ được chuyển tới Facebook của Hùng.',
        'success',
        window.open('https://www.messenger.com/t/61551995024526?text=DKHunqDSocial', '_blank')
      )
    }
  })
}

function SignOut() {
  Swal.fire({
    title: 'Đăng xuất',
    text: 'Bạn có muốn đăng xuất ngay bây giờ không ?',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Đăng Xuất',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      clearLoginInfo();
      Swal.fire(
        'Đăng xuất thành công',
        'Đã đăng xuất.',
        'success',
      )
      setTimeout(() => {
        location.reload()
      }, 1000);
    }
  })
}
function clearLoginInfo() {
  localStorage.removeItem('loginInfo');
}


function HunqD() {
  const userListElement = document.getElementById("userList");

  jsonData[0].forEach(user => {
    const card = document.createElement("div");
    card.classList.add("CardMember");
    card.style.backgroundImage = `url(https://graph.facebook.com/${user.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662)`;
    card.addEventListener("click", () => {
      const userId = user.id;
      navigator.clipboard.writeText(userId)
        .then(() => {
          alert('Sao chép thành công', `ID ${userId} đã được sao chép vào clipboard.`);
        })
        .catch(err => {
          alert('Lỗi khi sao chép ID:', err);
        });
    });

    const userImage = document.createElement("img");
    userImage.src = `https://graph.facebook.com/${user.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    userImage.alt = user.name + "-Avatar";
    userImage.classList.add("user-image");

    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("Info");
    userInfoDiv.appendChild(userImage);

    Object.keys(user).forEach(key => {
      if (key !== 'point' && key !== 'profileURL' && key !== 'mess' && key !== 'pass' && key !== 'id') {
        const infoItem = document.createElement("div");
        const value = key === 'timestamp' ? new Intl.DateTimeFormat('vi-VN', {
          // weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          // second: 'numeric',
          timeZone: 'asia/ho_chi_minh' // Đặt múi giờ theo mong muốn
        }).format(new Date(user[key] * 1000)) : user[key];
        infoItem.innerHTML = `${value}`;
        userInfoDiv.appendChild(infoItem);
      }
    });

    card.appendChild(userInfoDiv);
    userListElement.appendChild(card);
  });
}

function sortUsers(sortType) {
  const sortedData = [...jsonData[0]];

  switch (sortType) {
    case 'nameAZ':
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nameZA':
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'timestampNew':
      sortedData.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'timestampOld':
      sortedData.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case 'messHigh':
      sortedData.sort((a, b) => b.mess - a.mess);
      break;
    case 'messLow':
      sortedData.sort((a, b) => a.mess - b.mess);
      break;
    case 'pointHigh':
      sortedData.sort((a, b) => b.point - a.point);
      break;
    case 'pointLow':
      sortedData.sort((a, b) => a.point - b.point);
      break;
    default:
      break;
  }

  const userListElement = document.getElementById("userList");
  userListElement.innerHTML = "";

  sortedData.forEach(user => {
    const card = document.createElement("div");
    card.classList.add("CardMember");
    card.style.backgroundImage = `url(https://graph.facebook.com/${user.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662)`;
    card.addEventListener("click", () => {
      const userId = user.id;
      navigator.clipboard.writeText(userId)
        .then(() => {
          alert('Sao chép thành công', `ID ${userId} đã được sao chép vào clipboard.`);
        })
        .catch(err => {
          alert('Lỗi khi sao chép ID:', err);
        });
    });

    const userImage = document.createElement("img");
    userImage.src = `https://graph.facebook.com/${user.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    userImage.alt = user.name + "-Avatar";
    userImage.classList.add("user-image");

    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("Info");
    userInfoDiv.appendChild(userImage);

    Object.keys(user).forEach(key => {
      if (key !== 'point' && key !== 'profileURL' && key !== 'mess' && key !== 'pass') {
        const value = key === 'timestamp' ? new Date(user[key] * 1000).toLocaleString() : user[key];
        const infoItem = document.createElement("div");
        infoItem.innerHTML = value;
        userInfoDiv.appendChild(infoItem);
      }
    });

    card.appendChild(userInfoDiv);
    userListElement.appendChild(card);
  });
}

function Password() {
  (async () => {
    const { value: password } = await Swal.fire({
      title: "Đổi mật khẩu",
      text: "Vì lý do xác minh danh tính, bạn sẽ gửi mật khẩu mới qua Messenger cho tôi bằng cách thủ công.",
      input: "password",
      inputLabel: "Password",
      inputPlaceholder: "Nhập mật khẩu mới",
      confirmButtonText: 'Xác nhận',
      inputAttributes: {
        maxlength: "20",
        autocapitalize: "off",
        autocorrect: "off"
      }
    });
    if (password) {
      window.open(`https://www.messenger.com/t/61551995024526?text=ĐMK:${password}`, '_blank')
    }
  })()
}

var IP = 0;

function IPme() {
  if (IP === 0) {
    IP++;
    (async () => {
      const ipAPI = "//api.ipify.org?format=json";
      const response = await fetch(ipAPI);
      const data = await response.json();
      document.getElementById('ipAddress').innerText = data.ip;
    })()
    Warning('Địa chỉ IPv4', 'Đây là địa chỉ IP của bạn. Nó giống như địa chỉ nhà của bạn vậy nên là hãy bảo mật bằng cách không chia sẻ cho bất cứ ai và sử dụng phần mềm VPN (1.1.1.1, NordVPN, ExpressVPN ) khi truy cập các trang web.')

  } else {
    document.getElementById('ipAddress').innerText = 'Đã ẩn IP - Nhấn để xem';
    IP = 0;
  }

}

function AETH() {
  var AETH = document.getElementById("AETH");
  AETH.classList.remove('Hidden');
}
