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
        { value: 'like', text: 'Thích', price: 10 },
        { value: 'follow', text: 'Theo dõi', price: 20 },
        { value: 'viewstory', text: 'Lượt xem tin', price: 5 }
    ],
    tiktok: [
        { value: 'like', text: 'Thích', price: 15 },
        { value: 'follow', text: 'Theo dõi', price: 25 },
        { value: 'view', text: 'Lượt xem', price: 10 }
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
        e.preventDefault(); // Prevent the default form submission
        document.getElementById("message").textContent = "Đang lên đơn..";
        document.getElementById("message").style.display = "block";
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
                document.getElementById("message").textContent =
                    "Đã lên đơn thành công sau khi xác nhận thanh toán sẽ lên đơn!";
                document.getElementById("message").style.display = "block";
                document.getElementById("message").style.backgroundColor = "var(--SnG-BTN-Main)";
                document.getElementById("message").style.color = "var(--SnG-BTN-Main-Text)";
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