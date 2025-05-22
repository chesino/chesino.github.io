// --- Product Data (Hardcoded) ---
const products = [
    {
        "id": 1,
        "name": "Youtube Premium Chính Chủ",
        "duration": "1 Tháng",
        "priceroot": 79000,
        "priceNumeric": 45000,
        "warranty": "Đến khi hết hạn",
        "notes": "Youtube Premium chính chủ",
        "category": "Giải trí",
        "imageUrl": "https://placehold.co/200x200/FF0000/FFFFFF?text=Youtube"
    },
    {
        "id": 2,
        "name": "Youtube Premium Chính Chủ",
        "duration": "6 Tháng",
        "priceroot": 79000,
        "priceNumeric": 250000,
        "warranty": "Đến khi hết hạn",
        "notes": "Youtube Premium chính chủ",
        "category": "Giải trí",
        "imageUrl": "https://placehold.co/200x200/FF0000/FFFFFF?text=Youtube"
    },
    {
        "id": 3,
        "name": "Youtube Premium Chính Chủ",
        "duration": "12 Tháng",
        "priceroot": 79000,
        "priceNumeric": 450000,
        "warranty": "Đến khi hết hạn",
        "notes": "Youtube Premium chính chủ",
        "category": "Giải trí",
        "imageUrl": "https://placehold.co/200x200/FF0000/FFFFFF?text=Youtube"
    },
    {
        "id": 4,
        "name": "Key Windown 10/11 Pro",
        "duration": "Vĩnh viễn",
        "priceroot": 500000,
        "priceNumeric": 150000,
        "warranty": "Đến khi hết hạn",
        "notes": "Key kích hoạt Windows 10 & 11 Pro",
        "category": "Máy tính",
        "imageUrl": "https://placehold.co/200x200/19b1f0/FFFFFF?text=Windows"
    },
    {
        "id": 5,
        "name": "Canva Pro Chính Chủ",
        "duration": "12 Tháng",
        "priceroot": 1300000,
        "priceNumeric": 250000,
        "warranty": "Đến khi hết hạn",
        "notes": "Nâng cấp chính chủ Canva PRO, Giá 1.300.000đ/năm",
        "category": "Phần mềm",
        "imageUrl": "https://placehold.co/200x200/2591d6/FFFFFF?text=Canva"
    },
    {
        "id": 6,
        "name": "Capcut Pro Chính Chủ",
        "duration": "12 Tháng",
        "priceroot": 1500000,
        "priceNumeric": 850000,
        "warranty": "Đến khi hết hạn",
        "notes": "Capcut Pro nâng cấp chính chủ 1 năm",
        "category": "Phần mềm",
        "imageUrl": "https://placehold.co/200x200/FFFFFF/000000?text=Capcut"
    },
    {
        "id": 7,
        "name": "Capcut Pro Dùng Chung",
        "duration": "12 Tháng",
        "priceroot": 1500000,
        "priceNumeric": 200000,
        "warranty": "Đến khi hết hạn",
        "notes": "Tài khoản sẵn Capcut Pro, dùng chung",
        "category": "Phần mềm",
        "imageUrl": "https://placehold.co/200x200/FFFFFF/000000?text=Capcut"
    }
    // Add more products here if needed
];

// URL của Google Apps Script đã triển khai để nhận dữ liệu đơn hàng
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyuiJCuC1I4Es1KF9m-HheZzjtSKk8iLODZM6ahih_Q026Er_GdETbmDdIZgBRgJzMh/exec";
// Mã xác thực để gửi dữ liệu an toàn hơn (cần khớp với mã trong Google Apps Script)
const AUTH_TOKEN = "fullaccesskey456";

async function getScriptURL() {
    return WEB_APP_URL;
}

const discountCodes = [
    {
        code: "GIAM50K",
        type: "fixed", // Loại giảm giá: "fixed" (số tiền cố định) hoặc "percentage" (phần trăm)
        value: 50000, // Giá trị giảm: 50000đ
        appliesToAll: false, // Áp dụng cho tất cả sản phẩm?
        productIds: [1, 3], // ID của sản phẩm áp dụng (nếu appliesToAll là false). Sử dụng ID số của sản phẩm, không phải "P01"
        minAmount: 200000, // Số tiền tối thiểu của giỏ hàng để áp dụng mã
        maxDiscount: null // Số tiền giảm tối đa (null nếu không có giới hạn)
    },
    {
        code: "GIAM20PHANTRAM",
        type: "percentage",
        value: 0.2, // 20%
        appliesToAll: true,
        productIds: [], // Không cần nếu appliesToAll là true
        minAmount: 0,
        maxDiscount: 100000 // Giảm tối đa 100.000đ
    },
    {
        code: "FREE4ENGLISH",
        type: "fixed",
        value: 100000, // Giảm 100k, ví dụ cho sản phẩm 4English
        appliesToAll: false,
        productIds: [1], // Chỉ áp dụng cho 4English (ID 1)
        minAmount: 500000,
        maxDiscount: null
    }
];

// --- DOM Elements ---
const productListDiv = document.getElementById('product-list');
// Desktop Filter/Sort Elements
const searchInputDesktop = document.getElementById('search-input');
const categoryFilterSelectDesktop = document.getElementById('category-filter');
const sortSelectDesktop = document.getElementById('sort-select');
// Mobile Filter/Sort Elements
const searchInputMobile = document.getElementById('search-input-mobile');
const categoryFilterSelectMobile = document.getElementById('category-filter-mobile');
const sortSelectMobile = document.getElementById('sort-select-mobile');

const cartIcon = document.getElementById('cart-icon');
const cartCountSpan = document.getElementById('cart-count');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsDropdownDiv = document.getElementById('cart-items-dropdown');
const cartTotalDropdownSpan = document.getElementById('cart-total-dropdown');
// Renamed button in dropdown to go directly to checkout view (step 1)
const goToCheckoutBtnDropdown = document.getElementById('go-to-checkout-btn-dropdown');


