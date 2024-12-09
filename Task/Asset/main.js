document.addEventListener("DOMContentLoaded", function () {
    fetch('./Data/DB-Service.json')
        .then(response => response.json())
        .then(data => {
            renderServices(data);
        });

    const form = document.getElementById('invoiceForm');
    const paymentMethod = document.getElementById('paymentMethod');
    const cashInput = document.getElementById('cashInput');
    const invoiceOutput = document.getElementById('invoiceOutput');
    const generateInvoiceBtn = document.getElementById('generateInvoiceBtn');
    const serviceList = document.getElementById('serviceList');

    // Hiển thị số tiền khách đưa nếu chọn "Tiền mặt"
    paymentMethod.addEventListener('change', function () {
        cashInput.classList.toggle('d-none', this.value !== 'cash');
    });

    // Xử lý khi submit form
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const customerName = document.getElementById('customerName').value;
        const employeeName = document.getElementById('employeeName').value;
        const selectedServices = Array.from(document.querySelectorAll('.service-checkbox:checked'));
        const paymentType = paymentMethod.options[paymentMethod.selectedIndex].text;
        const cashGiven = document.getElementById('cashGiven').value || 0;
        const invoiceNumber = Math.floor(Math.random() * 100000);
        const now = new Date();
        const dateTime = now.toLocaleString('vi-VN');

        let total = 0;
        const serviceDetails = selectedServices.map(service => {
            const price = parseFloat(service.dataset.price);
            total += price;
            return {
                description: service.value,
                price: price
            };
        });

        let change = 0;
        if (paymentType === 'Tiền mặt' && cashGiven > 0) {
            change = cashGiven - total;
        }

        renderInvoice(invoiceNumber, dateTime, customerName, employeeName, serviceDetails, total, paymentType, cashGiven, change);
        generateInvoiceBtn.classList.remove('d-none');
    });

    // Hàm hiển thị danh sách dịch vụ
    function renderServices(services) {
        serviceList.innerHTML = ''; // Xóa danh sách cũ
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card d-flex align-items-center justify-content-between';
            serviceCard.innerHTML = `
                <label class="form-check-label">
                    <input type="checkbox" class="form-check-input service-checkbox" value="${service.service}" data-price="${service.price}">
                    ${service.service} - ${service.price.toLocaleString()}k
                </label>
            `;
            serviceList.appendChild(serviceCard);
        });
    }

    // Hàm hiển thị hóa đơn
    function renderInvoice(number, dateTime, customer, employee, services, total, paymentType, cash, change) {
        const servicesHTML = services.map((service, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${service.description}</td>
                <td>1</td>
                <td>${service.price.toLocaleString()}k</td>
                <td>${service.price.toLocaleString()}k</td>
            </tr>
        `).join('');

        invoiceOutput.innerHTML = `
             <div class="Out-invoice">
                <div class="Logo-invoice">
                    <img src="./Asset/Logo.png" alt="LOGO">
                </div>
                <h4 class="text-center">ABC Hair Salon</h4>
                <p class="text-center">0912.123.123</p>
                <hr>
                <h5 class="text-center">HÓA ĐƠN THANH TOÁN</h5>
                <div class="Info-invoice">
                    <p><strong>Số hóa đơn:</strong> #${number}</p>
                    <p><strong>Ngày giờ:</strong> ${dateTime}</p>
                    <p><strong>Khách hàng:</strong> ${customer}</p>
                    <p><strong>Nhân viên:</strong> ${employee}</p>
                    <p><strong>Phương thức thanh toán:</strong> ${paymentType}</p>
                </div>
                <hr>

                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Dịch vụ</th>
                            <th>SL</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicesHTML}
                    </tbody>
                </table>
                <div class="Total">
                    <h2><strong>Tổng tiền:</strong> ${total.toLocaleString()}k</h2>
                    ${paymentType === 'Tiền mặt' ? `
                    <p><strong>Tiền mặt:</strong> ${cash}k</p>
                    <p><strong>Tiền thối lại:</strong> ${change.toLocaleString()}k</p>
                    ` : ''}
                    <p class="text-center">Cảm ơn quý khách!</p>
                </div>
            </div>
        `;
    }
});
