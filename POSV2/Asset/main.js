// fetch('/POS/Asset/Version.json')
//     .then(response => response.json()) // Chuyển đổi dữ liệu JSON
//     .then(data => {
//         // Tìm phiên bản có ngày cập nhật mới nhất
//         const latestVersion = data.reduce((latest, current) => {
//             const latestDate = new Date(latest.dateUpdate.split('/').reverse().join('-'));
//             const currentDate = new Date(current.dateUpdate.split('/').reverse().join('-'));

//             return currentDate > latestDate ? current : latest;
//         });

//         // Hiển thị thông tin phiên bản mới nhất
//         document.getElementById('version').innerHTML = `Phiên bản ${latestVersion.version} <p>Ngày cập nhật: ${latestVersion.dateUpdate}</p>`;
//     })
//     .catch(error => {
//         console.error('Lỗi khi tải file Version.json:', error);
//     });

const STORAGE_KEY = 'pos_cart';
let products = [];
let cart = [];


// Format 
function formatPriceInput(input) {
    // Xóa hết dấu chấm trước khi format
    let value = input.value.replace(/\./g, '');
    if (!isNaN(value) && value !== '') {
        input.value = parseInt(value).toLocaleString('vi-VN');
    } else {
        input.value = '';
    }
}

function unformatPrice(value) {
    return parseInt(value.replace(/\./g, '')) || 0;
}


// edit-popup
let currentInput = null;

function openPopup(input) {
    currentInput = input;
    document.getElementById('popupTextarea').value = input.value;
    document.getElementById('editPopup').style.display = 'flex';

    // Focus vào textarea ngay sau khi mở
    setTimeout(() => {
        document.getElementById('popupTextarea').focus();
    }, 50);
}

function closePopup() {
    document.getElementById('editPopup').style.display = 'none';
}

// Save thay đổi vào input
function savePopup() {
    if (currentInput) {
        currentInput.value = document.getElementById('popupTextarea').value;
        currentInput.dispatchEvent(new Event('change'));
    }
    closePopup();
}

// Bấm nền ngoài sẽ đóng popup
document.addEventListener('click', function (e) {
    const popup = document.getElementById('editPopup');
    const popupContent = document.querySelector('.edit-popup-content');

    if (popup.style.display === 'flex') {
        // Nếu đang mở và click bên ngoài phần content
        if (!popupContent.contains(e.target) && popup.contains(e.target)) {
            closePopup();
        }
    }
});
// Thêm sự kiện khi nhấn phím trong popupTextarea
document.getElementById('popupTextarea').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { // Enter bình thường (không kèm Shift)
        e.preventDefault(); // Ngăn xuống dòng
        savePopup(); // Gọi hàm lưu
    }
});


// Hiển thị chiết khấu 
function toggleDiscountType() {
    const isAmount = document.getElementById('discountType').checked;
    const discountInput = document.getElementById('discount');
    const discountAmountInput = document.getElementById('discountAmount');

    if (isAmount) {
        discountInput.style.display = 'none';
        discountAmountInput.style.display = 'block';
    } else {
        discountInput.style.display = 'block';
        discountAmountInput.style.display = 'none';
    }
}

// Tìm kiếm sản phẩm
document.addEventListener('DOMContentLoaded', () => {
    UIManager.loadProductsForSale();
});

// Mở rộng tuỳ chỉnh
const toggleButton = document.getElementById('select-customer');
const billInfo = document.querySelector('.bill-info-inputs');

toggleButton.addEventListener('click', () => {
    billInfo.classList.toggle('expanded');

    // Đổi text nút
    if (billInfo.classList.contains('expanded')) {
        toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        toggleButton.innerHTML = '<i class="fas fa-user-tag"></i>';
    }
});


// Cuộn danh mục
const categories = document.getElementById('categories');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