// View Sections
const productListView = document.getElementById('product-list-view');
// Cart View is now integrated into Checkout View as Step 1
// const cartView = document.getElementById('cart-view');
const checkoutView = document.getElementById('checkout-view'); // This now contains all checkout steps
const sidebar = document.getElementById('sidebar');
const mobileFilterBar = document.getElementById('mobile-filter-bar');

// Product List View Elements
const noProductsMessage = document.getElementById('no-products-message');

// Checkout View Elements (All steps are children of #checkout-view)
const checkoutSteps = document.querySelectorAll('#checkout-view > div'); // Select all direct children div of checkout-view
const stepIndicators = document.querySelectorAll('#checkout-view .flex > div'); // Step indicator elements

// Step 1 Elements (Cart View + Codes)
const checkoutStep1 = document.getElementById('checkout-step-1'); // The new step 1 div
const cartItemsListDiv = checkoutStep1.querySelector('#cart-items-list'); // Get elements within step 1
const cartEmptyMessageDiv = checkoutStep1.querySelector('#cart-empty-message');
const cartSummaryArea = checkoutStep1.querySelector('#cart-summary-area');
const cartTotalSpan = checkoutStep1.querySelector('#cart-total');
const continueShoppingBtn = checkoutStep1.querySelector('#continue-shopping-btn');
const goShoppingFromCartBtn = checkoutStep1.querySelector('#go-shopping-from-cart');
const discountCodeInput = checkoutStep1.querySelector('#discount-code');
const applyCodesBtn = checkoutStep1.querySelector('#apply-codes-btn');
const discountMessage = checkoutStep1.querySelector('#discount-message');
const nextStep2Btn = checkoutStep1.querySelector('#next-step-2-btn'); // Button to move from step 1 to 2


// Step 2 Elements (Recipient Info)
const checkoutStep2 = document.getElementById('checkout-step-2'); // The new step 2 div
const recipientNameInput = checkoutStep2.querySelector('#recipient-name');
const recipientEmailInput = checkoutStep2.querySelector('#recipient-email');
const orderNotesInput = checkoutStep2.querySelector('#order-notes');
const prevStep1Btn = checkoutStep2.querySelector('#prev-step-1-btn'); // Button to move from step 2 to 1
const nextStep3Btn = checkoutStep2.querySelector('#next-step-3-btn'); // Button to move from step 2 to 3


// Step 3 Elements (Payment Method Selection)
const checkoutStep3 = document.getElementById('checkout-step-3'); // The new step 3 div
const prevStep2Btn = checkoutStep3.querySelector('#prev-step-2-btn'); // Button to move from step 3 to 2
const completeOrderBtn = checkoutStep3.querySelector('#complete-order-btn'); // Button to move from step 3 to 4


// Step 4 Elements (Order Confirmation)
const checkoutStep4 = document.getElementById('checkout-step-4'); // The new step 4 div
const orderIdSpan = checkoutStep4.querySelector('#order-id');
const orderIdInInstructionSpan = checkoutStep4.querySelector('#order-id-in-instruction');
const paymentInstructionsDiv = checkoutStep4.querySelector('#payment-instructions');
const paymentQrImg = checkoutStep4.querySelector('#payment-qr-img');
const paymentAccountInfoP = checkoutStep4.querySelector('#payment-account-info');
const backToHomeBtnCheckout = checkoutStep4.querySelector('#back-to-home-btn-checkout');


// Global Elements
const messageBox = document.getElementById('message-box');
const messageBoxText = document.getElementById('message-box-text');
const navLinks = document.querySelectorAll('.nav-link');


// --- State Variables ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentStep = 1; // Current step within the checkout process (1 to 4)
let currentOrder = {}; // To store order details during checkout (simulated)
let appliedDiscount = 0; // Simulated applied discount amount

const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileNavLinks) {
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const viewId = event.currentTarget.dataset.view;
            if (viewId) {
                showView(viewId);
            }
        });
    });
}


// --- Helper Functions ---

// Format price to VND (e.g., 560.000đ)
function formatPrice(price) {
    if (typeof price !== 'number') {
        const priceStr = String(price).toLowerCase().replace(/\s/g, '');
        if (priceStr.endsWith('k')) {
            price = parseFloat(priceStr) * 1000;
        } else {
            price = parseFloat(priceStr);
        }
        if (isNaN(price)) return 'N/A';
    }
    return price.toLocaleString('vi-VN') + 'đ';
}

// Calculate total cart amount including simulated discounts
function calculateCartTotal() {
    let total = cart.reduce((sum, item) => sum + item.priceNumeric * item.quantity, 0);

    // Apply simulated discount
    total -= appliedDiscount;

    // Ensure total is not negative
    return Math.max(0, total);
}


// Show a temporary message box
function showMessage(message, duration = 3000, isError = false) {
    messageBoxText.textContent = message;
    messageBox.classList.remove('hidden', 'bg-blue-500', 'bg-red-500');
    messageBox.classList.add(isError ? 'bg-red-500' : 'bg-blue-500');

    messageBox.style.opacity = '1';
    messageBox.style.transition = 'opacity 0.3s ease-in-out';

    setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300);
    }, duration);
}


// --- Render Functions ---

