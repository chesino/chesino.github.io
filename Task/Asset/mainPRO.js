// Constants & Global Variables
const STORAGE_KEY = 'pos_cart';
let products = [];
let cart = [];

// DOM Elements
const domElements = {
    productsContainer: document.getElementById('products'),
    cartContainer: document.getElementById('cart-items'),
    cartToggle: document.querySelector('.cart-toggle'),
    cartElement: document.querySelector('.cart'),
    cartClose: document.querySelector('.cart-close'),
    cartOverlay: document.querySelector('.cart-overlay'),
    cartCount: document.querySelector('.cart-count'),
    discountPercent: document.getElementById('discount'),
    discountAmount: document.getElementById('discountAmount'),
    totalElement: document.getElementById('total'),
    printPreview: document.getElementById('print-preview'),
    totalItems: document.getElementById('total-items'),
    subtotalElement: document.getElementById('subtotal'),
    discountInfo: document.getElementById('discount-info'),
    previewModal: document.getElementById('preview-modal'),
    closeModal: document.querySelector('.close-modal'),
    customerName: document.getElementById('customer-name'),
    staffName: document.getElementById('staff-name'),
    billTime: document.getElementById('bill-time'),
};

// Cart Management
class CartManager {
    static addItem(product) {
        const existingItem = cart.find(item => item.product === product.product);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateDisplay();
        UIManager.showToast('Đã thêm vào giỏ hàng');
    }