// Kiểm tra trạng thái hiển thị nút
function updateScrollButtons() {
    const scrollLeft = categories.scrollLeft;
    const maxScrollLeft = categories.scrollWidth - categories.clientWidth;

    if (categories.scrollWidth > categories.clientWidth) {
        scrollRightBtn.style.display = 'flex';
    } else {
        scrollRightBtn.style.display = 'none';
    }

    // Nếu đang ở đầu thì ẩn nút trái
    if (scrollLeft <= 0) {
        scrollLeftBtn.style.display = 'none';
    } else {
        scrollLeftBtn.style.display = 'flex';
    }

    // Nếu scroll tới cuối, ẩn nút phải (tuỳ chọn, nếu bạn muốn)
    if (scrollLeft >= maxScrollLeft - 1) {
        scrollRightBtn.style.display = 'none';
    } else if (categories.scrollWidth > categories.clientWidth) {
        scrollRightBtn.style.display = 'flex';
    }
}

// Sự kiện click nút
scrollLeftBtn.addEventListener('click', () => {
    categories.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
});

scrollRightBtn.addEventListener('click', () => {
    categories.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
});

// Khi scroll cũng kiểm tra để show/hide nút
categories.addEventListener('scroll', updateScrollButtons);

// Khi trang load và resize
window.addEventListener('load', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);


// Xem dung lượng đã lưu
function getLocalStorageSizeInKB() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
    }
    // mỗi ký tự ~2 bytes (UTF-16), chuyển ra KB
    return (total * 2) / 1024;
}



// Ví dụ:
const sizeInKB = getLocalStorageSizeInKB();
console.log(`LocalStorage đang dùng khoảng ${sizeInKB.toFixed(2)} KB`);





// Quét sản phẩm bằng QR, Barcode
let isScanning = false;
let html5QrCode;
const popupDiv = document.getElementById('reader-popup');
const readerDiv = document.getElementById('reader');
const closeButton = document.getElementById('close-reader');

const ScanManager = {
    async startScan(successCallback) {
        try {
            if (isScanning) {
                console.log('Đã có phiên quét đang chạy.');
                return;
            }

            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode("reader");
            }

            popupDiv.style.display = 'flex';

            const cameras = await Html5Qrcode.getCameras();
            if (cameras && cameras.length) {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 30 },
                    async (decodedText, decodedResult) => {
                        await successCallback(decodedText, decodedResult);

                        // Sau khi quét thành công, dừng camera
                        await html5QrCode.stop();
                        popupDiv.style.display = 'none';
                        isScanning = false;
                    },
                    (errorMessage) => {
                        // console.log('Lỗi khi quét:', errorMessage);
                    }
                );
                isScanning = true;
                console.log('Bắt đầu quét');
            } else {
                console.error('Không tìm thấy camera');
                UIManager.showError('Không tìm thấy camera');
            }
        } catch (err) {
            console.error('Lỗi khởi động quét:', err);
            UIManager.showError('Lỗi khởi động quét');
        }
    },

    async stopScan() {
        if (isScanning && html5QrCode) {
            await html5QrCode.stop();
            popupDiv.style.display = 'none';
            isScanning = false;
            console.log('Đã dừng quét');

        }
    }
};