// Render products to the list
function renderProducts(productsToRender) {
    productListDiv.innerHTML = '';
    if (productsToRender.length === 0) {
        noProductsMessage.classList.remove('hidden');
        return;
    }
    noProductsMessage.classList.add('hidden');

    productsToRender.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden', 'transform', 'hover:scale-103', 'transition-transform', 'duration-200', 'ease-in-out', 'flex', 'flex-col');
        productElement.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-2 flex-grow">Thời hạn: ${product.duration}</p>
                <p class="text-gray-600 text-sm mb-2 flex-grow">Bảo hành: ${product.warranty}</p>
                <div class="flex items-center justify-between mt-auto">
                    <p class="text-blue-600 text-xl font-bold">${formatPrice(product.priceNumeric)}</p>
                     <button class="add-to-cart-btn bg-blue-600 text-white text-sm py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm" data-id="${product.id}">
                        <i class="fa-solid fa-circle-plus"></i>
                     </button>
                </div>
            </div>
        `;
        productListDiv.appendChild(productElement);
    });
}

// Populate category filter options for both desktop and mobile selects
function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category))];
    const optionsHtml = '<option value="all">Tất cả</option>' + categories.map(category => {
        if (category) {
            return `<option value="${category}">${category}</option>`;
        }
        return '';
    }).join('');

    if (categoryFilterSelectDesktop) categoryFilterSelectDesktop.innerHTML = optionsHtml;
    if (categoryFilterSelectMobile) categoryFilterSelectMobile.innerHTML = '<option value="all">Danh mục</option>' + optionsHtml;
}

// Update cart count icon and totals
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.textContent = count;

    const total = calculateCartTotal(); // Use calculated total
    if (cartTotalSpan) cartTotalSpan.textContent = formatPrice(total);
    if (cartTotalDropdownSpan) cartTotalDropdownSpan.textContent = formatPrice(total);

    // Enable/disable checkout button (now next-step-2-btn in step 1) based on cart count
    if (count > 0) {
        if (nextStep2Btn) {
            nextStep2Btn.disabled = false; // Use nextStep2Btn from step 1
            nextStep2Btn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
        }
        if (cartEmptyMessageDiv) cartEmptyMessageDiv.classList.add('hidden');
        if (cartSummaryArea) cartSummaryArea.classList.remove('hidden');
    } else {
        if (nextStep2Btn) {
            nextStep2Btn.disabled = true; // Use nextStep2Btn from step 1
            nextStep2Btn.classList.add('disabled:opacity-50', 'disabled:cursor-not-allowed');
        }
        if (cartEmptyMessageDiv) cartEmptyMessageDiv.classList.remove('hidden');
        if (cartSummaryArea) cartSummaryArea.classList.add('hidden');

        // Reset discount/referral if cart becomes empty
        appliedDiscount = 0;
        // appliedReferral = null; // Removed referral logic
        updateDiscountReferralDisplay(); // Clear messages in step 1 if visible
    }
}

// Render cart items in the dropdown
function renderCartDropdown() {
    if (!cartItemsDropdownDiv) return; // Check if element exists

    cartItemsDropdownDiv.innerHTML = '';
    if (cart.length === 0) {
        cartItemsDropdownDiv.textContent = 'Giỏ hàng trống';
        if (cartTotalDropdownSpan) cartTotalDropdownSpan.textContent = '0đ';
        return;
    }
    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-100', 'last:border-b-0');
        itemElement.innerHTML = `
            <span class="text-sm text-gray-800">${item.name} x ${item.quantity}</span>
            <span class="text-sm font-semibold text-gray-800">${formatPrice(item.priceNumeric * item.quantity)}</span>
        `;
        cartItemsDropdownDiv.appendChild(itemElement);
        total += item.priceNumeric * item.quantity;
    });
    if (cartTotalDropdownSpan) cartTotalDropdownSpan.textContent = formatPrice(calculateCartTotal()); // Use calculated total
}

// Render cart items in the main cart view (Now part of Step 1)
function renderCartView() {
    if (!cartItemsListDiv) {
        console.error("cartItemsListDiv not found for rendering cart view."); // LOG
        return;
    }

    cartItemsListDiv.innerHTML = '';
    if (cart.length === 0) {
        // Handled by updateCartCount
        if (cartTotalSpan) cartTotalSpan.textContent = '0đ';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('flex', 'flex-col', 'md:flex-row', 'items-center', 'border-b', 'border-gray-200', 'py-4', 'last:border-b-0');
        itemElement.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md mr-0 md:mr-4 mb-4 md:mb-0 border border-gray-200">
            <div class="flex-grow text-center md:text-left mb-4 md:mb-0">
                <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                <p class="text-gray-600 text-sm">${item.duration} | Bảo hành: ${item.warranty}</p>
                <p class="text-blue-600 font-bold mt-1">${formatPrice(item.priceNumeric)}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button class="update-quantity-btn bg-gray-200 text-gray-700 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors duration-200" data-id="${item.id}" data-action="decrease">-</button>
                <span class="px-3 py-1 border-t border-b border-gray-200 bg-gray-50 rounded-md">${item.quantity}</span>
                <button class="update-quantity-btn bg-gray-200 text-gray-700 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors duration-200" data-id="${item.id}" data-action="increase">+</button>
                <button class="remove-from-cart-btn text-red-600 ml-4 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-100" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsListDiv.appendChild(itemElement);
        total += item.priceNumeric * item.quantity;
    });
    if (cartTotalSpan) cartTotalSpan.textContent = formatPrice(calculateCartTotal()); // Use calculated total
}

// Render order summary in checkout step 1 (Now part of Step 1's display)
// This function is now primarily used to update the summary section within Step 1
function renderOrderSummaryStep1() {
    // The summary is already integrated into renderCartView and updateCartCount
    // This function can be used to specifically update the total area if needed after code application
    updateCartCount(); // This will update the total display in step 1
    updateDiscountReferralDisplay(); // Ensure messages are shown/hidden
}

// Update display messages for discount/referral codes
function updateDiscountReferralDisplay() {
    if (discountMessage) {
        if (appliedDiscount > 0) {
            discountMessage.textContent = `Đã áp dụng giảm giá: -${formatPrice(appliedDiscount)}`;
            discountMessage.classList.remove('hidden');
        } else {
            discountMessage.classList.add('hidden');
        }
    }
    // Không còn xử lý referralMessage
}


// --- Cart Logic ---

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        renderCartDropdown();
        showMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
    }
}

// Remove product from cart
function removeFromCart(productId) {
    const initialCartLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    if (cart.length < initialCartLength) {
        saveCart();
        updateCartCount();
        renderCartDropdown();
        // If currently in checkout step 1, re-render the cart view
        if (currentStep === 1 && document.getElementById('checkout-view').classList.contains('active')) {
            renderCartView();
        }
        // Update summary display if in step 1
        if (currentStep === 1 && document.getElementById('checkout-view').classList.contains('active')) {
            renderOrderSummaryStep1();
        }
        showMessage("Đã xóa sản phẩm khỏi giỏ hàng.");
    }
}

// Update item quantity in cart
function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                removeFromCart(productId);
                return;
            }
        }
        saveCart();
        updateCartCount();
        renderCartDropdown();
        // If currently in checkout step 1, re-render the cart view
        if (currentStep === 1 && document.getElementById('checkout-view').classList.contains('active')) {
            renderCartView();
        }
        // Update summary display if in step 1
        if (currentStep === 1 && document.getElementById('checkout-view').classList.contains('active')) {
            renderOrderSummaryStep1();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// --- View Management ---

// Show a specific view section (product list or checkout)

function showView(viewId) {
    // Ẩn tất cả view-section bằng cách xóa class active
    document.querySelectorAll('.view-section').forEach(section => section.classList.remove('active'));

    // Ẩn bộ lọc
    if (sidebar) sidebar.classList.add('hidden');
    if (mobileFilterBar) mobileFilterBar.classList.add('hidden');

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');

        if (viewId === 'product-list-view') {
            if (window.innerWidth >= 768) {
                if (sidebar) sidebar.classList.remove('hidden');
                if (mobileFilterBar) mobileFilterBar.classList.add('hidden');
            } else {
                if (sidebar) sidebar.classList.add('hidden');
                if (mobileFilterBar) mobileFilterBar.classList.remove('hidden');
            }
            applyFiltersAndSort();
        } else if (viewId === 'checkout-view') {
            // Khi chuyển sang thanh toán, reset về bước 1
            currentStep = 1;
            showCheckoutStep(currentStep);

            // Reset mã giảm giá
            if (discountCodeInput) discountCodeInput.value = '';
            appliedDiscount = 0;
            updateDiscountReferralDisplay();
        }
    } else {
        console.error("Không tìm thấy view:", viewId);
    }

    // Cập nhật trạng thái active cho các nav-link nếu có
    if (navLinks) {
        navLinks.forEach(link => {
            if (link.dataset.view === viewId) {
                link.classList.add('font-bold');
            } else {
                link.classList.remove('font-bold');
            }
        });
    }
}


// Show a specific checkout step and update step indicator
function showCheckoutStep(step) {
    if (!checkoutSteps || checkoutSteps.length === 0) {
        console.error("Checkout steps elements not found.");
        return;
    }

    checkoutSteps.forEach(s => s.classList.remove('active'));
    const targetStepElement = document.getElementById(`checkout-step-${step}`);
    if (targetStepElement) {
        targetStepElement.classList.add('active');
    }
    else {
        console.error("Invalid checkout step element not found:", step);
        // Fallback to step 1 or product list view
        showView('product-list-view');
        return;
    }


    // Update step indicator
    if (stepIndicators) {
        stepIndicators.forEach((indicator, index) => {
            // Index is 0-based, steps are 1-based
            if (index < step) {
                indicator.classList.remove('border-gray-300', 'text-gray-600');
                indicator.classList.add('border-blue-600', 'text-blue-600');
            } else {
                indicator.classList.remove('border-blue-600', 'text-blue-600');
                indicator.classList.add('border-gray-300', 'text-gray-600');
            }
        });
    }


    // Specific actions for each step
    if (step === 1) {
        renderCartView(); // Ensure cart view is rendered in step 1
        updateCartCount(); // Ensure totals and button state are correct
        renderOrderSummaryStep1(); // Render summary area in step 1
    } else if (step === 2) {
        // No specific render needed, just show the form
    } else if (step === 3) {
        // No specific render needed, just show payment options
    } else if (step === 4) { // Final confirmation step
        const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
        const paymentMethod = paymentMethodElement ? paymentMethodElement.value : 'unknown'; // Handle case where none is checked
        currentOrder.paymentMethod = paymentMethod;

        currentOrder.orderId = formatName(currentOrder.recipientInfo.name) + ' ' + Math.random().toString(36).slice(2, 10).toUpperCase();  // Ví dụ: 'X3GK8VZL'
        if (orderIdSpan) orderIdSpan.textContent = currentOrder.orderId;
        if (orderIdInInstructionSpan) orderIdInInstructionSpan.textContent = currentOrder.orderId;


        if (paymentMethod === 'qr') {
            if (paymentQrImg) paymentQrImg.src = `https://img.vietqr.io/image/970454-99MM24030M09540726-qr_only.png?amount=${currentOrder.totalAmount}&addInfo=${currentOrder.orderId}`;
            if (paymentAccountInfoP) {
                paymentAccountInfoP.innerHTML = `
                  <strong>Ngân hàng:</strong> VietCapitalBank Bank<br>
                  <strong>Số tài khoản:</strong> 
                  <span id="momo-id">99MM24030M09540726</span>
                  <i id="copy-momo" class="fas fa-copy" style="cursor:pointer; margin-left:6px;"></i><br>
                  <strong>Tên tài khoản:</strong> MOMO_DINH MANH HUNG <br>
                  <strong>Nội dung:</strong> ${currentOrder.orderId} <i id="copy-orderId" class="fas fa-copy" style="cursor:pointer; margin-left:6px;"></i>

                `;
            }
            if (paymentQrImg) paymentQrImg.classList.remove('hidden');
        } else if (paymentMethod === 'momo') {
            if (paymentQrImg) paymentQrImg.src = `https://img.vietqr.io/image/970454-99MM24030M09540726-qr_only.png?amount=${currentOrder.totalAmount}&addInfo=${currentOrder.orderId}`;
            if (paymentAccountInfoP) {
                paymentAccountInfoP.innerHTML = `
                  <strong>Ngân hàng:</strong> VietCapitalBank Bank<br>
                  <strong>Số tài khoản:</strong> 
                  <span id="momo-id">99MM24030M09540726</span>
                  <i id="copy-momo" class="fas fa-copy" style="cursor:pointer; margin-left:6px;"></i><br>
                  <strong>Tên tài khoản:</strong> MOMO_DINH MANH HUNG <br>
                  <strong>Nội dung:</strong> ${currentOrder.orderId} <i id="copy-orderId" class="fas fa-copy" style="cursor:pointer; margin-left:6px;"></i>
                `;
            }
            if (paymentQrImg) paymentQrImg.classList.remove('hidden');
        } else {
            if (paymentQrImg) paymentQrImg.classList.add('hidden');
            if (paymentAccountInfoP) paymentAccountInfoP.textContent = "Không có thông tin thanh toán.";
        }

        const icon = document.getElementById("copy-momo");
        icon.onclick = () => {
            navigator.clipboard.writeText(document.getElementById("momo-id").innerText);
            icon.classList.replace("fa-copy", "fa-check");
            setTimeout(() => icon.classList.replace("fa-check", "fa-copy"), 1500);
        };

        const copyIcon = document.getElementById("copy-orderId");
        copyIcon.onclick = () => {
            navigator.clipboard.writeText(currentOrder.orderId);
            copyIcon.classList.replace("fa-copy", "fa-check");
            setTimeout(() => copyIcon.classList.replace("fa-check", "fa-copy"), 1500);
        };

        // Gửi đơn hàng đến Google Sheet
        sendOrderToGoogleSheet(currentOrder);

        // Simulate clearing cart after "placing" order
        cart = [];
        saveCart();
        updateCartCount();
        renderCartDropdown();
        // Reset discount state after order completion
        appliedDiscount = 0;
        updateDiscountReferralDisplay(); // Clear messages
    }
}

