

// Hàm lấy danh sách khách hàng từ exportedCustomer
function getCustomer() {
    return exportedCustomer.map(match => match); // Trả về danh sách khách hàng từ exportedCustomer
}

// Hàm tích điểm
function customerPoints() {
    const scriptURL = "https://script.google.com/macros/s/AKfycbyhQI3ABkcTZY7M3Ojf_upeB4dKHbCD8MD9EpNr88HaYZgEupNmA83DGZbk7VF8nLTc8w/exec";

    const customers = getCustomer();
    var FinalTotal = CartManager.getFinalTotal();

    customers.forEach(customer => {
        // Chuẩn bị dữ liệu gửi đi
        const customerData = {
            Name: customer.Name,
            Phone: customer.Phone,
            Total: FinalTotal,
            Usage: 1
        };

        function jsonToQueryString(json) {
            return Object.keys(json)
                .filter(key => json[key] !== "" && json[key] !== null && json[key] !== undefined) // Lọc các giá trị không hợp lệ
                .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key])) // Mã hóa key=value
                .join("&"); // Nối các cặp bằng '&'
        }

        const formDataQS = jsonToQueryString(customerData);

        const formData = new URLSearchParams(formDataQS).toString();
        // Hàm chuyển JSON thành query string
        
        // Gửi dữ liệu lên Google Sheets
        fetch(scriptURL, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    Swal.fire('Thành công!', result.message, 'success');
                    loadCustomerData();
                } else {
                    Swal.fire('Lỗi!', 'Có lỗi xảy ra khi cập nhật điểm.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Lỗi!', 'Có lỗi xảy ra khi cập nhật điểm.', 'error');
            });
    });
}