document.getElementById('scan-barcode').addEventListener('click', async () => {
    await ScanManager.startScan(async (decodedText, decodedResult) => {
        console.log(`Mã đã quét: ${decodedText}`);

        const product = products.find(p => String(p.id).trim() === decodedText.trim());
        if (product) {
            CartManager.addItem(product);
            UIManager.showToast(`Đã thêm sản phẩm: ${product.name}`);
        } else {
            const result = await Swal.fire({
                title: 'Không tìm thấy sản phẩm!',
                text: 'Bạn có muốn thêm sản phẩm mới không?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Có, thêm mới',
                cancelButtonText: 'Không'
            });

            if (result.isConfirmed) {
                const { value: formValues } = await Swal.fire({
                    title: 'Nhập thông tin sản phẩm mới',
                    html: `<input id="swal-input-name" class="swal2-input" placeholder="Tên sản phẩm">` +
                        `<input id="swal-input-category" class="swal2-input" placeholder="Phân loại">` +
                        `<input id="swal-input-price" type="number" class="swal2-input" placeholder="Giá">`,
                    focusConfirm: false,
                    preConfirm: () => {
                        const name = document.getElementById('swal-input-name').value.trim();
                        const category = document.getElementById('swal-input-category').value.trim();
                        const price = parseFloat(document.getElementById('swal-input-price').value.trim());

                        if (!name) {
                            Swal.showValidationMessage('Tên sản phẩm không được để trống');
                            return false;
                        }
                        if (!category) {
                            Swal.showValidationMessage('Phân loại sản phẩm không được để trống');
                            return false;
                        }
                        if (isNaN(price) || price <= 0) {
                            Swal.showValidationMessage('Giá sản phẩm phải là số dương');
                            return false;
                        }
                        return { name, category, price };
                    }
                });

                if (formValues) {
                    const newProduct = {
                        id: decodedText.trim(),
                        name: formValues.name,
                        category: formValues.category,
                        price: formValues.price
                    };

                    products.push(newProduct);
                    localStorage.setItem('products', JSON.stringify(products));
                    UIManager.showToast(`Đã thêm sản phẩm mới: ${newProduct.name}`);
                    CartManager.addItem(newProduct);
                }
            }
        }
    });
});


// Các nút control:
closeButton.addEventListener('click', async () => {
    await ScanManager.stopScan();
});

popupDiv.addEventListener('click', async (event) => {
    if (!readerDiv.contains(event.target)) {
        await ScanManager.stopScan();
    }
});
document.getElementById("flip-camera").addEventListener("click", () => {
    const video = document.querySelector("#reader video");
    if (video) {
        video.classList.toggle("flipped");
    }
});

async function logCameraInfo() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        console.log('Danh sách camera:');
        videoDevices.forEach((device, index) => {
            console.log(`Camera ${index + 1}:`);
            console.log(`- Label: ${device.label || 'Không có (cần cấp quyền)'}`);
            console.log(`- Device ID: ${device.deviceId}`);
            console.log(`- Group ID: ${device.groupId}`);
            console.log('--------------------------');
        });
    } catch (err) {
        console.error('Không thể lấy thông tin thiết bị:', err);
    }
}




// DEV



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
const STORAGE_KEY_CARTS = 'carts';
const STORAGE_KEY_INVOICES = 'invoices';
const STORAGE_KEY_DEFAULT_INVOICES = 'default_invoices';

let currentInvoiceId = '';
let defaultInvoices = []; // <- Danh sách hóa đơn mặc định