function formatName(name) {
    // Bước 1: Chuẩn hóa unicode và loại bỏ dấu
    let normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Bước 2: Loại bỏ emoji và các ký tự đặc biệt, chỉ giữ a-z A-Z và khoảng trắng
    normalized = normalized.replace(/[^a-zA-Z\s]/g, "");

    // Bước 3: Chuẩn hóa khoảng trắng dư thừa và chuyển về thường
    normalized = normalized.trim().replace(/\s+/g, " ").toLowerCase();

    // Bước 4: Cắt lấy cụm từ cuối cùng tối đa 10 ký tự
    const words = normalized.split(" ");
    let result = "";

    // Duyệt từ cuối lên để lấy cụm từ cuối cùng đủ tối đa 10 ký tự
    for (let i = words.length - 1; i >= 0; i--) {
        const word = words[i];
        if ((word + " " + result).trim().length <= 10) {
            result = word + " " + result;
        } else {
            break;
        }
    }

    return result.trim();
}



/**
 * Gửi dữ liệu đơn hàng đến Google Sheet thông qua Google Apps Script.
 * @param {object} orderData Đối tượng chứa thông tin đơn hàng.
 */
async function sendOrderToGoogleSheet(orderData) {
    // Định dạng ngày giờ kiểu Việt Nam
    function formatDate(datetime) {
        const dateObj = new Date(datetime);
        const time = dateObj.toLocaleTimeString("vi-VN", { hour12: false });
        const date = dateObj.toLocaleDateString("vi-VN");
        return `${time} ${date}`;
    }

    const itemsSummary = orderData.items.map(item => `${item.name} (x${item.quantity})`).join('; ');
    const formattedTimestamp = formatDate(orderData.orderTimestamp);

    // Sử dụng AUTH_TOKEN đã khai báo toàn cục
    if (!AUTH_TOKEN) {
        await Swal.fire({
            icon: 'warning',
            title: 'Thiếu mã xác thực',
            text: 'Không tìm thấy AUTH_TOKEN. Vui lòng kiểm tra cấu hình.',
            confirmButtonText: 'OK'
        });
        return;
    }

    const dataToSend = {
        orderId: orderData.orderId,
        timestamp: formattedTimestamp,
        customerName: orderData.recipientInfo.name,
        customerEmail: orderData.recipientInfo.email || '',
        customerMessenger: orderData.recipientInfo.messenger || '',
        totalAmount: orderData.totalAmount,
        discountAmount: orderData.discountAmount,
        paymentMethod: orderData.paymentMethod,
        items: orderData.items.map(item => item.name).join('; '),  // chỉ tên sản phẩm, ngăn cách bằng dấu chấm phẩy
        notes: orderData.recipientInfo.notes || '',
        status: "Chờ thanh toán",
        token: AUTH_TOKEN,
        sheet: "Order"
    };



    function jsonToQueryString(json) {
        return Object.keys(json)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
            .join('&');
    }

    const queryString = jsonToQueryString(dataToSend);

    try {
        const scriptURL = await getScriptURL(); // Phải định nghĩa sẵn hàm này để trả URL Web App
        if (!scriptURL) return;

        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: queryString
        });

        if (response.ok) {
            showMessage("Đơn hàng đã được gửi thành công!", 3000);
        } else {
            const text = await response.text();
            console.error("Lỗi khi gửi đơn hàng:", text);
            showMessage(`Lỗi: Không thể gửi đơn hàng. ${text}`, 5000, true);
        }
    } catch (error) {
        console.error("Lỗi mạng hoặc server:", error);
        showMessage("Lỗi kết nối: Không thể gửi đơn hàng. Vui lòng thử lại.", 5000, true);
    }
}



