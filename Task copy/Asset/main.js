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
                    <span>${(item.quantity * item.price).toLocaleString()}đ</span>
                    <i class="fas fa-trash" onclick="CartManager.removeItem(${index})"></i>
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
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
            const response = await fetch('./Data/DB-Product.json');
            products = await response.json();
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Không thể tải dữ liệu sản phẩm');
        }
    }


    static renderProducts() {
        if (domElements.productsContainer) {
            domElements.productsContainer.innerHTML = products.map(product => `
                <div class="product-item" onclick="CartManager.addItem(${JSON.stringify(product).replace(/"/g, "'")})">
                    <h3>${product.product}</h3>
                    <p>${product.price.toLocaleString()}đ</p>
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
        const billTimeInput = document.getElementById('bill-time');
        const previewContent = document.getElementById('print-preview');
        const closeBtn = document.querySelector('.close-modal');

        // Kiểm tra elements tồn tại
        if (!modal || !billTimeInput || !previewContent) {
            console.error('Không tìm thấy các elements cần thiết');
            return;
        }

        // Set thời gian hiện tại
        const currentTime = new Date();
        billTimeInput.value = this.formatDateTime(currentTime);

        // Hiển thị modal
        modal.style.display = 'block';
        previewContent.innerHTML = this.generateBillHTML();

        // Xử lý đóng modal
        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }

        // Đóng modal khi click bên ngoài
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
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
        const printWindow = window.open('', '', 'width=80mm');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>In hóa đơn</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif;
                                padding: 20px;
                                max-width: 80mm;
                                margin: 0 auto;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 15px 0;
                            }
                            th, td {
                                padding: 8px;
                                text-align: left;
                                border-bottom: 1px solid #ddd;
                            }
                            .preview-header {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .bill-info {
                                margin: 15px 0;
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
                                margin-top: 30px;
                            }
                            .preview-table th {
                                border: 2px solid black ;
                            }
                        </style>
                    </head>
                    <body>
                        ${this.generateBillHTML()}
                        <script>
                            window.onload = function() { 
                                window.print();
                                window.onfocus = function() { 
                                    window.close(); 
                                }
                            }
                        </script>
                    </body>
                </html>
            `);
        }
    }
    static generateBillHTML() {
        const customerName = document.getElementById('customer-name')?.value || '';
        const staffName = document.getElementById('staff-name')?.value || '';
        const PaymentMethod = document.getElementById('Payment-method')?.value || '';

        const billTime = document.getElementById('bill-time')?.value || this.formatDateTime(new Date());

        const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = Number(domElements.discountPercent?.value) || 0;
        const discountAmount = Number(domElements.discountAmount?.value) || 0;
        const percentDiscount = subtotal * (discountPercent / 100);
        const totalDiscount = percentDiscount + discountAmount;
        const total = subtotal - totalDiscount;

        return `
            <div class="preview-header">
                <img src="./Asset/Logo.png" alt="Logo" style="width: 100px">
                <h2>ABC Hair Salon</h2>
                <p>Việt Nam</p>
                <p>0912.123.123</p>
                <hr>
                <h3>HOÁ ĐƠN THANH TOÁN</h3>
            </div>
            <div class="bill-info">
                <p>Thời gian: ${billTime}</p>
                <p>Khách hàng: ${customerName}</p>
                <p>Thu ngân: ${staffName}</p>
                <p>Thanh toán: ${PaymentMethod}</p>
            </div>
            <table class="preview-table">
                <tr>
                    <th>STT</th>
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
                        <td>${item.price.toLocaleString()}đ</td>
                        <td>${(item.quantity * item.price).toLocaleString()}đ</td>
                    </tr>
                `).join('')}
            </table>
            <div class="bill-summary">
                <p>Thành tiền: ${subtotal.toLocaleString()}đ</p>
                ${totalDiscount > 0 ? `<p>Chiết khấu: ${totalDiscount.toLocaleString()}đ</p>` : ''}
                <p class="total">Tổng tiền: ${total.toLocaleString()}đ</p>
            </div>
            <div class="bill-footer">
                <p>Cảm ơn quý khách!</p>
            </div>
        `;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    UIManager.initialize();
});

// Export functions for HTML
window.POS = {
    showPreview: () => BillManager.showPreview(),
    printBill: () => BillManager.printBill(),
    clearCart: () => CartManager.clearCart()
};


// Lưu lịch sử hoá đơn cục bộ
// Quản lý lưu trữ hóa đơn
class HistoryManager {
    static STORAGE_KEY = 'invoice_history';

    static saveInvoice(invoiceData) {
        const history = this.getHistory();
        history.push(invoiceData);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }

    static getHistory() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    static clearHistory() {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: 'Bạn có chắc muốn xóa toàn bộ lịch sử?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem(this.STORAGE_KEY);
                this.renderHistory();
                UIManager.showToast('Đã xóa lịch sử');
            }
        });
    }

    static renderHistory() {
        const historyList = document.getElementById('history-list');
        const history = this.getHistory();

        historyList.innerHTML = history.map((invoice, index) => `
            <div class="history-item">
                <p>Thời gian: ${invoice.datetime}</p>
                <p>Khách hàng: ${invoice.customer}</p>
                <p>Thu ngân: ${invoice.cashier}</p>
                <p>Tổng tiền: ${invoice.total.toLocaleString()}đ</p>
                <button onclick="HistoryManager.viewDetails(${index})">Chi tiết</button>
            </div>
        `).join('');
    }

    static downloadAsExcel() {
        const history = this.getHistory();
        const ws = XLSX.utils.json_to_sheet(history);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Lịch sử hóa đơn");
        XLSX.writeFile(wb, "lich-su-hoa-don.xlsx");
    }

    static downloadAsJSON() {
        const history = this.getHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lich-su-hoa-don.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Sửa đổi hàm lưu hóa đơn
async function saveInvoice() {
    const customer = document.getElementById('customer').value;
    const cashier = document.getElementById('cashier').value;

    if (!customer || !cashier || cart.length === 0) {
        UIManager.showToast('Vui lòng điền đầy đủ thông tin và thêm sản phẩm');
        return;
    }

    const invoiceData = {
        datetime: new Date().toLocaleString(),
        customer: customer,
        cashier: cashier,
        items: cart,
        total: calculateTotal(),
        payment: document.getElementById('payment').value
    };

    try {
        // Gửi dữ liệu đến Google Sheets Web App
        const response = await fetch('https://script.google.com/macros/s/AKfycbwZmIBH0YKDq4HZ3stB7HFYTQHvWTxFjtuE9d6KPkaf6X2Kkz46W7pnsJhymeMD9L3loA/exec', {
            method: 'POST',
            body: JSON.stringify(invoiceData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Lưu vào local storage
            HistoryManager.saveInvoice(invoiceData);

            // Xóa giỏ hàng
            cart = [];
            CartManager.saveCart();
            CartManager.updateDisplay();

            // Reset form
            document.getElementById('customer').value = '';
            document.getElementById('cashier').value = '';

            UIManager.showToast('Đã lưu hóa đơn thành công');
        } else {
            throw new Error('Lỗi khi lưu hóa đơn');
        }
    } catch (error) {
        UIManager.showToast('Lỗi: ' + error.message);
    }
}


//TAB
// Quản lý các tab
function switchTab(tabName) {
    // Ẩn tất cả tab content
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

// Khởi tạo tab mặc định khi trang load
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị tab đầu tiên theo mặc định
    const defaultTab = document.querySelector('.tab-content');
    if (defaultTab) {
        defaultTab.style.display = 'block';
    }
    
    const defaultTabButton = document.querySelector('.tab-button');
    if (defaultTabButton) {
        defaultTabButton.classList.add('active');
    }
});
