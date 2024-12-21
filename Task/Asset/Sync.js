const scriptURL = "https://script.google.com/macros/s/AKfycbxiKd7SUO5-IWB0Kr2YTuDFSOyw9DsG_G8dZgY1mGDbPlpkbor3iUP9EOmE7PA1vHO3oQ/exec?token=PRO&sheet=Customer";
let customers = [];

// Hàm tải dữ liệu khách hàng
let isDataLoaded = false; // Biến trạng thái để đảm bảo chỉ chạy một lần
let isFetching = false; // Biến để kiểm soát quá trình fetch đang diễn ra

function loadCustomerData() {
    UIManager.Loading();
    if (isDataLoaded || isFetching) {
        console.log("Dữ liệu đang được tải hoặc đã tải xong. Không cần tải lại.");
        return;
    }

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
        });
}


// Thêm sự kiện để gọi loadCustomerData khi nhấn nút "Đồng Bộ Khách Hàng"
const syncButton = document.getElementById("sync-customers");
syncButton.addEventListener('click', loadCustomerData);

// Thêm sự kiện để tạo mảng customers từ localStorage khi người dùng bắt đầu sử dụng tìm kiếm
document.getElementById("customer-name").addEventListener('focus', () => {
    const localData = localStorage.getItem("customers");
    const localDataArray = JSON.parse(localData || '[]');
    customers = localDataArray; // Gán giá trị từ localStorage vào customers
});

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
            suggestion.innerHTML = `
                <h1>${match.Name}</h1>
                <p> 0${match.Phone} | ${match.Role} |${match.Address} </p>
            `;
            suggestion.addEventListener('click', () => {
                input.value = match.Name + " [***" + match.Phone.slice(-2) + ']';
                suggestionsBox.style.display = 'none';
            });
            suggestionsBox.appendChild(suggestion);
        });
        suggestionsBox.style.display = 'block';
    } else {
        // Gợi ý thêm khách hàng mới
        suggestionsBox.innerHTML = `
            <div>
                Không tìm thấy khách hàng.
                <button id="addNewCustomerBtn">Thêm khách hàng mới</button>
            </div>
        `;
        document.getElementById('addNewCustomerBtn').addEventListener('click', showAddCustomerPopup);
        suggestionsBox.style.display = 'block';
    }
});

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
                <option value="Member">Member</option>
                <option value="VIP">VIP</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Thêm',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            const newCustomerName = document.getElementById('newCustomerName').value;
            const newCustomerPhone = document.getElementById('newCustomerPhone').value;

            const newCustomer = {
                Name: newCustomerName,
                Phone: newCustomerPhone, // Giữ nguyên số điện thoại, bao gồm cả số 0
                Email: document.getElementById('newCustomerEmail').value || '',
                Birthday: document.getElementById('newCustomerBirthday').value || '',
                Sex: document.getElementById('newCustomerSex').value,
                Social: document.getElementById('newCustomerSocial').value || '',
                Address: document.getElementById('newCustomerAddress').value || '',
                Role: document.getElementById('newCustomerRole').value,
                sheetName: "Customer"
            };

            // Kiểm tra xem các trường có trống không
            const isValid = Object.values(newCustomer);
            if (!isValid) { Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin.'); return false; }
            return newCustomer;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            //Mới
            function jsonToQueryString(json) {
                return Object.keys(json)
                    .filter(key => json[key] !== "" && json[key] !== null && json[key] !== undefined) // Lọc các giá trị rỗng, null hoặc undefined
                    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key])) // Mã hóa và ghép cặp key=value
                    .join("&"); // Nối các cặp bằng '&'
            }

            const newCustomer = jsonToQueryString(result.value);

            // Gửi dữ liệu khách hàng mới vào Google Sheets
            fetch(scriptURL, {
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
                    loadCustomerData(); // Tải lại dữ liệu khách hàng
                })
                .catch(error => {
                    Swal.fire('Thành công!', 'Khách hàng mới đã được thêm.', 'success');
                    loadCustomerData(); // Tải lại dữ liệu khách hàng
                });
        }
    });
}

// Đóng hộp gợi ý khi click ra ngoài
document.addEventListener('click', (event) => {
    if (!input.contains(event.target) && !suggestionsBox.contains(event.target)) {
        suggestionsBox.style.display = 'none';
    }
});