class CartManager {
    static addItem(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cart.push({ ...product, quantity: product.quantity || 1 });
        }
        this.saveCart();
        this.updateDisplay();
        UIManager.showToast('Đã thêm vào giỏ hàng');
    }


    static updateItem(index, field, value) {
        if (cart[index]) {
            cart[index][field] = (field === 'quantity' || field === 'price') ? Number(value) : value;
            this.saveCart();
            this.updateDisplay();
        }
    }
    static changeQuantity(index, delta) {
        if (cart[index]) {
            let currentQuantity = Number(cart[index].quantity);

            if (currentQuantity === 1 && delta === -1) {
                // Nếu đang là 1 và nhấn giảm nữa -> Xoá sản phẩm
                if (confirm("Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng không?")) {
                    this.removeItem(index);
                }
            } else {
                let newQuantity = currentQuantity + delta;
                if (newQuantity < 1) newQuantity = 1;
                cart[index].quantity = newQuantity;
                this.saveCart();
                this.updateDisplay();
            }
        }
    }

    static removeItem(index) {
        // Swal.fire({
        //     title: 'Xác nhận xóa?',
        //     text: "Bạn có chắc muốn xóa sản phẩm này?",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Xóa',
        //     cancelButtonText: 'Hủy'
        // }).then((result) => {
        //     if (result.isConfirmed) {

        //     }
        // });
        cart.splice(index, 1);
        this.saveCart();
        this.updateDisplay();
        UIManager.showToast('Đã xóa sản phẩm');
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

    static loadInvoices() {
        const invoiceSelect = document.getElementById('invoiceSelect');
        invoiceSelect.innerHTML = '';

        const savedDefaults = localStorage.getItem(STORAGE_KEY_DEFAULT_INVOICES);
        defaultInvoices = savedDefaults ? JSON.parse(savedDefaults) : ['Ghế 1', 'Ghế 2', 'Ghế 3'];

        defaultInvoices.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            invoiceSelect.appendChild(option);
        });

        const savedInvoices = JSON.parse(localStorage.getItem(STORAGE_KEY_INVOICES)) || [];
        savedInvoices.forEach(invoice => {
            if (!defaultInvoices.includes(invoice.value)) {
                const option = document.createElement('option');
                option.value = invoice.value;
                option.textContent = invoice.text;
                invoiceSelect.appendChild(option);
            }
        });

        currentInvoiceId = invoiceSelect.value;
        this.loadCart();
    }

    static saveDefaultInvoices() {
        const input = document.getElementById('defaultInvoicesInput').value.trim();
        if (!input) return;
        defaultInvoices = input.split(';').map(item => item.trim()).filter(item => item !== '');
        localStorage.setItem(STORAGE_KEY_DEFAULT_INVOICES, JSON.stringify(defaultInvoices));

        Swal.fire('Đã lưu!', 'Danh sách hóa đơn mặc định đã được cập nhật.', 'success').then(() => {
            this.loadInvoices();
        });
    }
    static loadDefaultInvoicesInput() {
        const saved = localStorage.getItem(STORAGE_KEY_DEFAULT_INVOICES);
        if (saved) {
            const invoices = JSON.parse(saved);
            console.log(invoices);
            
            document.getElementById('defaultInvoicesInput').value = invoices.join('; ');
        }
    }
    

    static createNewInvoice() {
        Swal.fire({
            title: 'Nhập tên hóa đơn mới',
            input: 'text',
            inputPlaceholder: 'VD: Hóa đơn khách A',
            showCancelButton: true,
            confirmButtonText: 'Tạo',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed && result.value.trim() !== '') {
                const newInvoiceName = result.value.trim();
                const invoiceSelect = document.getElementById('invoiceSelect');

                const option = document.createElement('option');
                option.value = newInvoiceName;
                option.text = newInvoiceName;
                invoiceSelect.appendChild(option);

                invoiceSelect.value = newInvoiceName;
                currentInvoiceId = newInvoiceName;
                cart = [];
                this.saveCart();
                this.saveInvoices();
                this.updateDisplay();
                UIManager.showToast('Đã tạo hóa đơn mới');
            }
        });
    }

    static deleteInvoice() {
        const invoiceSelect = document.getElementById('invoiceSelect');
        const selectedInvoice = invoiceSelect.value;

        if (defaultInvoices.includes(selectedInvoice)) {
            Swal.fire('Không thể xóa', 'Không thể xóa các hóa đơn mặc định.', 'warning');
            return;
        }

        Swal.fire({
            title: `Xóa hóa đơn "${selectedInvoice}"?`,
            text: "Hóa đơn sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                const optionToRemove = Array.from(invoiceSelect.options).find(opt => opt.value === selectedInvoice);
                if (optionToRemove) optionToRemove.remove();

                const allInvoices = JSON.parse(localStorage.getItem(STORAGE_KEY_INVOICES)) || [];
                const updatedInvoices = allInvoices.filter(inv => inv.value !== selectedInvoice);
                localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(updatedInvoices));

                localStorage.removeItem(STORAGE_KEY_CARTS + '_' + selectedInvoice);

                invoiceSelect.value = defaultInvoices[0];
                currentInvoiceId = defaultInvoices[0];
                this.loadCart();
                this.updateDisplay();

                UIManager.showToast('Đã xóa hóa đơn');
            }
        });
    }

    static switchInvoice(invoiceId) {
        currentInvoiceId = invoiceId;
        this.loadCart();
        this.updateDisplay();
    }

    static saveCart() {
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEY_CARTS)) || {};
        carts[currentInvoiceId] = cart;
        localStorage.setItem(STORAGE_KEY_CARTS, JSON.stringify(carts));
    }

    static loadCart() {
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEY_CARTS)) || {};
        cart = carts[currentInvoiceId] || [];
        this.updateDisplay();
    }

    static saveInvoices() {
        const invoiceSelect = document.getElementById('invoiceSelect');
        const invoices = Array.from(invoiceSelect.options)
            .filter(option => !defaultInvoices.includes(option.value))
            .map(option => ({
                value: option.value,
                text: option.text
            }));
        localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
    }

    static updateDisplay() {
        this.renderCartItems();
        this.updateCartCount();
        this.calculateTotal();
    }

    static renderCartItems() {
        if (domElements.cartContainer) {
            if (cart.length === 0) {
                domElements.cartContainer.innerHTML = ` <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Giỏ hàng trống</p>
                            <p>Nhập sản phẩm từ điện thoại</p>
                            <button onclick="CartManager.startScan()"><i class="fa-solid fa-mobile-screen-button"></i></button>
                        </div>`;
            } else {
                domElements.cartContainer.innerHTML = cart.map((item, index) => `
                    <div class="cart-item" id="${index}">
                        <div class="cart-item-info">
                            <span class="cart-item-index">${index + 1}.</span><input type="text" value="${item.name}" onclick="openPopup(this)" onchange="CartManager.updateItem(${index}, 'name', this.value)">
                            <input class="cart-item-price" type="text" value="${item.price.toLocaleString('vi-VN')}" 
                            oninput="formatPriceInput(this)" 
                            onchange="CartManager.updateItem(${index}, 'price', unformatPrice(this.value))">
                        </div>
                       <div class="cart-item-quantity">
                            <input class="quantity-value" type="number" value="${item.quantity}" min="1"
                                onchange="CartManager.updateItem(${index}, 'quantity', this.value)">
                        </div>
                        <div class="cart-item-total">${(item.quantity * item.price).toLocaleString('vi-VN')}đ</div>
                        <div class="cart-item-del">
                            <button class="cart-item-remove" onclick="CartManager.removeItem(${index})"><i class="fas fa-trash"></i></button>
                        </div>
                        
                    </div>
                `).join('');
            }
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
        const discountAmount = Number((domElements.discountAmount?.value || '0').replace(/\./g, '')) || 0;
        const percentDiscount = subtotal * (discountPercent / 100);
        const totalDiscount = percentDiscount + discountAmount;
        const final = subtotal - totalDiscount;

        if (domElements.subtotalElement) {
            domElements.subtotalElement.textContent = `${subtotal.toLocaleString()}đ`;
        }

        if (domElements.discountInfo) {
            let discountHTML = '';
            discountHTML += totalDiscount > 0
                ? `${totalDiscount.toLocaleString()}đ</p>`
                : `0đ</p>`;
            domElements.discountInfo.innerHTML = discountHTML;
        }

        if (domElements.totalElement) {
            domElements.totalElement.textContent = `${final.toLocaleString()}đ`;
        }
    }

    static getFinalTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const discountPercent = Number(domElements.discountPercent?.value) || 0;
        const discountAmount = Number((domElements.discountAmount?.value || '0').replace(/\./g, '')) || 0;
        const percentDiscount = subtotal * (discountPercent / 100);
        const totalDiscount = percentDiscount + discountAmount;
        return subtotal - totalDiscount;
    }


    // Mới
    static generateQRCode() {
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEY_CARTS)) || {};
        const currentCart = carts[currentInvoiceId] || [];

        if (currentCart.length === 0) {
            alert('Giỏ hàng trống. Không có sản phẩm để tạo mã QR.');
            return;
        }

        const minimalCart = currentCart.map(item => ({
            i: item.id,
            q: item.quantity
        }));

        const compressedData = LZString.compressToBase64(JSON.stringify(minimalCart));

        if (compressedData.length > 1000) {
            alert('Giỏ hàng quá lớn để tạo mã QR.');
            return;
        }

        // Hiển thị popup
        const popup = document.getElementById('qr-popup');
        const qrCodeContainer = document.getElementById('qrcode');
        qrCodeContainer.innerHTML = '';
        popup.style.display = 'block';

        new QRCode(qrCodeContainer, {
            text: compressedData,
            width: 300,
            height: 300
        });

        // Đóng khi click ra ngoài modal
        document.getElementById('qr-close').onclick = () => {
            popup.style.display = 'none';
            qrCodeContainer.innerHTML = '';
        };

        document.getElementById('qr-overlay').onclick = (e) => {
            if (e.target.id === 'qr-overlay') {
                popup.style.display = 'none';
                qrCodeContainer.innerHTML = '';
            }
        };

    }



    static async startScan() {
        try {
            if (isScanning) {
                console.log('Đã có phiên quét đang chạy.');
                return;
            }

            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode("reader");
            }

            // Hiện popup trước khi quét
            const popupDiv = document.getElementById('reader-popup');
            popupDiv.style.display = 'flex';

            const cameras = await Html5Qrcode.getCameras();
            if (cameras && cameras.length) {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 30 },
                    async (decodedText, decodedResult) => {
                        try {
                            const decompressed = LZString.decompressFromBase64(decodedText);
                            const importedCart = JSON.parse(decompressed);

                            cart = [];
                            if (Array.isArray(importedCart)) {
                                for (const item of importedCart) {
                                    const product = products.find(p => p.id == item.i);

                                    if (product) {
                                        const cartItem = {
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            quantity: item.q
                                        };

                                        CartManager.addItem(cartItem);
                                    } else {
                                        UIManager.showError(`Không tìm thấy sản phẩm ID: ${item.i}`);
                                    }
                                }

                                CartManager.saveCart();
                                CartManager.updateDisplay();
                                UIManager.showToast('Đã nhập giỏ hàng từ QR');
                            } else {
                                Swal.fire('Lỗi dữ liệu', 'Dữ liệu không hợp lệ.', 'error');
                            }
                        } catch (e) {
                            Swal.fire('Lỗi', 'Không thể đọc dữ liệu.', 'error');
                        }

                        // Sau khi quét thành công, dừng camera và ẩn popup
                        await html5QrCode.stop();
                        popupDiv.style.display = 'none';
                        isScanning = false;
                    },
                    (errorMessage) => {
                        // console.log(`QR code scan error: ${errorMessage}`);
                    }
                );
                isScanning = true;
                console.log('Bắt đầu quét QR để nhập giỏ hàng');
            } else {
                console.error('Không tìm thấy camera');
                UIManager.showError('Không tìm thấy camera');
                popupDiv.style.display = 'none'; // Đóng popup nếu lỗi
            }
        } catch (err) {
            console.error('Lỗi khởi động quét QR:', err);
            UIManager.showError('Lỗi khởi động quét QR');
            const popupDiv = document.getElementById('reader-popup');
            popupDiv.style.display = 'none'; // Đóng popup nếu lỗi
        }
    }


}

