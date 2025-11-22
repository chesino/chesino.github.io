let customers = [];

// Hàm tải dữ liệu khách hàng
let isDataLoaded = false; // Biến trạng thái để đảm bảo chỉ chạy một lần
let isFetching = false; // Biến để kiểm soát quá trình fetch đang diễn ra

async function loadCustomerData() {
    if (isDataLoaded || isFetching) {
        console.log("Dữ liệu đang tải hoặc đã xong.");
        return;
    }

    showOverlay();
    UIManager.Loading();
    isFetching = true;

    const localData = localStorage.getItem("customers");
    const localDataArray = JSON.parse(localData || '[]');

    try {
        // --- LOGIC FIREBASE MỚI ---
        // Lấy dữ liệu từ collection "customers" trên Firestore
        const querySnapshot = await window.getDocs(window.collection(window.db, "customers"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        // --------------------------

        if (localDataArray.length === 0) {
            customers = data;
            localStorage.setItem("customers", JSON.stringify(customers));
            UIManager.showToast('Đã đồng bộ khách hàng.');
        } else {
            // So sánh đơn giản độ dài hoặc nội dung (có thể tối ưu sau)
            if (JSON.stringify(localDataArray) === JSON.stringify(data)) {
                UIManager.showToast('Không có khách hàng mới.');
                customers = localDataArray;
            } else {
                customers = data;
                localStorage.setItem("customers", JSON.stringify(customers));
                UIManager.showToast('Đã cập nhật danh sách khách hàng.');
            }
        }
        isDataLoaded = true;

    } catch (error) {
        console.error("Lỗi tải khách hàng từ Firebase:", error);
        document.getElementById("error-message").textContent = "Lỗi kết nối Firebase.";
    } finally {
        isFetching = false;
        document.getElementById("customer-name").disabled = false;
        hideOverlay();
    }
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
// Hiển thị SweetAlert2 để thêm khách hàng mới
function showAddCustomerPopup() {
    Swal.fire({
        title: 'Thêm khách hàng mới',
        html: `
            <input type="text" id="newCustomerName" class="swal2-input" placeholder="Tên khách hàng">
            <input type="text" id="newCustomerPhone" class="swal2-input" placeholder="Số điện thoại">
            <input type="email" id="newCustomerEmail" class="swal2-input" placeholder="Email">
            <input type="date" id="newCustomerBirthday" class="swal2-input" placeholder="Ngày sinh">
            <select class="swal2-select" name="newCustomerSex" id="newCustomerSex">
                <option value="Nữ">Nữ</option>
                <option value="Nam">Nam</option>
            </select>
            <input type="text" id="newCustomerSocial" class="swal2-input" placeholder="Mạng xã hội">
            <input type="text" id="newCustomerAddress" class="swal2-input" placeholder="Địa chỉ">
            <select class="swal2-select" name="newCustomerRole" id="newCustomerRole">
                <option value="Thành viên">Thành viên</option>
                <option value="VIP">VIP</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Thêm',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            showOverlay();
            const newCustomerName = document.getElementById('newCustomerName').value;
            const capitalizeName = newCustomerName
                .split(' ') // Tách tên thành các từ
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Viết hoa chữ cái đầu tiên, còn lại là chữ thường
                .join(' '); // Kết hợp lại các từ thành một chuỗi
                
            const newCustomerPhone = document.getElementById('newCustomerPhone').value;

            const newCustomer = {
                Name: capitalizeName,
                Phone: newCustomerPhone, // Giữ nguyên số điện thoại, bao gồm cả số 0
                Email: document.getElementById('newCustomerEmail').value || '',
                Birthday: document.getElementById('newCustomerBirthday').value || '',
                Sex: document.getElementById('newCustomerSex').value,
                Social: document.getElementById('newCustomerSocial').value || '',
                Address: document.getElementById('newCustomerAddress').value || '',
                Role: document.getElementById('newCustomerRole').value,
                Usage: 0,
                Total: 0,
                sheetName: "Customer"
            };

            // Kiểm tra xem các trường có trống không
            const isValid = Object.values(newCustomer);
            if (!isValid) { Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin.'); return false; }
            return newCustomer;
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            function jsonToQueryString(json) {
                return Object.keys(json)
                    .filter(key => json[key] !== "" && json[key] !== null && json[key] !== undefined)
                    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
                    .join("&");
            }
    
            const newCustomer = jsonToQueryString(result.value);
    
            
            
            const url = await getScriptURL('Customer');
            if (!url) {
                hideOverlay();
                return;
            }

            fetch(url, {
                redirect: "follow",
                method: "POST",
                body: newCustomer,
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                }
            })
            .then(response => response.json())
            .then(result => {
                Swal.fire('Thành công!', 'Khách hàng mới đã được thêm.', 'success');
                loadCustomerData();
                hideOverlay();
            })
            .catch(error => {
                Swal.fire('Lỗi!', 'Không thể thêm khách hàng mới.', 'error');
                console.error("Lỗi khi gửi dữ liệu:", error);
                hideOverlay();
            });
        }
    });
    
}

// Gửi dữ liệu khách hàng
async function submitNewCustomer() {
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
    const token = localStorage.getItem("ActivateKey");
    if (!token) {
        await Swal.fire({
            icon: 'warning',
            title: 'Chưa kích hoạt',
            text: 'Nhập mã kích hoạt ở phần cài đặt để sử dụng dịch vụ.',
            confirmButtonText: 'OK'
        });
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
        Token: token,
        sheetName: "Customer"
    };

    function jsonToQueryString(json) {
        return Object.keys(json)
            .filter(key => json[key] !== "" && json[key] !== null && json[key] !== undefined)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
            .join("&");
    }

    const newCustomerData = jsonToQueryString(newCustomer);
    const url = await getScriptURL("Customer");
    if (!url) return; // Dừng nếu token không hợp lệ

    showOverlay();

    try {
        const response = await fetch(url, {
            redirect: "follow",
            method: "POST",
            body: newCustomerData,
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
        });

        await response.json();

        alert('Khách hàng mới đã được thêm thành công!');
        loadCustomerData();
        closeAddCustomerPopup();
    } catch (error) {
        console.error("Lỗi khi thêm khách hàng mới:", error);
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        hideOverlay();
    }
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