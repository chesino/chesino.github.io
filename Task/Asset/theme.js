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
    document.body.className = style; // Thay đổi lớp của body
    localStorage.setItem('selectedStyle', style); // Lưu chế độ vào localStorage

    // Cập nhật văn bản của nút thả xuống
    const dropdownButton = document.querySelector('.dropbtn');
    dropdownButton.textContent = `${style.replace('-', ' ')} ▼`; // Ví dụ: 'dark-luxury' thành 'Dark Luxury'
    toggleDropdown();
}


// Khởi chạy: Tải chế độ từ localStorage khi trang được tải
window.onload = function () {
    const savedStyle = localStorage.getItem('selectedStyle');
    const dropdownButton = document.querySelector('.dropbtn');

    if (savedStyle) {
        document.body.className = savedStyle; // Áp dụng chế độ đã lưu
        dropdownButton.textContent = `${savedStyle.replace('-', ' ')} ▼`; // Cập nhật văn bản nút
    } else {
        document.body.className = 'light'; // Áp dụng chế độ mặc định
        dropdownButton.textContent = 'light ▼'; // Chế độ mặc định
    }
};