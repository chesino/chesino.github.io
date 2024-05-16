document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-view');
    const cards = document.querySelectorAll('.card');

    // Kiểm tra trạng thái đã lưu trước đó trong local storage
    const isVertical = localStorage.getItem('isVertical') === 'true';

    // Áp dụng trạng thái vào các thẻ card
    if (isVertical) {
        cards.forEach(card => {
            card.classList.add('vertical');
        });
    }

    toggleBtn.addEventListener('click', () => {
        cards.forEach(card => {
            card.classList.toggle('vertical');
        });

        // Lưu trạng thái mới vào local storage
        const isVerticalNow = cards[0].classList.contains('vertical');
        localStorage.setItem('isVertical', isVerticalNow.toString());
    });
});

// Lấy nút nhấn và đối tượng body
const toggleModeBtn = document.querySelector('.toggle-mode-btn');
const body = document.body;

// Kiểm tra nếu đã lưu trạng thái dark mode trong localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Hàm để bật hoặc tắt dark mode
function toggleDarkMode() {
    // Đảo ngược trạng thái
    const newMode = !body.classList.contains('dark-mode');
    
    // Cập nhật trạng thái mới
    body.classList.toggle('dark-mode', newMode);
    
    // Lưu trạng thái mới vào localStorage
    localStorage.setItem('darkMode', newMode);
}

// Đặt trạng thái ban đầu dựa trên dữ liệu trong localStorage
body.classList.toggle('dark-mode', isDarkMode);

// Lắng nghe sự kiện nhấn nút và gọi hàm toggleDarkMode
toggleModeBtn.addEventListener('click', toggleDarkMode);
