self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'Thông báo không có nội dung',
        icon: './img/js.png',
        badge: './img/js-badge.png',
    };

    event.waitUntil(
        self.registration.showNotification('JavaScript Notification', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://www.javascripttutorial.net/web-apis/javascript-notification/')
    );
});