// --- Filter and Sort Logic ---

// Apply current filters and sort to products
function applyFiltersAndSort() {
    let filteredProducts = [...products];

    const isMobile = window.innerWidth < 768;
    const currentSearchInput = isMobile ? searchInputMobile : searchInputDesktop;
    const currentCategorySelect = isMobile ? categoryFilterSelectMobile : categoryFilterSelectDesktop;
    const currentSortSelect = isMobile ? sortSelectMobile : sortSelectDesktop;

    if (!currentSearchInput || !currentCategorySelect || !currentSortSelect) {
        renderProducts(products); // Render all products as fallback
        return;
    }


    const searchTerm = currentSearchInput.value.toLowerCase();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    const selectedCategory = currentCategorySelect.value;
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );
    }

    const sortValue = currentSortSelect.value;
    filteredProducts.sort((a, b) => {
        if (sortValue === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (sortValue === 'name-desc') {
            return b.name.localeCompare(a.name);
        } else if (sortValue === 'price-asc') {
            return a.priceNumeric - b.priceNumeric;
        } else if (sortValue === 'price-desc') {
            return b.priceNumeric - a.priceNumeric;
        }
        return 0;
    });

    renderProducts(filteredProducts);
}

// --- Event Listeners ---

// Navigation links (only Product List remains)
if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const viewId = event.target.dataset.view;
            if (viewId) {
                showView(viewId);
            }
        });
    });
}


