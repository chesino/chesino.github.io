let data = [];
let editIndex = null;
let filteredData = [];  // Mảng lưu dữ liệu sau khi lọc

document.addEventListener("DOMContentLoaded", function () {
    const storedData = localStorage.getItem("reportsData");
    if (storedData) {
        data = JSON.parse(storedData);  // Chuyển đổi chuỗi JSON từ localStorage thành mảng đối tượng
        renderTables();  // Hiển thị dữ liệu lên bảng
    }
});

// Hàm để cập nhật thời gian hiện tại vào trường datetime-local
function updateDateTime() {
    const now = new Date();

    // Lấy các thành phần ngày, tháng, năm, giờ, phút
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Thêm 0 nếu tháng < 10
    const day = now.getDate().toString().padStart(2, '0'); // Thêm 0 nếu ngày < 10
    const hour = now.getHours().toString().padStart(2, '0'); // Thêm 0 nếu giờ < 10
    const minute = now.getMinutes().toString().padStart(2, '0'); // Thêm 0 nếu phút < 10

    // Định dạng theo yyyy-mm-ddThh:mm
    const formattedDateTime = `${year}-${month}-${day}T${hour}:${minute}`;

    // Cập nhật vào trường datetime-local
    document.getElementById('dateTime').value = formattedDateTime;
}

// Gọi hàm khi trang được tải hoặc khi bạn muốn cập nhật giá trị
document.addEventListener("DOMContentLoaded", function () {
    updateDateTime(); // Cập nhật thời gian tự động khi tải trang
});


