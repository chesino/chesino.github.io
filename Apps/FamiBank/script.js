const API_URL = "https://script.google.com/macros/s/AKfycbwbyOScSqh-S9uw18oRk-dmo6NS5yUUuzcaAM_r6qdupeec3H7f5jaCQCILyscXOoSmiw/exec";

document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra nếu người dùng đã đăng nhập
  const savedUser = localStorage.getItem('userData');
  
  if (savedUser) {
    // Hiển thị thông tin người dùng nếu đã đăng nhập
    showUserInfo(JSON.parse(savedUser));
  } else {
    // Hiển thị trang đăng nhập nếu chưa đăng nhập
    showPage('login-page');
  }
  
  // Xử lý sự kiện đăng nhập
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('user-id').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember').checked;
    await login(id, password, remember);
  });
  
  // Xử lý sự kiện đăng xuất
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('userData');
    showPage('login-page');
    Swal.fire({
      title: "Đã đăng xuất!",
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    });
  });
  
  // Xử lý thanh điều hướng
  document.querySelectorAll('.nav-item').forEach(navItem => {
    navItem.addEventListener('click', function() {
      // Chỉ xử lý nếu người dùng đã đăng nhập
      if (localStorage.getItem('userData')) {
        const pageId = this.getAttribute('data-page');
        
        // Cập nhật trạng thái active cho thanh điều hướng
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
        });
        this.classList.add('active');
        
        // Hiển thị trang tương ứng
        showPage(pageId);
      }
    });
  });
});