// Add to Cart button listener (delegation)
if (productListDiv) {
    productListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.dataset.id);
            addToCart(productId);
        }
    });
}


// Search input listeners (both desktop and mobile)
if (searchInputDesktop) searchInputDesktop.addEventListener('input', applyFiltersAndSort);
if (searchInputMobile) searchInputMobile.addEventListener('input', applyFiltersAndSort);

// Category filter listeners (both desktop and mobile)
if (categoryFilterSelectDesktop) categoryFilterSelectDesktop.addEventListener('change', applyFiltersAndSort);
if (categoryFilterSelectMobile) categoryFilterSelectMobile.addEventListener('change', applyFiltersAndSort);

// Sort select listeners (both desktop and mobile)
if (sortSelectDesktop) sortSelectDesktop.addEventListener('change', applyFiltersAndSort);
if (sortSelectMobile) sortSelectMobile.addEventListener('change', applyFiltersAndSort);


// Cart icon click listener (toggle dropdown)
if (cartIcon) {
    cartIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (cartDropdown) {
            cartDropdown.classList.toggle('hidden');
            if (!cartDropdown.classList.contains('hidden')) {
                setTimeout(() => {
                    cartDropdown.classList.remove('scale-95', 'opacity-0');
                    cartDropdown.classList.add('scale-100', 'opacity-100');
                }, 10);
            } else {
                cartDropdown.classList.remove('scale-100', 'opacity-100');
                cartDropdown.classList.add('scale-95', 'opacity-0');
            }
        }
    });
}


// Hide dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (cartIcon && cartDropdown && !cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
        cartDropdown.classList.add('hidden');
        cartDropdown.classList.remove('scale-100', 'opacity-100');
        cartDropdown.classList.add('scale-95', 'opacity-0');
    }
});


// Go to Checkout button listener (in dropdown - now goes to checkout view step 1)
if (goToCheckoutBtnDropdown) { // Check if element exists
    goToCheckoutBtnDropdown.addEventListener('click', () => {
        showView('checkout-view'); // Go to the checkout view
        if (cartDropdown) {
            cartDropdown.classList.add('hidden'); // Hide dropdown
            cartDropdown.classList.remove('scale-100', 'opacity-100');
            cartDropdown.classList.add('scale-95', 'opacity-0');
        }
    });
}

// Remove/Update quantity button listeners (delegation in cart view - now part of Step 1)
if (cartItemsListDiv) { // Check if element exists
    cartItemsListDiv.addEventListener('click', (event) => {
        const target = event.target;
        const button = target.closest('.remove-from-cart-btn') || target.closest('.update-quantity-btn');

        if (button) {
            const productId = parseInt(button.dataset.id);
            if (button.classList.contains('remove-from-cart-btn')) {
                removeFromCart(productId);
            } else if (button.classList.contains('update-quantity-btn')) {
                const action = button.dataset.action;
                updateQuantity(productId, action);
            }
        }
    });
}

// Go Shopping from Empty Cart button (in Step 1)
if (goShoppingFromCartBtn) { // Check if element exists
    goShoppingFromCartBtn.addEventListener('click', () => {
        showView('product-list-view');
    });
}

// Continue Shopping button (in Step 1)
if (continueShoppingBtn) { // Check if element exists
    continueShoppingBtn.addEventListener('click', () => {
        showView('product-list-view');
    });
}


// --- Checkout Step Navigation ---

// Step 1: Apply Codes button
if (applyCodesBtn && discountCodeInput && discountMessage) {
    applyCodesBtn.addEventListener('click', () => {
        const inputCode = discountCodeInput.value.trim().toUpperCase();
        appliedDiscount = 0; // Reset previous discount

        if (!inputCode) {
            showMessage("Vui lòng nhập mã giảm giá.", 3000, true);
            updateDiscountReferralDisplay(); // Xóa thông báo giảm giá cũ nếu có
            return;
        }

        const foundCode = discountCodes.find(c => c.code === inputCode);

        if (!foundCode) {
            showMessage(`Mã giảm giá "${inputCode}" không hợp lệ.`, 3000, true);
            updateDiscountReferralDisplay();
            return;
        }

        const subtotal = cart.reduce((sum, item) => item.priceNumeric * item.quantity, 0);

        // Kiểm tra sản phẩm áp dụng
        if (!foundCode.appliesToAll && foundCode.productIds && foundCode.productIds.length > 0) {
            const validItemsInCart = cart.some(item => foundCode.productIds.includes(item.id));
            if (!validItemsInCart) {
                showMessage("Mã này không áp dụng cho bất kỳ sản phẩm nào trong giỏ hàng của bạn.", 4000, true);
                updateDiscountReferralDisplay();
                return;
            }
        }

        // Tính toán số tiền giảm giá
        let applicableSubtotal = 0;
        if (foundCode.appliesToAll) {
            // Nếu áp dụng cho tất cả, tính tổng từ toàn bộ giỏ hàng
            applicableSubtotal = cart.reduce((sum, item) => sum + item.priceNumeric * item.quantity, 0);
        } else {
            // Nếu áp dụng cho sản phẩm cụ thể, chỉ tính tổng từ các sản phẩm đó
            applicableSubtotal = cart.filter(item => foundCode.productIds && foundCode.productIds.includes(item.id))
                .reduce((sum, item) => sum + item.priceNumeric * item.quantity, 0);
        }

        // Kiểm tra giá trị tối thiểu dựa trên applicableSubtotal
        if (applicableSubtotal < foundCode.minAmount) {
            showMessage(`Giá trị các sản phẩm đủ điều kiện cần tối thiểu ${formatPrice(foundCode.minAmount)} để áp dụng mã này.`, 4000, true);
            updateDiscountReferralDisplay();
            return;
        }

        // Tiếp tục phần tính discountAmount như bạn đã sửa đổi trước đó
        let discountAmount = 0;
        if (foundCode.type === "fixed") {
            discountAmount = foundCode.value;
            if (discountAmount > applicableSubtotal) {
                discountAmount = applicableSubtotal;
            }
        } else if (foundCode.type === "percentage") {
            discountAmount = applicableSubtotal * foundCode.value;
        }

        // Áp dụng giảm giá tối đa nếu có
        if (foundCode.maxDiscount !== null && discountAmount > foundCode.maxDiscount) {
            discountAmount = foundCode.maxDiscount;
        }

        appliedDiscount = discountAmount;
        showMessage(`Áp dụng mã "${inputCode}" thành công! Giảm ${formatPrice(appliedDiscount)}.`, 3000);

        // Cập nhật hiển thị sau khi áp dụng mã
        updateCartCount(); // Cập nhật tổng tiền giỏ hàng
        updateDiscountReferralDisplay(); // Hiển thị thông báo giảm giá
    });
}