// Mở tab
function openTab(evt, tabName) {
    let tabContents = document.getElementsByClassName("tabcontent");
    for (let tabContent of tabContents) {
        tabContent.style.display = "none";
    }

    let tabLinks = document.getElementsByClassName("tablinks");
    for (let tabLink of tabLinks) {
        tabLink.className = tabLink.className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


// Hàm chuyển đổi định dạng ngày giờ từ 'yyyy-mm-ddThh:mm' sang 'hh:mm dd/MM/yyyy'
// Hàm chuyển đổi định dạng ngày giờ từ 'yyyy-mm-ddThh:mm' sang 'hh:mm dd/MM/yyyy'
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const hours = String(date.getHours()).padStart(2, '0'); // Giờ
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Phút
    const day = String(date.getDate()).padStart(2, '0'); // Ngày
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng
    const year = date.getFullYear(); // Năm

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}


// Hiển thị bảng
function renderTables() {
    const tableBody = document.getElementById("reportsTable").querySelector("tbody");
    tableBody.innerHTML = "";  // Làm sạch bảng trước khi render lại

    // Lặp qua mảng dữ liệu và tạo các hàng mới trong bảng
    data.forEach((item, index) => {
        const areaDetails = [
            item.area,
            item.areaFirst !== "0" ? item.areaFirst : "",
            item.areaLast !== "0" ? item.areaLast : "",
            item.floor !== "0" ? item.floor : "",
        ]
            .filter(Boolean)
            .join("-"); // Ghép các phần tử thành chuỗi với dấu '-'

        const row = `
            <tr>
                <td>${item.checker}</td>
                <td>${item.relatedPerson} ${item.relatedPersonName}</td>
                <td>${item.dateTime}</td>
                <td>${areaDetails}</td>
                <td>${item.position}</td>
                <td>${item.issue}</td>
                <td>${item.description || ""}</td>
                <td>${item.status}</td>
                <td>
                    <button onclick="openPopup(${index})"><i class="fas fa-pen"></i></button>
                    <button onclick="deleteReport(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;  // Thêm hàng mới vào bảng
    });
}






// Thêm báo cáo
document.getElementById("damageForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const newReport = {
        checker: document.getElementById("checker").value,
        relatedPerson: document.getElementById("relatedPerson").value || "Không xác định",
        relatedPersonName: document.getElementById("relatedPersonName").value || "",
        dateTime: document.getElementById("dateTime").value,
        area: document.getElementById("areaInput").value,
        areaFirst: document.getElementById("areaFirstInput").value,
        areaLast: document.getElementById("areaLastInput").value,
        floor: document.getElementById("floorInput").value,
        position: document.getElementById("locationInput").value,
        issue: document.getElementById("issue").value,
        description: document.getElementById("description").value || "",
        status: document.getElementById("status").value,
    };

    data.push(newReport);  // Thêm báo cáo mới vào dữ liệu cục bộ
    saveToFirebase(data);  // Lưu dữ liệu vào Firebase
    renderTables();  // Cập nhật bảng
    document.getElementById("damageForm").reset();  // Reset form

    // Sử dụng SweetAlert2 để thông báo thêm báo cáo thành công
    Swal.fire({
        icon: 'success',
        title: 'Thêm báo cáo thành công!',
        text: 'Báo cáo của bạn đã được lưu vào hệ thống.',
        showConfirmButton: false,
        timer: 1500
    });
});




// Chỉnh sửa báo cáo
// Mở popup chỉnh sửa
function openPopup(index) {
    const item = data[index];  // Lấy dữ liệu gốc từ chỉ số
    editIndex = index;  // Lưu chỉ số chỉnh sửa vào biến toàn cục

    document.getElementById("editRelatedPerson").value = item.relatedPerson || "";
    document.getElementById("editRelatedPersonName").value = item.relatedPersonName || "";
    document.getElementById("editChecker").value = item.checker || "";
    document.getElementById("editDateTime").value = item.dateTime || "";
    document.getElementById("editArea").value = item.area || "";
    document.getElementById("editAreaFirst").value = item.areaFirst || "0";
    document.getElementById("editAreaLast").value = item.areaLast || "0";
    document.getElementById("editFloor").value = item.floor || "0";
    document.getElementById("editLocation").value = item.position || "";
    document.getElementById("editIssue").value = item.issue || "";
    document.getElementById("editDescription").value = item.description || "";
    document.getElementById("editStatus").value = item.status || "";

    document.getElementById("editPopup").style.display = "block";
}



// Xử lý cập nhật dữ liệu từ form chỉnh sửa
document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedReport = {
        checker: document.getElementById("editChecker").value,
        relatedPerson: document.getElementById("editRelatedPerson").value,
        relatedPersonName: document.getElementById("editRelatedPersonName").value,
        dateTime: document.getElementById("editDateTime").value,
        area: document.getElementById("editArea").value,
        areaFirst: document.getElementById("editAreaFirst").value,
        areaLast: document.getElementById("editAreaLast").value,
        floor: document.getElementById("editFloor").value,
        position: document.getElementById("editLocation").value,
        issue: document.getElementById("editIssue").value,
        description: document.getElementById("editDescription").value || "",
        status: document.getElementById("editStatus").value,
    };

    data[editIndex] = updatedReport;  // Cập nhật dữ liệu cục bộ
    saveToFirebase(data);  // Lưu lại vào Firebase
    renderTables();  // Cập nhật bảng
    closePopup();  // Đóng popup

    // Thông báo người dùng bằng SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Cập nhật báo cáo thành công!',
        text: 'Báo cáo của bạn đã được cập nhật.',
        showConfirmButton: false,
        timer: 1500
    });
});




// Đóng popup chỉnh sửa
function closePopup() {
    document.getElementById("editPopup").style.display = "none";
}


// Xóa báo cáo
function deleteReport(index) {
    Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa báo cáo này?',
        text: "Bạn sẽ không thể khôi phục lại báo cáo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, xóa!'
    }).then((result) => {
        if (result.isConfirmed) {
            data.splice(index, 1);  // Xóa báo cáo khỏi dữ liệu cục bộ
            saveToFirebase(data);  // Lưu lại vào Firebase
            renderTables();  // Cập nhật bảng

            // Thông báo người dùng bằng SweetAlert2
            Swal.fire(
                'Đã xóa!',
                'Báo cáo của bạn đã bị xóa.',
                'success'
            );
        }
    });
}




// Lưu dữ liệu vào localStorage
function saveToLocalStorage() {
    localStorage.setItem("reportsData", JSON.stringify(data)); // Lưu mảng 'data' vào localStorage dưới dạng chuỗi JSON
}


// Hàm xuất dữ liệu dưới dạng CSV
// function exportCSV() {
//     const csvContent = [
//         ["Người kiểm tra", "Người liên quan", "Thời gian", "Khu vực", "Vị trí", "Vấn đề", "Mô tả", "Tình trạng"],  // Thêm Người liên quan vào tiêu đề cột
//         ...data.map(item => [
//             item.checker,
//             item.relatedPerson + (item.relatedPersonName ? " " + item.relatedPersonName : ""),  // Hiển thị Người liên quan, nếu có tên thì thêm tên
//             formatDateTime(item.dateTime),  // Định dạng lại ngày giờ
//             `${item.area}${item.areaFirst !== "0" ? "-" + item.areaFirst : ""}${item.areaLast !== "0" ? "-" + item.areaLast : ""}`,
//             item.position,
//             item.issue,
//             item.description,
//             item.status
//         ])
//     ]
//         .map(e => e.join(","))  // Chuyển mỗi dòng thành một chuỗi ngăn cách bởi dấu phẩy
//         .join("\n");  // Mỗi dòng dữ liệu sẽ được ngăn cách bởi dấu xuống dòng (new line)

//     // Tạo một đối tượng Blob từ dữ liệu CSV với BOM (Byte Order Mark) để Excel nhận diện đúng
//     const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8;" });

//     // Tạo liên kết tải về
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "Báo Cáo Hư Hỏng.csv";  // Tên file CSV khi tải về
//     link.click();  // Mô phỏng nhấp chuột để tải file
// }


function exportExcel() {
    const ws_data = [
        ["Người kiểm tra", "Người liên quan", "Thời gian", "Khu vực", "Vị trí", "Vấn đề", "Mô tả", "Tình trạng"],
        ...data.map(item => [
            item.checker,
            item.relatedPerson + (item.relatedPersonName ? " " + item.relatedPersonName : ""),
            formatDateTime(item.dateTime),
            `${item.area}${item.areaFirst !== "0" ? "-" + item.areaFirst : ""}${item.areaLast !== "0" ? "-" + item.areaLast : ""}`,
            item.position,
            item.issue,
            item.description,
            item.status
        ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BÁO CÁO HƯ HỎNG");
    XLSX.writeFile(wb, "BÁO CÁO HƯ HỎNG.xlsx");

    // Thông báo SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Tải xuống thành công!',
        text: 'Tệp Excel đã được tải về.',
        timer: 2000,
        showConfirmButton: false
    });
}


function exportTXT() {
    const txtContent = data.map(item =>
        `Người kiểm tra: ${item.checker}\n` +
        `Người liên quan: ${item.relatedPerson} ${item.relatedPersonName || ""}\n` +
        `Thời gian: ${formatDateTime(item.dateTime)}\n` +
        `Khu: ${item.area}${item.areaFirst !== "0" ? "-" + item.areaFirst : ""}${item.areaLast !== "0" ? "-" + item.areaLast : ""}${item.floor !== "0" ? "." + item.floor : ""}\n` +
        `Vị trí: ${item.position}\n` +
        `Vấn đề: ${item.issue}\n` +
        `Mô tả: ${item.description}\n` +
        `Tình trạng: ${item.status}\n---`
    ).join("\n");

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "BÁO CÁO HƯ HỎNG.txt";
    link.click();

    // Thông báo SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Tải xuống thành công!',
        text: 'Tệp TXT đã được tải về.',
        timer: 2000,
        showConfirmButton: false
    });
}


//Tìm kiếm & Lọc dữ liệu
function filterReports() {
    const checkerFilter = document.getElementById("filterChecker").value.toLowerCase();
    const areaFilter = document.getElementById("filterArea").value.toLowerCase();
    const statusFilter = document.getElementById("filterStatus").value.toLowerCase();
    const contentSearch = document.getElementById("searchContent").value.toLowerCase();
    const timeFilter = document.getElementById("filterTime").value;

    const now = new Date();

    const filteredData = data.filter(item => {
        const itemDate = new Date(item.dateTime);

        // Default time range match
        let timeRangeMatch = true;
        if (timeFilter === "7days") {
            timeRangeMatch = (now - itemDate) > 7 * 24 * 60 * 60 * 1000; // Quá 7 ngày
        } else if (timeFilter === "1month") {
            timeRangeMatch = (now - itemDate) > 30 * 24 * 60 * 60 * 1000; // Quá 1 tháng
        } else if (timeFilter === "45days") {
            timeRangeMatch = (now - itemDate) > 45 * 24 * 60 * 60 * 1000; // Quá 45 ngày
        }

        const areaDetails = [
            item.area,
            item.areaFirst !== "0" ? item.areaFirst : "",
            item.areaLast !== "0" ? item.areaLast : "",
            item.floor !== "0" ? item.floor : "",
        ].filter(Boolean).join("-").toLowerCase();

        return (
            (checkerFilter === "" || item.checker.toLowerCase().includes(checkerFilter)) &&
            (areaFilter === "" || areaDetails.includes(areaFilter)) &&
            (statusFilter === "" || item.status.toLowerCase().includes(statusFilter)) &&
            (contentSearch === "" || (
                item.checker.toLowerCase().includes(contentSearch) ||
                areaDetails.includes(contentSearch) ||
                item.position.toLowerCase().includes(contentSearch) ||
                item.issue.toLowerCase().includes(contentSearch) ||
                item.description.toLowerCase().includes(contentSearch)
            )) &&
            timeRangeMatch
        );
    });

    if (timeFilter === "newest") {
        filteredData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    } else if (timeFilter === "oldest") {
        filteredData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }

    renderFilteredTables(filteredData);
}


// Cập nhật lại renderFilteredTables để nhận dữ liệu đã lọc
function renderFilteredTables(filteredData) {
    const tableBody = document.getElementById("reportsTable").querySelector("tbody");
    tableBody.innerHTML = "";

    filteredData.forEach((item) => {
        const originalIndex = data.indexOf(item);  // Lấy chỉ số gốc từ data
        const areaDetails = [
            item.area,
            item.areaFirst !== "0" ? item.areaFirst : "",
            item.areaLast !== "0" ? item.areaLast : "",
            item.floor !== "0" ? item.floor : "",
        ]
            .filter(Boolean)
            .join("-");

        const row = `
            <tr>
                <td data-label="Người kiểm tra">${item.checker}</td>
                <td data-label="Người liên quan">${item.relatedPerson} ${item.relatedPersonName}</td>
                <td data-label="Thời gian">${formatDateTime(item.dateTime)}</td>
                <td data-label="Khu vực">${areaDetails}</td>
                <td data-label="Vị trí">${item.position}</td>
                <td data-label="Vấn đề">${item.issue}</td>
                <td data-label="Mô tả">${item.description || ""}</td>
                <td data-label="Tình trạng">${item.status}</td>
                <td data-label="Thao Tác">
                    <div class="Func">
                        <button onclick="openPopup(${originalIndex})"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteReport(${originalIndex})"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}


document.getElementById("importFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    data = importedData;
                    saveToLocalStorage();
                    renderTables();
                    Swal.fire({
                        icon: 'success',
                        title: 'Nhập thành công!',
                        text: 'Dữ liệu đã được nhập.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error("Dữ liệu không hợp lệ.");
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Dữ liệu không hợp lệ.',
                });
            }
        };
        reader.readAsText(file);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Vui lòng chọn tệp JSON.',
        });
    }
});


