fetch('/POS/Asset/Version.json')
  .then(response => response.json()) // Chuyển đổi dữ liệu JSON
  .then(data => {
    // Tìm phiên bản có ngày cập nhật mới nhất
    const latestVersion = data.reduce((latest, current) => {
      const latestDate = new Date(latest.dateUpdate.split('/').reverse().join('-'));
      const currentDate = new Date(current.dateUpdate.split('/').reverse().join('-'));

      return currentDate > latestDate ? current : latest;
    });

    // Hiển thị thông tin phiên bản mới nhất
    document.getElementById('version').innerHTML = `Phiên bản ${latestVersion.version} <p>Ngày cập nhật: ${latestVersion.dateUpdate}</p>`;
  })
  .catch(error => {
    console.error('Lỗi khi tải file Version.json:', error);
  });

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
        UIManager.Loading();
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbxiKd7SUO5-IWB0Kr2YTuDFSOyw9DsG_G8dZgY1mGDbPlpkbor3iUP9EOmE7PA1vHO3oQ/exec?token=PRO&sheet=Product');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newData = await response.json();
            const localData = JSON.parse(localStorage.getItem('products')) || [];

            if (JSON.stringify(localData) !== JSON.stringify(newData)) {
                localStorage.setItem('products', JSON.stringify(newData));
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
    static Loading() {
        Swal.fire({
            title: 'Vui lòng chờ',
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
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

        // Gắn HTML cho nội dung hóa đơn
        const billHTML = this.generateBillHTML();

        // Tạo nội dung cho cửa sổ xem trước
        const previewContent = `
            <html>
                <head>
                    <title>Xem trước hóa đơn</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 0;
                        }
                        .bill-header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .bill-content {
                            border-radius: 5px;
                            background-color: #f9f9f9;
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-content">
                        ${billHTML}
                    </div>
                    <script>
                        // Đóng cửa sổ khi nhấn phím Esc
                        document.addEventListener('keydown', (event) => {
                            if (event.key === 'Escape') {
                                window.close();
                            }
                        });
                    </script>
                </body>
            </html>
        `;

        // Tính toán vị trí cửa sổ
        const windowWidth = 350; // Chiều rộng của cửa sổ
        const windowHeight = 900; // Chiều cao của cửa sổ
        const screenWidth = window.innerWidth; // Chiều rộng màn hình
        const screenHeight = window.innerHeight; // Chiều cao màn hình
        const left = Math.floor((screenWidth - windowWidth) / 0); // Vị trí trái của cửa sổ
        const top = Math.floor((screenHeight - windowHeight) / 0); // Vị trí trên của cửa sổ

        // Mở cửa sổ mới và chỉ định vị trí
        const previewWindow = window.open(
            '',
            '_blank',
            `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
        );

        if (previewWindow) {
            previewWindow.document.open();
            previewWindow.document.write(previewContent);
            previewWindow.document.close();
        } else {
            console.error('Không thể mở cửa sổ xem trước.');
        }
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

    static printBilltoSave() {
        saveInvoice();
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
                            margin-top: 10px;
                        }

                        .bill-footer p {
                            font-size: 20px;
                            font-weight: bold;
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
                            font-size: 12px !important;
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
                        <p>Cảm ơn quý khách ❤️</p>
                        <p class="Hunq">Powered by Đinh Mạnh Hùng</p>
                    </div>
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
    
        // Nếu số lượng hóa đơn vượt quá 20, xóa 10 hóa đơn cũ nhất
        if (history.length > 20) {
            history.splice(0, 10); // Xóa 10 phần tử đầu tiên (cũ nhất)
        }
    
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
          <p>Khách hàng: ${invoice.branch}</p>
          <p>Khách hàng: ${invoice.customer}</p>
          <p>Thu ngân: ${invoice.cashier}</p>
          <p>Sản phẩm: ${invoice.items}</p>
          <p>Thanh toán: ${invoice.payment}</p>
          <p>Tổng tiền: ${invoice.total}đ</p>
        </div>
      `).join('');
    }

    static clearHistory() {
        Swal.fire({
            title: 'Xác nhận xóa lịch sử',
            input: 'password',
            inputLabel: 'Nhập mật khẩu để xác nhận',
            inputPlaceholder: 'Mật khẩu...',
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            preConfirm: (password) => {
                if (password !== 'hunqd') {
                    Swal.showValidationMessage('Mật khẩu không đúng');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem(this.STORAGE_KEY);
                this.renderHistory();
                UIManager.showToast('Đã xóa lịch sử');
            }
        });
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
        const worksheet = XLSX.utils.json_to_sheet(history, { header: ["datetime", "branch", "customer", "cashier", "items", "payment", "total"] });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");
        XLSX.writeFile(workbook, "invoice_history.xlsx");
        UIManager.showToast('Đã tải xuống lịch sử hóa đơn dưới dạng Excel.');
    }

    static printInvoice(datetime, branch, customer, cashier, items, payment, total) {
        const billHTML = BillManager.generateBillHTML(datetime, branch , customer, cashier, items, payment, total);
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
    showOverlay();
    
    const branch = document.getElementById('branch').value;
    const customer = document.getElementById('customer-name').value;
    const cashier = document.getElementById('staff-name').value;
    const discount = document.getElementById('discount-info').textContent;

    if (!cashier || cart.length === 0) {
        UIManager.showError('Vui lòng điền đầy đủ thông tin và thêm sản phẩm');
        saveButton.disabled = false; // Kích hoạt lại nút
        return;
    }

    let hasRunCustomerPoints = false; // Cờ để đảm bảo chỉ chạy 1 lần

    try {
        if (!hasRunCustomerPoints) {
            hasRunCustomerPoints = true; // Đánh dấu là đã chạy
            await customerPoints(); // Gọi hàm và chờ hoàn thành
        }
    } catch (error) {
        console.error("Error calculating customer points:", error);
        UIManager.showError('Không thể lưu hoá đơn');
        saveButton.disabled = false; // Kích hoạt lại nút nếu có lỗi
        hasRunCustomerPoints = false; // Đặt lại cờ nếu xảy ra lỗi
        return;
    }


    const itemsString = cart.map(item => `${item.product} (${item.quantity})`).join(', ');
    const finalTotal = CartManager.getFinalTotal();
    const invoiceData = {
        datetime: new Date().toISOString(),
        branch: branch,
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
        hideOverlay();
    }, 1000);
}

async function customerPoints() {
    // Sử dụng exportedCustomer trong các hàm khác
    function useMatches() {
        exportedCustomer.forEach(match => {
            console.log(match.Name);
        });
    }

    useMatches();

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


// Phím tắt
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && event.key === 's') {
        event.preventDefault(); // Ngăn trình duyệt thực hiện hành động mặc định (nếu có)
        saveInvoice(); // Lưu hóa đơn
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        UIManager.closeCart(); // Đóng giỏ hàng
    }

    if (event.altKey && event.keyCode == 49) { //Alt + 1
        event.preventDefault();
        UIManager.openCart(); // Đóng giỏ hàng
    }

    if (event.altKey && event.keyCode == 80) { //Alt + P
        event.preventDefault();
        BillManager.printBill(); // In hoá đơn
    }

    if (event.altKey && event.keyCode == 86) { //Alt + V
        event.preventDefault();
        BillManager.showPreview(); // Xem hoá đơn
    }

    if (event.ctrlKey && event.key === 'Delete') {
        event.preventDefault();
        CartManager.clearCart(); // Xóa giỏ hàng
    }
});


function showOverlay() {
    document.getElementById('overlay').style.display = 'flex';
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}
