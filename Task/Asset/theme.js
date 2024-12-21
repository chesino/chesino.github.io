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

// Map lớp CSS sang văn bản hiển thị
const styleNames = {
    'light': 'Sáng',
    'dark': 'Tối',
    'xmas': 'Noel'
};

// Hàm để cập nhật giao diện và lưu vào localStorage
function toggleStyle(style) {
    const dropdownContent = document.querySelector('.dropdown-content');
    document.body.className = style; // Thay đổi lớp của body
    localStorage.setItem('selectedStyle', style); // Lưu chế độ vào localStorage

    // Cập nhật văn bản của nút thả xuống
    const dropdownButton = document.querySelector('.dropbtn');
    dropdownButton.textContent = `${styleNames[style]} ▼`; // Lấy tên từ styleNames
    dropdownContent.classList.remove('show');
}

// Khởi chạy: Tải chế độ từ localStorage khi trang được tải
window.onload = function () {
    const savedStyle = localStorage.getItem('selectedStyle');
    const dropdownButton = document.querySelector('.dropbtn');

    if (savedStyle && styleNames[savedStyle]) {
        document.body.className = savedStyle; // Áp dụng chế độ đã lưu
        dropdownButton.textContent = `${styleNames[savedStyle]} ▼`; // Cập nhật văn bản nút
    } else {
        const defaultStyle = 'light'; // Chế độ mặc định
        document.body.className = defaultStyle;
        dropdownButton.textContent = `${styleNames[defaultStyle]} ▼`; // Cập nhật văn bản nút mặc định
    }
};



function cycleStyle() {
    // Lấy tất cả các chế độ trong styleNames
    const styles = Object.keys(styleNames);
    // Lấy lớp hiện tại của body
    const currentStyle = document.body.className;
    
    // Tìm index của chế độ hiện tại trong danh sách styles
    let currentIndex = styles.indexOf(currentStyle);
    
    // Nếu không có chế độ hiện tại, bắt đầu từ 'light'
    if (currentIndex === -1) {
        currentIndex = 0;
    }
    
    // Chuyển sang chế độ tiếp theo
    const nextStyle = styles[(currentIndex + 1) % styles.length];
    toggleStyle(nextStyle); // Áp dụng chế độ tiếp theo
}