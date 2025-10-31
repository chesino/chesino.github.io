// Hàm để bật/tắt hiển thị menu thả xuống
function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('show'); // Thêm hoặc xóa lớp 'show'
}

// Đóng menu thả xuống khi nhấn ra ngoài
window.onclick = function (event) {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownButton = document.querySelector('.dropbtn');

    if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
        dropdownContent.classList.remove('show');
    }
};

// Hàm để cập nhật giao diện và lưu vào localStorage
function toggleStyle(style) {
    const dropdownContent = document.querySelector('.dropdown-content');
    document.body.className = style; // Thay đổi lớp của body
    localStorage.setItem('selectedStyle', style); // Lưu chế độ vào localStorage

    // Lấy tên hiển thị của style từ nút tương ứng
    const button = dropdownContent.querySelector(`button[onclick="toggleStyle('${style}')"]`);
    const styleName = button ? button.getAttribute('data-style-name') : style;

    // Cập nhật văn bản của nút thả xuống
    const dropdownButton = document.querySelector('.dropbtn');
    dropdownButton.textContent = `${styleName} ▼`;
    dropdownContent.classList.remove('show');
}

// Khởi chạy: Tải chế độ từ localStorage khi trang được tải
window.onload = function () {
    const savedStyle = localStorage.getItem('selectedStyle');
    const dropdownButton = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (savedStyle) {
        document.body.className = savedStyle; // Áp dụng chế độ đã lưu

        // Lấy tên hiển thị từ HTML
        const button = dropdownContent.querySelector(`button[onclick="toggleStyle('${savedStyle}')"]`);
        const styleName = button ? button.getAttribute('data-style-name') : savedStyle;

        dropdownButton.textContent = `${styleName} ▼`; // Cập nhật văn bản nút
    } else {
        const defaultStyle = 'light'; // Chế độ mặc định
        document.body.className = defaultStyle;

        // Lấy tên hiển thị từ HTML
        const button = dropdownContent.querySelector(`button[onclick="toggleStyle('${defaultStyle}')"]`);
        const styleName = button ? button.getAttribute('data-style-name') : defaultStyle;

        dropdownButton.textContent = `${styleName} ▼`; // Cập nhật văn bản nút mặc định
    }
};