// Next Step 2 button (from Step 1 to Step 2)
if (nextStep2Btn) { // Check if element exists
    nextStep2Btn.addEventListener('click', () => {
        // Check if cart is empty before proceeding
        if (cart.length === 0) {
            showMessage("Giỏ hàng trống, không thể tiếp tục thanh toán.", 3000, true);
            return;
        }

        currentStep = 2;
        showCheckoutStep(currentStep);
    });
}


// Previous Step 1 button (from Step 2 to Step 1)
if (prevStep1Btn) { // Check if element exists
    prevStep1Btn.addEventListener('click', () => {
        currentStep = 1;
        showCheckoutStep(currentStep);
    });
}


// Next Step 3 button (from Step 2 to Step 3 - Payment Method Selection)
if (nextStep3Btn && recipientNameInput) {
    nextStep3Btn.addEventListener('click', () => {
        const recipientName = recipientNameInput.value.trim();
        const orderNotes = orderNotesInput ? orderNotesInput.value.trim() : '';

        const useMessenger = toggle.checked;
        const recipientEmailInputGroup = document.getElementById('recipient-email');
        const recipientMessengerInputGroup = document.getElementById('recipient-messenger');
        const recipientEmail = recipientEmailInputGroup ? recipientEmailInputGroup.value.trim() : '';
        const recipientMessenger = recipientMessengerInputGroup ? recipientMessengerInputGroup.value.trim() : '';

        if (!recipientName) {
            showMessage("Vui lòng điền Tên người nhận.", 3000, true);
            return;
        }

        if (useMessenger) {
            if (!recipientMessenger) {
                showMessage("Vui lòng nhập liên kết Facebook/Messenger.", 3000, true);
                return;
            }
            // Optionally, validate URL:
            const urlRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|m\.me|fb\.com)\/.+$/i;
            if (!urlRegex.test(recipientMessenger)) {
                showMessage("Định dạng liên kết Messenger không hợp lệ.", 3000, true);
                return;
            }
        } else {
            if (!recipientEmail) {
                showMessage("Vui lòng nhập Email.", 3000, true);
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(recipientEmail)) {
                showMessage("Định dạng Email không hợp lệ.", 3000, true);
                return;
            }
        }

        // Lưu thông tin người nhận
        currentOrder.recipientInfo = {
            name: recipientName,
            email: useMessenger ? null : recipientEmail,
            messenger: useMessenger ? recipientMessenger : null,
            notes: orderNotes
        };

        currentStep = 3;
        showCheckoutStep(currentStep);
    });
}


// Previous Step 2 button (from Step 3 to Step 2)
if (prevStep2Btn) { // Check if element exists
    prevStep2Btn.addEventListener('click', () => {
        currentStep = 2;
        showCheckoutStep(currentStep);
    });
}


// Complete Order button (from Step 3 to Step 4 - Confirmation)
if (completeOrderBtn) { // Check if element exists
    completeOrderBtn.addEventListener('click', () => {
        // Get selected payment method
        const paymentMethodElement = document.querySelector('input[name="payment-method"]:checked');
        if (!paymentMethodElement) {
            showMessage("Vui lòng chọn phương thức thanh toán.", 3000, true);
            return;
        }
        const paymentMethod = paymentMethodElement.value;
        currentOrder.paymentMethod = paymentMethod;


        // Collect all order details for simulation
        currentOrder.items = cart;
        currentOrder.subtotal = cart.reduce((sum, item) => sum + item.priceNumeric * item.quantity, 0);
        currentOrder.discountAmount = appliedDiscount;
        currentOrder.totalAmount = calculateCartTotal();
        currentOrder.orderTimestamp = new Date().toISOString(); // ISO format timestamp

        // Simulate placing order by going to step 4
        // No actual backend call happens here
        // console.log("Simulated Order Placed:", currentOrder); // LOG

        currentStep = 4; // Move to the final confirmation step
        showCheckoutStep(currentStep);

        // Cart clearing and order ID generation moved into showCheckoutStep(4)
        // Discount state reset moved into showCheckoutStep(4)
    });
}


// Back to Home button (in step 4)
if (backToHomeBtnCheckout) { // Check if element exists
    backToHomeBtnCheckout.addEventListener('click', () => {
        // Reset checkout state and go back to product list
        currentOrder = {};
        // Clear input fields in step 2 for next order
        if (recipientNameInput) recipientNameInput.value = '';
        if (recipientEmailInput) recipientEmailInput.value = '';
        if (orderNotesInput) orderNotesInput.value = '';

        showView('product-list-view');
    });
}

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    if (document.getElementById('product-list-view').classList.contains('active')) {
        if (window.innerWidth >= 768) {
            if (sidebar) sidebar.classList.remove('hidden');
            if (mobileFilterBar) mobileFilterBar.classList.add('hidden');
        } else {
            if (sidebar) sidebar.classList.add('hidden');
            if (mobileFilterBar) mobileFilterBar.classList.remove('hidden');
        }
    }
});


