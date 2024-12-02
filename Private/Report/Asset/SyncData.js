document.addEventListener("DOMContentLoaded", function () {
    syncFromFirebase();
});

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAiWrku6jK-C7RdWY5TgXRQE6fIK7-mdg",
    authDomain: "report-h-001.firebaseapp.com",
    databaseURL: "https://report-h-001-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "report-h-001",
    storageBucket: "report-h-001.firebasestorage.app",
    messagingSenderId: "3555738858",
    appId: "1:3555738858:web:d9490745d300176e874393",
    measurementId: "G-1J1P1WBES4"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Lưu dữ liệu vào Firebase
function saveToFirebase(data) {
    db.ref('reportsData').set(data)
        .then(() => Done("Dữ liệu đã được đồng bộ"))
        .catch(error => Fail("Lỗi khi lưu dữ liệu: ", error));
}

function saveDataAsBlobToFirebase(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveToFirebaseFromBlob(blob);
}


// Đồng bộ hóa dữ liệu từ Firebase
function syncFromFirebase() {
    db.ref('reportsData').get() // Lấy dữ liệu từ Firebase
        .then(snapshot => {
            if (snapshot.exists()) {
                const firebaseData = snapshot.val(); // Dữ liệu lấy từ Firebase
                data = firebaseData; // Cập nhật dữ liệu cục bộ
                Done('Đồng bộ dữ liệu thành công')
                renderTables(); // Gọi hàm renderTables để cập nhật bảng
            } else {
                Fail("Không có dữ liệu.");
            }
        })
        .catch(error => {
            Fail("Lỗi khi tải dữ liệu từ Firebase: ", error);
            // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
        });
}



function listenToFirebaseUpdates() {
    db.ref('reportsData').on('value', snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            Done("Đã đồng bộ dữ liệu ");
            // Render bảng với dữ liệu mới
        }
    });
}
function checkFirebaseStatus() {
    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', (snapshot) => {
        if (snapshot.val() === true) {
            Done("Máy chủ hoạt động bình thường.");
        } else {
            Fail("Không thể kết nối với máy chủ Firebase.");
        }
    });
}


let autoSyncEnabled = false;

function toggleAutoSync() {
    autoSyncEnabled = !autoSyncEnabled;
    const button = document.getElementById('toggleSyncButton');
    button.textContent = autoSyncEnabled ? "Tắt tự động đồng bộ" : "Bật tự động đồng bộ";

    if (autoSyncEnabled) {
        Done("Tự động đồng bộ đã bật");
        listenToFirebaseUpdates(); // Theo dõi dữ liệu thay đổi từ Firebase
        if (autoSyncEnabled) saveToFirebase(data);
    } else {
        Fail("Tự động đồng bộ đã tắt");
    }
}


function saveToFirebaseFromBlob(blob) {
    // Chuyển đổi blob thành JSON
    const reader = new FileReader();
    reader.onload = function () {
        try {
            const data = JSON.parse(reader.result); // Chuyển đổi nội dung blob thành JSON
            db.ref('reportsData').set(data)
                .then(() => console.log("Dữ liệu từ blob đã được lưu vào Firebase"))
                .catch(error => console.error("Lỗi khi lưu dữ liệu từ blob: ", error));
        } catch (error) {
            console.error("Lỗi khi phân tích blob thành JSON: ", error);
        }
    };
    reader.readAsText(blob); // Đọc nội dung blob
}


function checkServerStatus() {
    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', (snapshot) => {
        const statusElement = document.getElementById('statusText');

        if (snapshot.val() === true) {
            statusElement.textContent = "Hoạt động";  // Firebase server is online
            statusElement.style.color = "green";  // Màu xanh cho trạng thái "Hoạt động"
        } else {
            statusElement.textContent = "Ngoại Tuyến";  // Firebase server is offline
            statusElement.style.color = "orange";  // Màu cam cho trạng thái "Ngoại Tuyến"
        }
    });
}

function checkServerStatusWithRetry() {
    const connectedRef = firebase.database().ref('.info/connected');
    connectedRef.once('value', (snapshot) => {
        const statusElement = document.getElementById('statusText');
        if (snapshot.exists() && snapshot.val() === true) {
            statusElement.textContent = "Hoạt động";
            statusElement.style.color = "green";
        } else {
            statusElement.textContent = "Lỗi";
            statusElement.style.color = "red";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Kiểm tra trạng thái khi trang được tải
    checkServerStatus();

    // Kiểm tra lại mỗi 60 giây
    setInterval(checkServerStatusWithRetry, 60000);  // 60000 ms = 60 giây
});