// Hàm đăng nhập
async function login(id, password, remember) {
  try {
    // Hiển thị loader hoặc thông báo đang xử lý
    Swal.fire({
      title: "Đang đăng nhập...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    let url = `${API_URL}?sheet=Users`;
    
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Lỗi khi gọi API");
    
    
    const result = await response.json();
    
    const users = result || [];
    
    // Tìm người dùng với ID và mật khẩu tương ứng
    const user = users.find(u => String(u.ID) === String(id) && String(u.Password) === String(password));
    
    if (user) {
      // Lưu thông tin người dùng nếu chọn "nhớ mật khẩu"
      if (remember) localStorage.setItem('userData', JSON.stringify(user));
      
      showUserInfo(user);
      
      Swal.fire({
        title: "Đăng nhập thành công!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        title: "Đăng nhập thất bại!",
        text: "Sai ID hoặc mật khẩu",
        icon: "error"
      });
    }
  } catch (error) {
    console.error("Lỗi:", error);
    Swal.fire({
              title: "Đăng nhập thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
    });
  }
}

// Hàm hiển thị thông tin người dùng sau khi đăng nhập
function showUserInfo(user) {
  
  // Cập nhật nội dung hiển thị
  document.getElementById('display-name').innerText = user.FullName || "-";
  document.getElementById('display-id').innerText = user.ID || "-";
  document.getElementById('display-balance').innerText = formatCurrency(user.Amount) || "0 đ";
  
  const userAvatar = document.getElementById('user-avatar');
  if (user.Avatar) {
    userAvatar.src = `https://graph.facebook.com/${user.Avatar}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    
  } else {
    // Avatar mặc định nếu người dùng không có avatar
    userAvatar.src = "https://via.placeholder.com/80";
  }
  
  // Cập nhật lời chào
  const greeting = document.getElementById('greeting');
  const hour = new Date().getHours();
  let greetingText = "Chào buổi ";
  
  if (hour >= 5 && hour < 12) {
    greetingText += "sáng";
  } else if (hour >= 12 && hour < 18) {
    greetingText += "chiều";
  } else {
    greetingText += "tối";
  }
  
  greeting.innerText = `${greetingText}, ${user.FullName.split(' ').pop()}!`;
  
  // Hiển thị trang thông tin người dùng
  showPage('user-info-page');
  document.querySelector('.nav-item[data-page="user-info-page"]').classList.add('active');
  
  // Tải lịch sử giao dịch (demo purposes)
  loadTransactionHistory(user.ID);
}



// Auto reload functionality
let autoReloadInterval;
let isAutoReloadActive = false;

function toggleAutoReload() {
  if (isAutoReloadActive) {
    // Stop auto reload
    clearInterval(autoReloadInterval);
    document.getElementById('auto-reload-toggle').innerHTML = '<i class="fas fa-clock"></i> Tự động tải';
    isAutoReloadActive = false;
  } else {
    // Start auto reload
    reloadData(); // Load immediately
    autoReloadInterval = setInterval(reloadData, 10000); // Then every 10 seconds
    document.getElementById('auto-reload-toggle').innerHTML = '<i class="fas fa-stop-circle"></i> Dừng tự động';
    isAutoReloadActive = true;
  }
}


// Hàm tải dữ liệu thủ công
async function reloadData() {
  try {
    // Lấy thông tin người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
      Swal.fire({
        title: "Lỗi",
        text: "Không tìm thấy thông tin người dùng.",
        icon: "error"
      });
      return;
    }
    
    const url = `${API_URL}?sheet=Users`; // Đường dẫn API
    const response = await fetch(url); // Gọi API
    
    if (!response.ok) {
      throw new Error("Lỗi khi gọi API");
    }
    
    const result = await response.json(); // Phân tích cú pháp JSON
    
    // Đợi 1 giây trước khi tiếp tục
    await new Promise(resolve => setTimeout(resolve, 200));
    
    fetchAndDisplayData();
    // Kiểm tra xem kết quả có phải là mảng không
    if (!Array.isArray(result) || result.length === 0) {
      Swal.fire({
        title: "Lỗi",
        text: "Dữ liệu người dùng không hợp lệ hoặc trống.",
        icon: "error"
      });
      return;
    }
    
    const users = result; // Kết quả là mảng đã qua kiểm tra
    
    // Tìm kiếm người dùng trong danh sách
    const user = users.find(u => String(u.ID) === String(userData.ID));
    
    if (user) {
      userData.Amount = user.Amount; // Cập nhật Amount
      localStorage.setItem('userData', JSON.stringify(userData)); // Lưu lại vào localStorage
      showUserInfo(user); // Hiển thị thông tin người dùng
    } else {
      Swal.fire({
        title: "Lỗi",
        text: "Không tìm thấy người dùng trong dữ liệu.",
        icon: "error"
      });
    }
  } catch (error) {}
}

document.getElementById('reload-data').addEventListener('click', reloadData);
document.getElementById('auto-reload-toggle').addEventListener('click', toggleAutoReload);



// Hàm lấy dữ liệu và cập nhật giao diện
function fetchAndDisplayData() {
  fetch('https://script.google.com/macros/s/AKfycbwbyOScSqh-S9uw18oRk-dmo6NS5yUUuzcaAM_r6qdupeec3H7f5jaCQCILyscXOoSmiw/exec?sheet=History')
    .then(response => response.json())
    .then(data => {
      const transactionsContainer = document.getElementById('transactions-container');
      transactionsContainer.innerHTML = ''; // Xóa dữ liệu cũ trước khi hiển thị dữ liệu mới
      
      data.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.classList.add('transaction');
        
        // Xác định loại giao dịch (positive hoặc negative)
        const isCredit = transaction.Amount > 0;
        const amountClass = isCredit ? 'positive' : 'negative';
        const amountFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.Amount);
        const iconClass = isCredit ? 'fa-arrow-up' : 'fa-arrow-down';
        const iconBackground = isCredit ? '#2ecc71' : '#e74c3c';
        
        // Tạo giao diện giao dịch
        transactionElement.innerHTML = `
  <div class="transaction-item">
    <div class="transaction-icon">
      <i class="fas ${iconClass}"></i>  <!-- This assumes 'iconClass' reflects the type of transaction -->
    </div>
    <div class="transaction-details">
      <div class="transaction-title">
${transaction.Type}</div>
      <div class="transaction-date">${new Date(transaction.Time).toLocaleString('vi-VN', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</div>
    </div>
    <div class="transaction-amount
${amountClass}">${isCredit ? '+' : ''}${amountFormatted}</div>
  </div>
`;
        
        // Thêm giao dịch vào container
        transactionsContainer.appendChild(transactionElement);
      });
    })
    .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
}

// Gọi hàm fetchAndDisplayData ngay khi tải trang
fetchAndDisplayData();

// Hàm hiển thị trang
function showPage(pageId) {
  // Ẩn tất cả các trang
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Hiển thị trang được chọn
  document.getElementById(pageId).classList.add('active');
  
  // Hiển thị hoặc ẩn thanh điều hướng
  const bottomNavbar = document.querySelector('.bottom-navbar');
  if (pageId === 'login-page') {
    bottomNavbar.style.display = 'none';
  } else {
    bottomNavbar.style.display = 'flex';
  }
}

// Hàm tải lịch sử giao dịch (demo)
function loadTransactionHistory(userId) {
  // Trong thực tế, bạn sẽ gọi API để lấy lịch sử giao dịch
  // Đây chỉ là dữ liệu mẫu cho demo
  
  // Hiển thị container lịch sử
  document.querySelector('.history-container').style.display = 'block';
  
  // Hiển thị container cài đặt
  document.querySelectorAll('.settings-container').forEach(container => {
    container.style.display = 'block';
  });
  
  // Demo: hiển thị hoặc ẩn trạng thái trống
  const hasTransactions = true; // Thay đổi để kiểm tra trường hợp không có giao dịch
  
  if (hasTransactions) {
    document.getElementById('empty-transactions').style.display = 'none';
  } else {
    document.getElementById('empty-transactions').style.display = 'block';
    // Ẩn các giao dịch mẫu
    document.querySelectorAll('.transaction').forEach(item => {
      item.style.display = 'none';
    });
  }
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  if (amount == null || amount == undefined) return "0 đ";
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount) + ' đ';
}


// Thêm trước hàm đăng nhập
// Cài đặt ban đầu
document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra và áp dụng theme đã lưu
  applyThemeSettings();
  
  // Các phần xử lý khác...
  
  // Xử lý chế độ tối
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('darkMode', 'false');
    }
  });
  
  // Xử lý màu chủ đạo
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
      const color = option.getAttribute('data-color');
      setThemeColor(color);
      
      // Cập nhật trạng thái active
      document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('active');
      });
      option.classList.add('active');
    });
  });
});

// Thêm hàm áp dụng theme
function applyThemeSettings() {
  // Áp dụng chế độ tối
  const darkMode = localStorage.getItem('darkMode');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  if (darkMode === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (darkModeToggle) darkModeToggle.checked = true;
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (darkModeToggle) darkModeToggle.checked = false;
  }
  
  // Áp dụng màu chủ đạo
  const themeColor = localStorage.getItem('themeColor') || '#4361ee';
  setThemeColor(themeColor);
  
  // Đánh dấu màu đã chọn
  const activeColorOption = document.querySelector(`.color-option[data-color="${themeColor}"]`);
  if (activeColorOption) {
    activeColorOption.classList.add('active');
  }
}

// Thêm hàm set màu chủ đạo
function setThemeColor(color) {
  document.documentElement.style.setProperty('--primary-color', color);
  
  // Tính toán màu thứ cấp (đậm hơn)
  const secondaryColor = adjustColor(color, -20);
  document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  
  // Tính toán màu accent (nhạt hơn)
  const accentColor = adjustColor(color, 20);
  document.documentElement.style.setProperty('--accent-color', accentColor);
  
  // Lưu màu đã chọn
  localStorage.setItem('themeColor', color);
}

// Hàm điều chỉnh màu sắc
function adjustColor(hex, percent) {
  // Chuyển hex sang RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  
  // Điều chỉnh giá trị
  r = Math.max(0, Math.min(255, r + percent));
  g = Math.max(0, Math.min(255, g + percent));
  b = Math.max(0, Math.min(255, b + percent));
  
  // Chuyển lại về hex
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}