// --- Initialization ---
window.onload = function () {
    // Products are hardcoded
    populateCategoryFilter();
    applyFiltersAndSort(); // Initial render of products

    // Initialize cart display
    updateCartCount();
    renderCartDropdown();

    // Ensure product list view is active initially and filter bars are set correctly
    showView('product-list-view');

    // initData(); // Removed this as discount codes are now hardcoded
};


const checkOrderBtn = document.getElementById('check-order-btn');
const orderCodeInput = document.getElementById('order-code-input');
const orderResultDiv = document.getElementById('order-result');

// Hàm lấy class màu cho trạng thái đơn hàng
function getStatusClass(status) {
    const s = status?.toLowerCase() || '';

    if (['đã huỷ', 'hủy', 'đã hủy'].includes(s)) {
        return 'text-red-700 bg-red-100';
    } else if (['chờ thanh toán', 'chờ xác nhận thanh toán'].includes(s)) {
        return 'text-yellow-800 bg-yellow-100';
    } else if (['đã thanh toán', 'đang hoạt động'].includes(s)) {
        return 'text-green-700 bg-green-100';
    } else {
        return 'text-gray-700 bg-gray-100';
    }
}


if (checkOrderBtn && orderCodeInput && orderResultDiv) {
    checkOrderBtn.addEventListener('click', async () => {
        const rawInput = orderCodeInput.value.trim();

        if (!rawInput) {
            showMessage("Vui lòng nhập mã đơn hàng để kiểm tra.", 3000, true);
            return;
        }

        // Tách mã đơn theo dấu phẩy, tối đa 5 mã, lọc bỏ rỗng, trim khoảng trắng
        let codes = rawInput.split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0)
            .slice(0, 5);

        if (codes.length === 0) {
            showMessage("Vui lòng nhập ít nhất một mã đơn hợp lệ.", 3000, true);
            return;
        }

        checkOrderBtn.disabled = true;
        checkOrderBtn.textContent = "Đang kiểm tra...";
        orderResultDiv.classList.add('hidden');
        orderResultDiv.innerHTML = ''; // reset kết quả cũ

        try {
            const url = `${WEB_APP_URL}?sheet=Order&token=${AUTH_TOKEN}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Không thể tải dữ liệu đơn hàng");

            const orders = await res.json();

            let htmlResults = '';

            codes.forEach(code => {
                const found = orders.find(order => order.orderId === code);

                if (found) {
                    const statusClass = getStatusClass(found.status);

                    htmlResults += `
                      <div class="space-y-1">
                        <!-- Thông tin tóm tắt -->
                        <div class="grid grid-cols-2 gap-y-2">
                            <span class="text-gray-500 font-medium">Mã đơn:</span><span>${found.orderId}</span>
                            <span class="text-gray-500 font-medium">Thời gian:</span><span>${found.timestamp}</span>
                            <span class="text-gray-500 font-medium">Khách hàng:</span><span>${found.customerName}</span>
                            <span class="text-gray-500 font-medium">Sản phẩm:</span><span>${found.items}</span>
                            <span class="text-gray-500 font-medium">Bảo hành:</span><span>${found.warranty || 'Chưa kích hoạt'}</span>
                            <span class="text-gray-500 font-medium">Tổng tiền:</span><span class="text-red-600 font-semibold">${formatPrice(found.totalAmount)}</span>
                            <span class="text-gray-500 font-medium">Trạng thái:</span>
                            <span><span class="${statusClass} px-2 py-0.5 rounded text-xs font-medium w-fit">${found.status || 'Đang xử lý'}</span></span>
                        </div>

                        <!-- Nút xem chi tiết -->
                        <button class="toggleDetailsBtn mt-3 text-blue-600 hover:underline focus:outline-none">
                            Xem chi tiết
                        </button>

                        <!-- Phần chi tiết ẩn -->
                        <div class="orderDetails hidden mt-3 border-t border-gray-200 pt-3 text-gray-600 text-xs space-y-1">
                            <p><strong>Email:</strong> ${found.customerEmail || 'Không có'}</p>
                            <p><strong>Facebook/Messenger:</strong> ${found.customerMessenger || 'Không có'}</p>
                            <p><strong>Giảm giá:</strong> ${formatPrice(found.discountAmount || 0)}</p>
                            <p><strong>Phương thức thanh toán:</strong> ${found.paymentMethod === 'qr' ? 'Chuyển khoản/QR' : found.paymentMethod}</p>
                            <p><strong>Ghi chú:</strong> ${found.notes || 'Không có'}</p>
                          </div>
                        </div>
                    `;
                } else {
                    htmlResults += `<p class="text-red-600 font-semibold mb-6">Không tìm thấy đơn hàng với mã <strong>${code}</strong>.</p>`;
                }
            });

            orderResultDiv.innerHTML = htmlResults;

            // Gắn sự kiện cho tất cả nút xem chi tiết mới tạo
            const toggleButtons = orderResultDiv.querySelectorAll('.toggleDetailsBtn');
            toggleButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const detailsDiv = btn.nextElementSibling;
                    if (detailsDiv.classList.contains('hidden')) {
                        detailsDiv.classList.remove('hidden');
                        btn.textContent = "Ẩn chi tiết";
                    } else {
                        detailsDiv.classList.add('hidden');
                        btn.textContent = "Xem chi tiết";
                    }
                });
            });

            orderResultDiv.classList.remove('hidden');
        } catch (err) {
            console.error(err);
            showMessage("Lỗi khi kiểm tra đơn hàng.", 3000, true);
        } finally {
            checkOrderBtn.disabled = false;
            checkOrderBtn.textContent = "Kiểm tra đơn hàng";
        }
    });
}








const toggle = document.getElementById('contact-toggle');

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        // Messenger được chọn
        document.getElementById('email-input-group').classList.add('hidden');
        document.getElementById('messenger-input-group').classList.remove('hidden');
    } else {
        // Email được chọn
        document.getElementById('email-input-group').classList.remove('hidden');
        document.getElementById('messenger-input-group').classList.add('hidden');
    }
});
