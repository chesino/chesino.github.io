const discountCodes = {
    'HUNQTVM': 5
};

const inputElements = document.querySelectorAll('.inputFM');
inputElements.forEach((input) => {
    input.addEventListener('input', formatNumber);
});

function formatNumber(event) {
    let input = event.target;
    let rawValue = input.value.replace(/\./g, ''); // Lưu trữ giá trị gốc (loại bỏ dấu chấm)
    let formattedValue = formatWithDots(rawValue);
    input.value = formattedValue;
    input.dataset.rawValue = rawValue; // Lưu trữ giá trị gốc trong thuộc tính 'data-raw-value'
}

function formatWithDots(value) {
    if (isNaN(value)) {
        return ''; // Nếu không phải là số thì trả về chuỗi rỗng
    }

    // Chuyển đổi giá trị thành số nguyên từ chuỗi đã loại bỏ dấu chấm
    let intValue = parseInt(value, 10);

    let parts = intValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
}

const serviceOptions = {
    facebook: [
        { value: 'like', text: 'Thích [Min 100]', price: 45 },
        { value: 'follow', text: 'Theo dõi [Min 100]', price: 50 },
        { value: 'viewstory', text: 'Lượt xem tin [Min 1,000]', price: 30 },
        { value: 'viewvideo', text: 'Lượt xem video, reel [Min 1,000]', price: 40 },
        { value: 'shareSV1', text: 'Chia sẻ [SV1 - Min 1,000] ', price: 35 },
        { value: 'shareSV2', text: 'Chia sẻ [SV2 - Min 1,000] ', price: 500 },
    ],
    tiktok: [
        { value: 'like', text: 'Thích [Min 100]', price: 30 },
        { value: 'follow', text: 'Theo dõi [Min 100]', price: 70 },
        { value: 'view', text: 'Lượt xem [Min 1,000]', price: 15 },
        { value: 'save', text: 'Lưu video [Min 100]', price: 15 }
    ]
};


function updateServiceOptions() {
    const platform = document.getElementById('platform').value;
    const serviceSelect = document.getElementById('service');
    serviceSelect.innerHTML = '<option>Vui lòng chọn dịch vụ</option>'; // Reset the service options

    serviceOptions[platform].forEach(service => {
        const option = document.createElement('option');
        option.value = service.value;
        option.text = service.text;
        option.setAttribute('data-price', service.price);
        serviceSelect.add(option);
    });

    calculateTotalPrice();
}

function calculateTotalPrice() {
    const serviceSelect = document.getElementById('service');
    const quantity = document.getElementById('quantity').value || 0;
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const pricePerUnit = selectedOption ? selectedOption.getAttribute('data-price') : 0;
    const totalPrice = pricePerUnit * quantity;

    applyDiscount(totalPrice);
    GetCustomerToTransfer();
}

function applyDiscount(totalPrice) {
    const discountCode = document.getElementById('discount').value.toUpperCase();
    let finalPrice = totalPrice;
    let discountPercent = 0;

    if (discountCodes[discountCode]) {
        discountPercent = discountCodes[discountCode];
        finalPrice = finalPrice - (finalPrice * discountPercent / 100);
    }

    document.getElementById('total_price').value = formatWithDots(finalPrice) + 'đ';

    // Cập nhật thông tin giảm giá
    const discountInfo = document.getElementById('discountInfo');
    if (discountPercent > 0) {
        discountInfo.innerHTML = `Đã giảm <span>${discountPercent}%</span> - Tiết kiệm <span>${formatWithDots(totalPrice * discountPercent / 100)}đ</span>`;
    } else {
        discountInfo.innerHTML = '';
    }
}