    static updateItem(index, field, value) {
        if (cart[index]) {
            cart[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
            this.saveCart();
            this.updateDisplay();
        }
    }

    static removeItem(index) {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc muốn xóa sản phẩm này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                cart.splice(index, 1);
                this.saveCart();
                this.updateDisplay();
                UIManager.showToast('Đã xóa sản phẩm');
            }
        });
    }

    static clearCart() {
        Swal.fire({
            title: 'Xóa giỏ hàng?',
            text: "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa tất cả',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                cart = [];
                this.saveCart();
                this.updateDisplay();
                UIManager.showToast('Đã xóa toàn bộ giỏ hàng');
            }
        });
    }

    static saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    static loadCart() {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        cart = savedCart ? JSON.parse(savedCart) : [];
        this.updateDisplay();
    }

    static updateDisplay() {
        this.renderCartItems();
        this.updateCartCount();
        this.calculateTotal();
    }

    static renderCartItems() {
        if (domElements.cartContainer) {
            domElements.cartContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <input type="text" value="${item.product}" 
                        onchange="CartManager.updateItem(${index}, 'product', this.value)">
                    <input type="number" value="${item.quantity}" min="1" 
                        onchange="CartManager.updateItem(${index}, 'quantity', this.value)">
                    <input type="number" value="${item.price}" 
                        onchange="CartManager.updateItem(${index}, 'price', this.value)">
                    <div class="end">
                        <span class="price">${(item.quantity * item.price).toLocaleString()}đ</span>
                        <i class="fas fa-trash" onclick="CartManager.removeItem(${index})"></i>
                    </div>
                </div>
            `).join('');
        }
    }

    static updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (domElements.cartCount) {
            domElements.cartCount.textContent = totalItems;
        }
        if (domElements.totalItems) {
            domElements.totalItems.textContent = totalItems;
        }
    }

    static calculateTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = Number(domElements.discountPercent?.value) || 0;
        const discountAmount = Number(domElements.discountAmount?.value) || 0;
        const percentDiscount = subtotal * (discountPercent / 100);
        const totalDiscount = percentDiscount + discountAmount;
        const final = subtotal - totalDiscount;

        // Update subtotal
        if (domElements.subtotalElement) {
            domElements.subtotalElement.textContent = `${subtotal.toLocaleString()}đ`;
        }

        // Update discount info
        if (domElements.discountInfo) {
            let discountHTML = '';
            if (discountPercent > 0) {
                discountHTML += `<p>Chiết khấu ${discountPercent}%: -${percentDiscount.toLocaleString()}đ</p>`;
            }
            if (discountAmount > 0) {
                discountHTML += `<p>Giảm giá trực tiếp: -${discountAmount.toLocaleString()}đ</p>`;
            }
            if (totalDiscount > 0) {
                discountHTML += `<p class="discount-total">Tổng chiết khấu: -${totalDiscount.toLocaleString()}đ</p>`;
            }
            domElements.discountInfo.innerHTML = discountHTML;
        }

        // Update final total
        if (domElements.totalElement) {
            domElements.totalElement.textContent = `${final.toLocaleString()}đ`;
        }
    }

    static getFinalTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = Number(domElements.discountPercent?.value) || 0;
        const discountAmount = Number(domElements.discountAmount?.value) || 0;
        const percentDiscount = subtotal * (discountPercent / 100);
        const totalDiscount = percentDiscount + discountAmount;
        return subtotal - totalDiscount;
    }
}

// UI Management
class UIManager {
    static async initialize() {
        await this.loadProducts();
        this.setupEventListeners();
        CartManager.loadCart();
        this.initializeTheme();
    }

    static async loadProducts() {
        try {
            const localData = localStorage.getItem('products');
            if (localData) {
                products = JSON.parse(localData);
                this.renderProducts();
            } else {
                console.warn('No local data found. Please sync with the server.');
                UIManager.syncProducts();
                // this.showError('Không tìm thấy dữ liệu, vui lòng đồng bộ dữ liệu.');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Không thể tải dữ liệu sản phẩm');
        }
    }

    static async syncProducts() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbxiKd7SUO5-IWB0Kr2YTuDFSOyw9DsG_G8dZgY1mGDbPlpkbor3iUP9EOmE7PA1vHO3oQ/exec?token=PRO&sheet=Product');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newData = await response.json();
            const localData = JSON.parse(localStorage.getItem('products')) || [];

            if (JSON.stringify(localData) !== JSON.stringify(newData)) {
                localStorage.setItem('products', JSON.stringify(newData));
                console.log('Data synced and updated in localStorage.');
                this.showToast('Dữ liệu đã được đồng bộ và cập nhật, Vui lòng chờ 3 giây.');
                setTimeout(() => {
                    location.reload();
                }, 3000);
            } else {
                console.log('Local data is up to date. No changes made.');
                this.showToast('Dữ liệu đã được đồng bộ, không có thay đổi.');
            }
        } catch (error) {
            console.error('Error syncing products:', error);
            this.showError('Không thể đồng bộ dữ liệu sản phẩm');
        }
    }

    static renderProducts() {
        if (domElements.productsContainer) {
            domElements.productsContainer.innerHTML = products.map(product => `
                <div class="service-card" onclick="CartManager.addItem(${JSON.stringify(product).replace(/"/g, "'")})">
                    <h3>${product.product}</h3>
                    <p class="price">${product.price.toLocaleString()}đ</p>
                </div>
            `).join('');
        }
    }

    static setupEventListeners() {
        // Mobile cart toggle
        domElements.cartToggle?.addEventListener('click', () => {
            if (domElements.cartElement?.classList.contains('active')) {
                this.closeCart();
            } else {
                this.openCart();
            }
        });

        domElements.cartClose?.addEventListener('click', () => this.closeCart());
        domElements.cartOverlay?.addEventListener('click', () => this.closeCart());

        document.getElementById("sync-customers").addEventListener('click', () => {
            loadCustomerData(); // Gọi loadCustomerData khi nhấn nút
        });
        // Discount inputs
        domElements.discountPercent?.addEventListener('input', () => CartManager.calculateTotal());
        domElements.discountAmount?.addEventListener('input', () => CartManager.calculateTotal());
    }

    static openCart() {
        domElements.cartElement?.classList.add('active');
        domElements.cartOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    static closeCart() {
        domElements.cartElement?.classList.remove('active');
        domElements.cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    static showToast(message) {
        Swal.fire({
            icon: 'success',
            title: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    }

    static showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: message
        });
    }

    static initializeTheme() {
        const themeBtns = document.querySelectorAll('.theme-btn');

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'basic';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Set active button
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                themeBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Set new theme
                const newTheme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', newTheme);

                // Save theme preference
                localStorage.setItem('theme', newTheme);
            });
        });
    }
}

// Bill Management
class BillManager {
    static showPreview() {
        // Kiểm tra giỏ hàng
        if (cart.length === 0) {
            UIManager.showError('Giỏ hàng trống');
            return;
        }

        // Lấy các elements
        const modal = document.getElementById('preview-modal');
        const overlay = document.querySelector('.cart-overlay');
        const billTimeInput = document.getElementById('bill-time');
        const previewContent = document.getElementById('print-preview');
        const closeBtn = document.querySelector('.close-modal');

        // Kiểm tra elements tồn tại
        if (!modal || !billTimeInput || !previewContent || !overlay) {
            console.error('Không tìm thấy các elements cần thiết');
            return;
        }

        // Set thời gian hiện tại
        const currentTime = new Date();
        billTimeInput.value = this.formatDateTime(currentTime);

        // Hiển thị modal và overlay
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Tắt cuộn trang

        // Gắn HTML cho nội dung hóa đơn
        previewContent.innerHTML = this.generateBillHTML();

        // Sự kiện đóng modal
        const closeModal = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Bật lại cuộn trang
        };

        // Nút đóng
        closeBtn?.addEventListener('click', closeModal);

        // Đóng modal khi click bên ngoài
        overlay?.addEventListener('click', closeModal);
    }

    static formatDateTime(date) {
        const pad = (num) => String(num).padStart(2, '0');
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }

    static printBill() {
        const printWindow = window.open('', '', 'width=500,height=1000,scrollbars=yes');

        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>In hóa đơn</title>
                        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                        <style>
                            /* Your existing CSS styles here */
                        </style>
                    </head>
                    <body>
                        ${this.generateBillHTML()}
                        <script>
                            window.onload = function() {
                                setTimeout(function() {
                                
                                    window.print();
                                    window.close(); // Optionally close the print window afterward
                                    alert("Nhớ lưu hoá đơn");
                                }, 500); // Adjust timeout as necessary
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close(); // Close the document stream after writing
        }
    }


    static generateBillHTML() {
        const customerName = document.getElementById('customer-name')?.value || '';
        const staffName = document.getElementById('staff-name')?.value || '';
        const paymentMethod = document.getElementById('payment-method')?.value || '';
        const billTime = document.getElementById('bill-time')?.value || this.formatDateTime(new Date());

        const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = Number(domElements.discountPercent?.value) || 0;
        const discountAmount = Number(domElements.discountAmount?.value) || 0;
        const percentDiscount = subtotal * (discountPercent / 100);
        const totalDiscount = percentDiscount + discountAmount;
        const total = subtotal - totalDiscount;

        // Tạo chuỗi mô tả cho các sản phẩm
        const itemsString = cart.map(item => `${item.product} (${item.quantity})`).join(', ');

        return `
            <html>
                <head>
                    <title>In hóa đơn</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                    <style>
                        body {
                            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                            padding: 0 10px;
                            width: 80mm;
                            margin: 0 auto;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 10px 0;
                        }

                        th,
                        td {
                            padding: 8px 2px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }

                        .preview-header {
                            text-align: center;
                            margin-bottom: 10px;
                        }

                        .preview-header h2,
                        .preview-header h3,
                        .preview-header p {
                            margin: 0px;
                        }

                        .bill-info p {
                            font-size: 14px;
                            margin: 5px 0;
                        }

                        .bill-summary {
                            margin-top: 15px;
                            text-align: right;
                        }

                        .total {
                            font-weight: bold;
                            font-size: 1.2em;
                            margin-top: 10px;
                        }

                        .bill-footer {
                            text-align: center;
                            margin-top: 20px;
                        }

                        .bill-footer p {
                            margin: 10px;
                        }

                        .preview-table th {
                            font-size: 13px;
                            border: 2px solid black;
                        }

                        .preview-table td {
                            font-size: 14px;
                        }

                        .preview-table td:last-child {
                            text-align: right;
                            font-weight: bold;
                        }

                        .info-Salon {
                            margin-top: 5px;
                            padding: 0 10px;
                        }

                        .info-Salon .flex {
                            display: flex;
                            justify-content: space-between;
                            font-weight: 500;
                        }

                        .info-Salon i {
                            font-size: 16px;
                        }

                        .info-Salon .location {
                            font-size: 14px;
                            text-align: left;
                            margin-bottom: 3px;
                        }

                        .Hunq {
                            font-size: 12px;
                            font-weight: bold;
                        }

                        .QR-Banking img {
                            display: block;
                            height: 100px;
                            width: 100px;
                            margin: auto;
                        }

                        .QR-Banking {
                            text-align: center;
                            width: 100%;
                            margin: auto;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 5px;
                            border: 2px solid black;
                            padding: 2px;
                        }

                        .QR-Banking p {
                            font-size: 12px;
                            font-weight: bold;
                        }

                        .QR-Banking h1 {
                            text-transform: capitalize;
                            font-size: 14px;
                            margin: 0;
                        }

                        .Banking {
                            text-align: left;
                            border-left: 2px solid black;
                            padding-left: 10px;
                        }
                        .Banking  p {
                            margin: 0;
                        }
                        .Banking .alert {
                            font-size: 12px;
                            font-weight: normal;
                        }
                        .Banking h1 {
                            font-size: 30px;
                        }
                    </style>
                </head>

                <body>
                    <div class="preview-header">
                        <img src="./Asset/Logo.png" alt="Logo" style="width: 120px">
                        <h2>Mai Tây Hair Salon</h2>
                        <div class="info-Salon">
                            <p class="location"><i class="fa-solid fa-location-dot"></i> 4A Hiền Hoà, Phước Thái, Long Thành, ĐN</p>
                            <div class="flex">
                                <p><i class="fa-brands fa-facebook"></i> MaiTayHairSalon</p>
                                <p><i class="fa-solid fa-phone"></i> 0938123962</p>
                            </div>
                        </div>
                        <hr>
                        <h3>HOÁ ĐƠN THANH TOÁN</h3>
                    </div>
                     <div class="bill-info">
                        <p>Thời gian: ${billTime}</p>
                        <p>Khách hàng: ${customerName}</p>
                        <p>Thu ngân: ${staffName}</p>
                        <p>Thanh toán: ${paymentMethod}</p>
                    </div>
                   <table class="preview-table">
                        <tr>
                            <th>#</th>
                            <th>Dịch vụ</th>
                            <th>SL</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                        ${cart.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.product}</td>
                                <td>${item.quantity}</td>
                                <td>${(item.price).toLocaleString()}</td>
                                <td>${(item.quantity * (item.price)).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <div class="bill-summary">
                        <p>Thành tiền: ${subtotal.toLocaleString()}đ</p>
                        ${totalDiscount > 0 ? `<p>Chiết khấu: ${totalDiscount.toLocaleString()}đ</p>` : ''}
                        <p class="total">Tổng tiền: ${total.toLocaleString()}đ</p>
                    </div>
                    <div class="QR-Banking">
                        <div class="QR">
                            <img src="./Asset/img/QR_Banking.png" alt="QR Thanh Toán" srcset="./Asset/img/QR_Banking.png">
                        </div>
                        <div class="Banking">
                            <p>BIDV - DINH HOA XUAN MAI</p>
                            <h1>8834272720</h1>
                            <p class="alert">Quý khách vui lòng kiểm tra lại thông tin trước khi chuyển khoản.</p>
                        </div>
                    </div>
                    <div class="bill-footer">
                        <p class="Hunq">Powered by Đinh Mạnh Hùng</p>
                    </div>

                    <!-- <script>
                        window.onload = function() { 
                        window.print();
                        };
                    </script> -->


                </body>

                </html>
        `;
    }
}

// History Management
class HistoryManager {
    static STORAGE_KEY = 'invoice_history';

    static saveInvoice(invoiceData) {
        const history = this.getHistory();
        history.push(invoiceData);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        cart = [];
    }

    static getHistory() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    static renderHistory() {
        const historyList = document.getElementById('historylist');
        const history = this.getHistory();
        historyList.innerHTML = history.map((invoice, index) => `
        <div class="history-item">
          <p>Thời gian: ${invoice.datetime}</p>
          <p>Khách hàng: ${invoice.customer}</p>
          <p>Thu ngân: ${invoice.cashier}</p>
          <p>Sản phẩm: ${invoice.items}</p>
          <p>Thanh toán: ${invoice.payment}</p>
          <p>Tổng tiền: ${invoice.total}đ</p>
        </div>
      `).join('');
    }

    static clearHistory() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.renderHistory();
        UIManager.showToast('Đã xóa lịch sử');
    }

    static downloadAsJSON() {
        const history = this.getHistory();
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice_history.json';
        a.click();
        URL.revokeObjectURL(url);
        UIManager.showToast('Đã tải xuống lịch sử hóa đơn dưới dạng JSON.');
    }

    static downloadAsExcel() {
        const history = this.getHistory();
        const worksheet = XLSX.utils.json_to_sheet(history, { header: ["datetime", "customer", "cashier", "items", "payment", "total"] });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");
        XLSX.writeFile(workbook, "invoice_history.xlsx");
        UIManager.showToast('Đã tải xuống lịch sử hóa đơn dưới dạng Excel.');
    }

    static printInvoice(datetime, customer, cashier, items, payment, total) {
        const billHTML = BillManager.generateBillHTML(datetime, customer, cashier, items, payment, total);
        BillManager.printBill(billHTML);
    }
}

// Tải hóa đơn ra Google Sheets
async function SendToGoogleSheet(jsonData) {
    // Định dạng datetime
    function formatDate(datetime) {
        const dateObj = new Date(datetime);

        const time = dateObj.toLocaleTimeString("vi-VN", { hour12: false }); // "10:26:53"
        const date = dateObj.toLocaleDateString("vi-VN"); // "15/12/2024"

        return `${time} ${date}`;
    }

    // Thay đổi giá trị datetime
    jsonData.datetime = formatDate(jsonData.datetime);

    // Hàm chuyển JSON sang query string
    function jsonToQueryString(json) {
        return Object.keys(json)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
            .join('&');
    }

    // Sử dụng hàm
    const queryString = jsonToQueryString(jsonData);

    try {
        // Gửi request (Thay URL bằng URL Google Apps Script của bạn)
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbzXoV0BNeooHkKGONwtFyfJrdPG_aGKlMWihXzw6f_sLkQoMESSEKw7ahN77J7wFxOO_Q/exec",
            {
                redirect: "follow",
                method: "POST",
                body: queryString,
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                }
            }
        );

        if (response.ok) {
            console.log("Gửi thành công");
        } else {
            throw new Error("Lỗi khi gửi đơn hàng");
        }
    } catch (error) {
        console.error(error);
        console.log("Đã xảy ra lỗi trong quá trình gửi dữ liệu");
    }
}

// Lưu hóa đơn vào LocalStorage
async function saveInvoice() {
    const saveButton = document.querySelector('.sync-data-btn');
    saveButton.disabled = true; // Vô hiệu hóa nút

    const customer = document.getElementById('customer-name').value;
    const cashier = document.getElementById('staff-name').value;
    const discount = document.getElementById('discount-info').textContent;

    if (!cashier || cart.length === 0) {
        UIManager.showError('Vui lòng điền đầy đủ thông tin và thêm sản phẩm');
        saveButton.disabled = false; // Kích hoạt lại nút
        return;
    }

    const itemsString = cart.map(item => `${item.product} (${item.quantity})`).join(', ');
    const finalTotal = CartManager.getFinalTotal();
    const invoiceData = {
        datetime: new Date().toISOString(),
        customer: customer,
        cashier: cashier,
        items: itemsString,
        discount: discount,
        total: finalTotal.toLocaleString(),
        payment: document.getElementById('payment-method').value || 'Chưa xác định',
    };

    HistoryManager.saveInvoice(invoiceData); // Lưu vào LocalStorage

    try {
        await SendToGoogleSheet(invoiceData);
    } catch (error) {
        console.error("Error sending data:", error);
    }

    CartManager.saveCart(); // Cập nhật giỏ hàng
    CartManager.updateDisplay();
    UIManager.showToast('Đã lưu hóa đơn thành công');

    setTimeout(() => {
        saveButton.disabled = false; // Kích hoạt lại nút sau khi hoàn thành
    }, 1000);
  
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    UIManager.initialize();
    HistoryManager.renderHistory();
    CartManager.loadCart();
});


// Hàm switchTab
function switchTab(tabName) {
    // Ẩn tất cả nội dung tab
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');

    // Bỏ active class khỏi tất cả tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Hiển thị tab được chọn
    document.getElementById(tabName).style.display = 'block';

    // Thêm active class cho tab button được chọn
    event.currentTarget.classList.add('active');

    // Nếu tab là history, render lại lịch sử
    if (tabName === 'history') {
        HistoryManager.renderHistory();
    }
}

// Khởi tạo tab mặc định lúc trang load
document.addEventListener('DOMContentLoaded', function () {
    const defaultTab = document.querySelector('.tab-content');
    if (defaultTab) {
        defaultTab.style.display = 'block';
    }

    const defaultTabButton = document.querySelector('.tab-button');
    if (defaultTabButton) {
        defaultTabButton.classList.add('active');
    }
});

