const scriptURL = "https://script.google.com/macros/s/AKfycbxiKd7SUO5-IWB0Kr2YTuDFSOyw9DsG_G8dZgY1mGDbPlpkbor3iUP9EOmE7PA1vHO3oQ/exec?token=PRO&sheet=Customer";
let customers = [];

// Hàm tải dữ liệu khách hàng
let isDataLoaded = false; // Biến trạng thái để đảm bảo chỉ chạy một lần
let isFetching = false; // Biến để kiểm soát quá trình fetch đang diễn ra

function loadCustomerData() {

    if (isDataLoaded || isFetching) {
        console.log("Dữ liệu đang được tải hoặc đã tải xong. Không cần tải lại.");
        return;
    }
    showOverlay(); // Hiển thị lớp phủ
    UIManager.Loading();

    isFetching = true; // Đặt trạng thái đang tải dữ liệu

    const localData = localStorage.getItem("customers");
    const localDataArray = JSON.parse(localData || '[]');

    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            if (localDataArray.length === 0) {
                customers = data;
                localStorage.setItem("customers", JSON.stringify(customers));
                UIManager.showToast('Đã đồng bộ khách hàng.');
            } else {
                const isSameData = JSON.stringify(localDataArray) === JSON.stringify(data);

                if (isSameData) {
                    UIManager.showToast('Không có khách hàng mới.');
                    customers = localDataArray;
                } else {
                    customers = data;
                    localStorage.setItem("customers", JSON.stringify(customers));
                    UIManager.showToast('Đã cập nhật danh sách khách hàng.');
                }
            }

            isDataLoaded = true; // Đặt trạng thái đã tải xong
        })
        .catch(error => {
            console.error("Error loading customer data:", error);
            document.getElementById("error-message").textContent = "Không thể tải dữ liệu khách hàng. Bạn có thể nhập thủ công.";
        })
        .finally(() => {
            isFetching = false; // Dọn dẹp trạng thái fetch
            document.getElementById("customer-name").disabled = false;
            hideOverlay(); // Ẩn lớp phủ
        });
}

// Hàm chọn khách hàng
// Thêm sự kiện để gọi loadCustomerData khi nhấn nút "Đồng Bộ Khách Hàng"
const syncButton = document.getElementById("sync-customers");
syncButton.addEventListener('click', loadCustomerData);

// Thêm sự kiện để tạo mảng customers từ localStorage khi người dùng bắt đầu sử dụng tìm kiếm
document.getElementById("customer-name").addEventListener('focus', () => {
    const localData = localStorage.getItem("customers");
    const localDataArray = JSON.parse(localData || '[]');
    customers = localDataArray; // Gán giá trị từ localStorage vào customers
});


const exportedCustomer = []; // Mảng toàn cục để lưu trữ dữ liệu

// Tìm kiếm khách hàng
const input = document.getElementById('customer-name');
const suggestionsBox = document.getElementById('suggestions');

input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    suggestionsBox.innerHTML = '';

    if (query.trim() === '') {
        suggestionsBox.style.display = 'none';
        return;
    }

    const matches = customers.filter(customer =>
        customer.Name.toLowerCase().includes(query) ||
        (0 + customer.Phone && (0 + customer.Phone).toString().includes(query)),
    );


    if (matches.length > 0) {
        matches.forEach(match => {
            const suggestion = document.createElement('div');

            // Thêm class dựa trên giá trị của match.Role
            if (match.Role === 'VIP') {
                suggestion.classList.add('VIP');
            } else if (match.Role === 'Thành viên') {
                suggestion.classList.add('Member');
            }

            if (match.Name == 'Khách lẻ') {
                suggestion.innerHTML = `
                <h1>${match.Name} <span>[${match.Usage}]</span></h1>
            `;
            } else {
                suggestion.innerHTML = `
                <h1>${match.Name} <span>[${match.Role}]</span></h1> 
                <p><i class="fas fa-phone-alt"></i> 0${match.Phone} |<i class="fas fa-money-check-alt"></i> ${match.Total.toLocaleString()}đ | <i class="fas fa-user-clock"></i> ${match.Usage} </p>
            `;
            }

            suggestion.addEventListener('click', () => {
                // Lưu dữ liệu vào mảng
                exportedCustomer.push(input.value = match);
                if (match.Phone && typeof match.Phone === 'string') {
                    input.value = match.Name + " [***" + match.Phone.slice(-2) + ']';
                } else {
                    input.value = match.Name;
                }

                suggestionsBox.style.display = 'none';
            });
            suggestionsBox.appendChild(suggestion);
        });

        suggestionsBox.style.display = 'block';
    } else {
        // Gợi ý thêm khách hàng mới
        suggestionsBox.innerHTML = `
                <div>
                    Không tìm thấy khách hàng, vui lòng thêm mới. <button onclick="showAddCustomerPopup()"><i class="fas fa-user-plus"></i></button>
                </div>
            `;
        // document.getElementById('addNewCustomerBtn').addEventListener('click', showAddCustomerPopup);
        suggestionsBox.style.display = 'block';
    }
});