function togglePaymentMethod() {
    const payment = document.getElementById('payment').value;
    document.getElementById('MoMo').style.display = payment === 'momo' ? 'block' : 'none';
    document.getElementById('Banking').style.display = payment === 'banking' ? 'block' : 'none';
}
function UpdateForm() {
    document.getElementById("orderForm").addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("submit-button").textContent = "Đang lên đơn..";
        document.getElementById("submit-button").style.display = "block";
        document.getElementById("submit-button").disabled = true;


        // Collect the form data
        var formData = new FormData(this);
        var keyValuePairs = [];
        for (var pair of formData.entries()) {
            keyValuePairs.push(pair[0] + "=" + pair[1]);
        }

        var formDataString = keyValuePairs.join("&");

        // Send a POST request to your Google Apps Script
        fetch(
            "https://script.google.com/macros/s/AKfycbya-qUWSHMJsh-2nZJRN__mg_S3A9Tul_85tGLigl09RUPKToSWipvK88AgIQy0260Z3w/exec",
            {
                redirect: "follow",
                method: "POST",
                body: formDataString,
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
            }
        )
            .then(function (response) {
                // Check if the request was successful
                if (response) {
                    return response; // Assuming your script returns JSON response
                } else {
                    throw new Error("Failed to submit the form.");
                }
            })
            .then(function (data) {
                // Display a success message
                document.getElementById("submit-button").textContent =
                    "Đã lên đơn thành công sau thanh toán sẽ bắt đầu chạy !";
                document.getElementById("submit-button").disabled = false;
                document.getElementById("orderForm").reset();

            })
            .catch(function (error) {
                // Handle errors, you can display an error message here
                console.error(error);
                document.getElementById("message").textContent =
                    "Lỗi phát sinh.";
                document.getElementById("message").style.display = "block";
            });
    });
}


function getNewRecord() {
    document.getElementById("orderForm").reset();
};


function GetIDtoCustomer() {
    const HunqID = document.getElementById('HunqID').value;
    const Customer = document.getElementById('customer');
    if (HunqID != '') {
        Customer.value = HunqID
    } else {
        Fail('Lỗi', 'Bạn chưa đăng nhập');
    }
}

function ClickWelcome() {
    document.getElementById('list-tab-welcome').click();
}

function GetCustomerToTransfer() {
    const Customer = document.getElementById('customer').value;
    const Transfer = document.getElementById('TransferBank');
    const platform = document.getElementById('platform').value;
    const service = document.getElementById('service').value;
    const quantity = document.getElementById('quantity').value;

    // Lấy thời gian hiện tại
    let now = new Date();

    // Lấy các thành phần giờ, phút, ngày, tháng, năm
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let month = (now.getMonth() + 1).toString().padStart(2, '0'); // getMonth() trả về giá trị từ 0-11, nên cần +1
    let year = now.getFullYear().toString().slice(2); // Lấy hai chữ số cuối của năm

    // Ghép các thành phần lại theo định dạng HHMMDDMMYY
    // ${year} -${day}${month}
    let timeString = `${hours}${minutes}`;

    if (Customer != '') {
        // Lấy 5 số cuối của Customer
        const lastFiveDigits = Customer.slice(-3);

        // Xác định các giá trị platform và service
        const platformCode = platform === 'tiktok' ? 'T' : 'F';
        const serviceCode = service === 'like' ? 'L' : (service === 'follow' ? 'F' : 'V');

        // Tạo giá trị cuối cùng
        const result = lastFiveDigits + platformCode + timeString;

        // Đặt giá trị vào Transfer
        Transfer.value = result;
    } else {
        Fail('Lỗi', 'Bạn chưa điền Hunq ID');
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Gán sự kiện click cho phần tử TransferBank
    const transferElement = document.getElementById('TransferBank');

    transferElement.addEventListener('click', () => {
        // Tạo một phần tử textarea tạm thời để sao chép nội dung
        const textarea = document.createElement('textarea');
        textarea.value = transferElement.value;

        // Thêm textarea vào body
        document.body.appendChild(textarea);

        // Chọn nội dung của textarea
        textarea.select();

        // Sao chép nội dung vào clipboard
        document.execCommand('copy');

        // Xóa textarea tạm thời
        document.body.removeChild(textarea);

        // Thông báo cho người dùng (tuỳ chọn)
        DoneSignIn('Đã sao chép nội dung chuyển khoản');
    });
});
