// Hàm Noti để tạo thông báo tùy chỉnh
// const Noti = async (title, body) => {
//     // create and show the notification
//     const showNotification = () => {
//         // create a new notification
//         const notification = new Notification(title, {
//             body: body,
//             icon: '/DATA/Logo/logo.png' // bạn có thể thay đổi đường dẫn icon ở đây
//         });

//         // close the notification after 10 seconds
//         setTimeout(() => {
//             notification.close();
//         }, 10 * 1000);

//         // navigate to a URL when clicked (nếu bạn không cần mở link khi click, có thể bỏ phần này)
//         notification.addEventListener('click', () => {
//             window.open('https://chesino.github.io/Apps/TKB', '_blank');
//         });
//     };

//     // show an error message
//     const showError = () => {
//         const error = document.querySelector('.error');
//         error.style.display = 'block';
//         error.textContent = 'You blocked the notifications';
//     };

//     // check notification permission
//     let granted = false;

//     if (Notification.permission === 'granted') {
//         granted = true;
//     } else if (Notification.permission !== 'denied') {
//         let permission = await Notification.requestPermission();
//         granted = permission === 'granted';
//     }

//     // show notification or error
//     granted ? showNotification() : showError();
// };

// Gọi hàm thông báo
// Noti('Tiêu Đề Thông Báo', 'Nội dung thông báo của bạn');
// Đăng ký service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}

// Yêu cầu quyền thông báo
const requestNotificationPermission = async () => {
    let granted = false;

    if (Notification.permission === 'granted') {
        granted = true;
    } else if (Notification.permission !== 'denied') {
        let permission = await Notification.requestPermission();
        granted = permission === 'granted';
    }

    return granted;
};

// Gửi thông báo sau 10 giây
const scheduleNotification = async (title, body) => {
    const granted = await requestNotificationPermission();

    if (granted) {
        // Sử dụng Service Worker để gửi thông báo sau 10 giây
        setTimeout(() => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, {
                        body: body,
                        icon: './DATA/Logo/logo.png'
                    });
                });
            }
        }, 10 * 1000);
    } else {
        console.log('Notification permission denied.');
    }
};

// Gọi hàm thông báo
document.getElementById('test').addEventListener('click', () => {
    scheduleNotification('Tiêu đề thông báo', 'Nội dung thông báo sau 10 giây');
});