// Mở popup
function showAddCustomerPopup() {
    const popup = document.getElementById('addCustomerPopup');
    popup.style.display = 'flex';
  }
  
  // Đóng popup
  function closeAddCustomerPopup() {
    const popup = document.getElementById('addCustomerPopup');
    popup.style.display = 'none';
  }
  
  // Bắt sự kiện click ra ngoài để đóng popup
  document.getElementById('addCustomerPopup').addEventListener('click', function() {
    closeAddCustomerPopup();
  });
  
  // Gửi dữ liệu khách hàng
  function submitNewCustomer() {
    const newCustomerName = document.getElementById('newCustomerName').value.trim();
    const capitalizeName = newCustomerName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  
    const newCustomerPhone = document.getElementById('newCustomerPhone').value.trim();
  
    if (!capitalizeName || !newCustomerPhone) {
      alert('Vui lòng điền đầy đủ Tên và Số điện thoại.');
      return;
    }
  
    const newCustomer = {
      Name: capitalizeName,
      Phone: newCustomerPhone,
      Email: document.getElementById('newCustomerEmail').value.trim() || '',
      Birthday: document.getElementById('newCustomerBirthday').value || '',
      Sex: document.getElementById('newCustomerSex').value,
      Social: document.getElementById('newCustomerSocial').value.trim() || '',
      Address: document.getElementById('newCustomerAddress').value.trim() || '',
      Role: document.getElementById('newCustomerRole').value,
      Usage: 0,
      Total: 0,
      sheetName: "Customer"
    };
  
    // Chuyển object thành query string
    function jsonToQueryString(json) {
      return Object.keys(json)
        .filter(key => json[key] !== "" && json[key] !== null && json[key] !== undefined)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
        .join("&");
    }
  
    const newCustomerData = jsonToQueryString(newCustomer);
  
    showOverlay(); // Nếu bạn có overlay loading
  
    fetch(scriptURL, {
      redirect: "follow",
      method: "POST",
      body: newCustomerData,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      }
    })
      .then(response => response.json())
      .then(result => {
        alert('Khách hàng mới đã được thêm thành công!');
        loadCustomerData(); // Tải lại danh sách khách hàng
        closeAddCustomerPopup();
        hideOverlay();
      })
      .catch(error => {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
        hideOverlay();
      });
  }
  

// Đóng hộp gợi ý khi click ra ngoài
document.addEventListener('click', (event) => {
    if (!input.contains(event.target) && !suggestionsBox.contains(event.target)) {
        suggestionsBox.style.display = 'none';
    }
});




function checkPassword() {
    const correctPassword = "123456"; // thay mật khẩu tại đây
    const input = document.getElementById("password").value;
    const hiddenDiv = document.querySelector(".password-protect-section .hidden-link");

    if (input === correctPassword) {
      hiddenDiv.style.display = "block";
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sai mật khẩu',
        text: 'Vui lòng thử lại!'
      });
    }
  }