function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "BÁO CÁO HƯ HỎNG.json";
    link.click();

    // Thông báo SweetAlert2
    Swal.fire({
        icon: 'success',
        title: 'Tải xuống thành công!',
        text: 'Tệp JSON đã được tải về.',
        timer: 2000,
        showConfirmButton: false
    });
}

function calculateDate(daysAgo) {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);

    // Định dạng lại ngày theo dd/mm/yyyy
    const day = String(today.getDate()).padStart(2, '0'); // Thêm số 0 nếu ngày có 1 chữ số
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng có 1 chữ số
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}

function daysLeftInMonth() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Lấy ngày cuối tháng
    const remainingDays = lastDayOfMonth.getDate() - today.getDate();
    return remainingDays;
}

function daysInCurrentMonth() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Lấy ngày cuối tháng
    return lastDayOfMonth.getDate();
}

// Hàm cập nhật kết quả cho input ngày
function updateCustomDate() {
    const inputDays = document.getElementById('input-days').value;
    const result = calculateDate(inputDays);
    document.getElementById('days-input').textContent = result;
}

// Hiển thị kết quả ban đầu
document.getElementById('days-7').textContent = calculateDate(7);
document.getElementById('days-30').textContent = calculateDate(30);
document.getElementById('days-45').textContent = calculateDate(45);
document.getElementById('days-left').textContent = daysLeftInMonth();
document.getElementById('days-in-month').textContent = daysInCurrentMonth();

// Cập nhật kết quả khi người dùng thay đổi giá trị input
document.getElementById('input-days').addEventListener('input', updateCustomDate);


function Done(T1) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: T1
    });
}

function Fail(T1) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "error",
        title: T1
    });
}

