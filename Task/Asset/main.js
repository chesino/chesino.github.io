// Khởi tạo giỏ hàng
let cart = [];
let discount = 0;

// Hàm load dữ liệu dịch vụ từ DB-Service.json
async function loadServices() {
    try {
        const response = await fetch('./Data/DB-Service.json');
        const services = await response.json();
        renderServices(services);
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Hàm hiển thị danh sách dịch vụ
function renderServices(services) {
    const serviceList = document.getElementById('serviceList');
    let html = '<h4>Danh sách dịch vụ</h4><div class="row">';

    services.forEach(service => {
        html += `
            <div class="col-md-3 mb-2">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${service.service}</h5>
                        <p class="card-text">${formatCurrency(service.price)}</p>
                        <button type="button" class="btn btn-primary btn-sm"
                                onclick="addToCart('${service.id}', '${service.service}', ${service.price})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    serviceList.innerHTML = html;
}

// Hàm thêm vào giỏ hàng
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    Done(`+1 ${name}`)
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartList = document.getElementById('cartItemsList');
    if (!cartList) {
        console.error('Không tìm thấy element có id cartItemsList');
        return;
    }
    let html = '';
    cart.forEach((item, index) => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}"
                           onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>
                    <input type="number" min="0" value="${item.price}"
                           onchange="updatePrice(${index}, this.value)">
                </td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Xóa</button>
                </td>
            </tr>
        `;
    });
    cartList.innerHTML = html;
}
// Hàm cập nhật số lượng
function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    updateCartDisplay();
    calculateTotal(); // Update total after quantity change
}

// Hàm cập nhật đơn giá
function updatePrice(index, price) {
    cart[index].price = parseFloat(price);
    updateCartDisplay();
    calculateTotal(); // Update total after price change
}

// Hàm xóa sản phẩm
function removeItem(index) {
    cart.splice(index, 1);
    Fail(`Đã xoá`)
    updateCartDisplay();
    calculateTotal(); // Update total after removing item
}

// Hàm áp dụng mã giảm giá
function applyDiscount() {
    const discountCode = document.getElementById('discountCode').value;
    // Thêm logic kiểm tra mã giảm giá ở đây
    // Ví dụ đơn giản:
    if (discountCode === 'DISCOUNT10') {
        discount = 0.1; // Giảm 10%
    } else {
        discount = 0;
        Fail('Mã giảm giá không hợp lệ!');
    }
    calculateTotal();
}

// Hàm tính tổng tiền
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const final = subtotal - discountAmount;

    document.getElementById('totalAmount').textContent = formatCurrency(subtotal);
    document.getElementById('discountAmount').textContent = formatCurrency(discountAmount);
    document.getElementById('finalAmount').textContent = formatCurrency(final);
}

// Hàm xem trước hóa đơn
function previewInvoice() {
    const customerName = document.getElementById('customerName').value;
    const employeeName = document.getElementById('employeeName').value;
    const invoiceOutput = document.getElementById('invoiceOutput');

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

    let html = `
        <div>
           <img class="Logo-invoice" src="./Asset/Logo.png" alt="Logo" > 
           <h4 class="text-center" style="font-weight: bold;">HÓA ĐƠN DỊCH VỤ</h4> <hr>
            <p>Khách hàng: ${customerName}</p>
            <p>Nhân viên: ${employeeName}</p>
            <p>Ngày: ${formattedDate}</p> 
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th>STT</th>
                    <th>Dịch vụ</th>
                    <th>SL</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                </tr>
    `;

    cart.forEach((item, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
            </tr>
        `;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const final = subtotal - discountAmount;

    html += `
            
            <tr class="end">
                <td colspan="4" style="text-align: right;">Tổng tiền:</td>
                <td>${formatCurrency(subtotal)}</td>
            </tr>
    `;

    // Conditionally add the discount row
    if (discountAmount > 0) {
        html += `
            <tr>
                <td colspan="4" style="text-align: right;">Giảm giá:</td>
                <td>${formatCurrency(discountAmount)}</td>
            </tr>
        `;
    }

    html += `
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Thành tiền:</strong></td>
                <td><strong>${formatCurrency(final)}</strong></td>
            </tr>
        </table>
        <hr>
        <p class="text-center" style="font-style: italic;">Cảm ơn quý khách!</p>
        </div>
    `;

    invoiceOutput.innerHTML = html;
    document.getElementById('generateInvoiceBtn').classList.remove('d-none');
    Done('Tạo đơn thành công');
}

// Hàm format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', loadServices);

// Xử lý form submit
document.getElementById('invoiceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    previewInvoice();
});



function Done(T1) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
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

function Fail(T1) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "error",
        title: T1
    });
}