// === Khởi động: load cart hoá đơn 1 khi vào trang ===
window.addEventListener('DOMContentLoaded', () => {
    CartManager.loadInvoices();
    CartManager.loadCart();
});
// Khi trang load hoặc khi cần cập nhật ô input
document.addEventListener('DOMContentLoaded', () => {
    CartManager.loadDefaultInvoicesInput();
});



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
                this.renderCategoryButtons(); // 👈 Thêm dòng này
            } else {
                console.warn('No local data found. Please sync with the server.');
                UIManager.syncProducts();
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


    static renderCategoryButtons() {
        const categories = new Set();

        products.forEach(p => {
            const cats = (p.category || 'Khác').split('+').map(c => c.trim());
            cats.forEach(cat => categories.add(cat));
        });

        const buttonsHtml = ['Tất cả', ...categories].map(category => `
            <button class="category${category === 'Tất cả' ? ' active' : ''}" data-category="${category}">${category}</button>
        `).join('');

        document.getElementById('categories').innerHTML = buttonsHtml;

        // Gắn sự kiện cho các nút category
        document.querySelectorAll('.category').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCategory = btn.getAttribute('data-category');
                this.renderProducts(selectedCategory === 'Tất cả' ? null : selectedCategory);
            });
        });
    }


    static renderProducts(filterCategory = null, keyword = '') {
        if (!domElements.productsContainer) return;

        let filteredProducts = products;

        if (filterCategory && filterCategory !== 'Tất cả') {
            filteredProducts = filteredProducts.filter(p => {
                const categories = (p.category || 'Khác').split('+').map(c => c.trim());
                return categories.includes(filterCategory);
            });
        }

        if (keyword) {
            const lowerKeyword = keyword.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(lowerKeyword) ||
                p.id.toString().toLowerCase().includes(lowerKeyword)
            );
        }


        domElements.productsContainer.innerHTML = filteredProducts.length
            ? filteredProducts.map(product => `
                <div class="product-item" data-id="${product.id}" onclick="CartManager.addItem(${JSON.stringify(product).replace(/"/g, "'")})">
                    <div class="product-image">
                        <img src="./Asset/Logo.png" alt="${product.name}" onerror="this.src='./Asset/logo.png'">
                    </div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-id">ID:${product.id}</div>
                    <div class="product-price">${product.price.toLocaleString()}đ</div>
                </div>
            `).join('')
            : `<div class="no-product">Không tìm thấy sản phẩm nào.</div>`;
    }

    static loadProductsForSale() {
        this.renderCategoryButtons();
        this.renderProducts(); // Ban đầu render tất cả sản phẩm

        // Thiết lập sự kiện tìm kiếm
        const searchInput = document.getElementById('product-search');
        searchInput.addEventListener('input', () => {
            const keyword = searchInput.value.trim();
            // Tìm nút đang active để lọc theo danh mục nếu cần
            const activeCategoryBtn = document.querySelector('.category.active');
            const selectedCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : null;
            this.renderProducts(selectedCategory === 'Tất cả' ? null : selectedCategory, keyword);
        });
    }

    static setupEventListeners() {

        document.getElementById("sync-customers").addEventListener('click', () => {
            loadCustomerData(); // Gọi loadCustomerData khi nhấn nút
        });
        // Discount inputs
        domElements.discountPercent?.addEventListener('input', () => CartManager.calculateTotal());
        domElements.discountAmount?.addEventListener('input', () => CartManager.calculateTotal());





        // Hàm xử lý thêm sản phẩm
        function handleProductById(id) {
            const product = products.find(p => p.id == id);
            if (product) {
                CartManager.addItem(product);
                UIManager.showToast(`Đã thêm sản phẩm: ${product.name}`);
            } else {
                console.log(id);

                UIManager.showError('Không tìm thấy sản phẩm với mã này.');
            }
        }
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


class ProductManager {
    static products = [];

    static async init() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.renderProductTable();
        this.attachHandlers();
    }

    static renderProductTable() {
        const tableBody = document.querySelector('#productTable tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        this.products.forEach((product, index) => {
            const row = this.createRow(product, index);
            tableBody.appendChild(row);
        });
    }

    static createRow(product, index) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="text" value="${product.id}" data-index="${index}" data-field="id" class="pm-input editable-input" ${product.id ? 'readonly' : ''} /></td>
            <td><input type="text" value="${product.name}" data-index="${index}" data-field="name" class="pm-input editable-input" /></td>
            <td><input type="text" value="${product.category}" data-index="${index}" data-field="category" class="pm-input editable-input" /></td>
            <td><input type="number" value="${product.price}" data-index="${index}" data-field="price" class="pm-input editable-input" /></td>
            <td><button data-index="${index}" class="pm-delete-btn">Xoá</button></td>
        `;
        return row;
    }


    static attachHandlers() {
        const addBtn = document.getElementById('addProduct');
        const saveBtn = document.getElementById('saveProducts');
        const tbody = document.querySelector('#productTable tbody');

        // Gỡ sự kiện trước (nếu có)
        addBtn?.removeEventListener('click', this._addHandler);
        saveBtn?.removeEventListener('click', this._saveHandler);

        // Gán handler chính vào thuộc tính tạm để có thể remove về sau
        this._addHandler = () => this.addProductRow();
        this._saveHandler = () => this.saveProducts();

        addBtn?.addEventListener('click', this._addHandler);
        saveBtn?.addEventListener('click', this._saveHandler);

        // Chỉ gắn 1 lần delegation nếu chưa có
        if (!this._delegatedEventsAttached) {
            tbody?.addEventListener('input', (e) => {
                const input = e.target.closest('.editable-input');
                if (input) {
                    const index = input.dataset.index;
                    const field = input.dataset.field;
                    this.products[index][field] = input.value;
                }
            });

            tbody?.addEventListener('click', (e) => {
                const btn = e.target.closest('.pm-delete-btn');
                if (btn) {
                    const index = btn.dataset.index;
                    if (confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
                        this.products.splice(index, 1);
                        this.renderProductTable();
                    }
                }
            });

            this._delegatedEventsAttached = true;
        }
    }

    static addProductRow() {
        const newProduct = { id: '', name: '', category: '', price: 0 };
        this.products.push(newProduct);
        this.renderProductTable();
    }



    static attachEditAndDeleteEvents() {
        document.querySelectorAll('.editable-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = e.target.dataset.index;
                const field = e.target.dataset.field;
                this.products[index][field] = e.target.value;
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                if (confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
                    this.products.splice(index, 1);
                    this.renderProductTable();
                    this.attachEditAndDeleteEvents();
                }
            });
        });
    }

    static saveProducts() {
        // Validate ID không được trùng
        const ids = this.products.map(p => String(p.id || '').trim());

        const hasDuplicate = ids.some((id, idx) => ids.indexOf(id) !== idx && id !== '');
        if (hasDuplicate) {
            alert('Lỗi: Có ID sản phẩm bị trùng. Vui lòng sửa lại.');
            return;
        }

        localStorage.setItem('products', JSON.stringify(this.products));
        UIManager.loadProducts();
        alert('Dữ liệu sản phẩm đã được lưu.');
    }

}

// Khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    ProductManager.init(); // chỉ 1 lần duy nhất
});


// Khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    ProductManager.init();
});


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
                            background-color: #fff;
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
                                    // alert("Nhớ lưu hoá đơn");
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
                                    // alert("Nhớ lưu hoá đơn");
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
        const branchName = document.getElementById('branch')?.value || '';

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
        const itemsString = cart.map(item => `${item.name} (${item.quantity})`).join(', ');

        console.log(branchName == "Mai Tây Hair Salon");

        if (branchName == "Mai Tây Hair Salon") {
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
                                <td>${item.name}</td>
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
        } else {
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
            background-color: #fff;
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
        .preview-header img {
            width: 200px;
            display: block;
            margin: 0 auto;
            padding-right: 20px;
        }
    </style>
</head>

<body>
    <div class="preview-header">
        <img src="/POS-HHS/Asset/Head-Logo.png" alt="Logo">
        <!-- <h2>H Hair Studio</h2> -->
        <div class="info-Salon">
            <p class="location">
                <i class="fa-solid fa-location-dot"></i> 
                86 Nguyễn An Ninh, TT.Long Thành, ĐN
            </p>
            <div class="flex">
                <p><i class="fa-brands fa-facebook"></i> H Hair Studio</p>
                <p><i class="fa-solid fa-phone"></i> 0933.261.780</p>
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
                <td>${item.name}</td>
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
        const billHTML = BillManager.generateBillHTML(datetime, branch, customer, cashier, items, payment, total);
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


    const itemsString = cart.map(item => `${item.name} (${item.quantity})`).join(', ');
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
