
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
});

const itemNameEnter = document.getElementById('itemName');
itemNameEnter.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTally();
    }
});

var Point = 1;
var smartPointActive = false;

function toggleSmartPoint() {
    var smartPoint = document.getElementById("smartpoint");

    if (smartPointActive) {
        smartPoint.classList.remove("active");
        Point = 1;
    } else {
        smartPoint.classList.add("active");

        // Lấy tất cả các phần tử có class là "Tally"
        var tallyElements = document.getElementsByClassName('Tally');

        // Lấy số lượng phần tử có class là "Tally"
        var tallyCount = tallyElements.length;
        Point = tallyCount;
    }

    smartPointActive = !smartPointActive;
}

var ENAvatar = true;

function toggleENAvatar() {
    var btnENAvatar = document.getElementById("ENAvatar");

    if (ENAvatar) {
        btnENAvatar.classList.remove("active");
        // Lấy tất cả các phần tử có class chứa ".Tally"
        var elements = document.querySelectorAll('.Tally');

        // Lặp qua từng phần tử
        elements.forEach(function (element) {
            element.classList.add("Black");
        });
    } else {
        btnENAvatar.classList.add("active");
        var elements = document.querySelectorAll('.Tally');
        elements.forEach(function (element) {
            element.classList.remove("Black");
        });
    }

    ENAvatar = !ENAvatar;
}



function UpdatePoint() {
    if (smartPointActive == true) {
        Point--;
        if (Point == 0) {
            var tallyElements = document.getElementsByClassName('Tally');
            // Lấy số lượng phần tử có class là "Tally"
            var tallyCount = tallyElements.length;
            Point = tallyCount - 1;
        }
    }

}


const HistoryTally = document.getElementById("HistoryTally");
let currentLog = null;
let timeoutId = null;

function addTally(itemName, quantity) {

    itemName = itemName || document.getElementById("itemName").value;
    quantity = quantity || 0;

    // Chuyển chữ cái đầu của itemName thành chữ hoa
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    // Bây giờ itemName chứa chuỗi với chữ cái đầu viết hoa
    if (itemName.trim() !== "") {
        document.querySelector('.HistoryTally').classList.remove('Hidden');

        var newTally = document.createElement("div");
        newTally.className = "Tally";

        if (itemName == 'HunqD' || itemName == 'Hùng') {
            newTally.classList.add('HunqD');
        }
        if (itemName == 'Hiền') {
            newTally.classList.add('Hien');
        }
        if (itemName == 'Thiện') {
            newTally.classList.add('Thien');
        }
        if (itemName == 'Hoa') {
            newTally.classList.add('Hoa');
        }
        if (itemName == 'Hoàng') {
            newTally.classList.add('Hoang');
        }


        var box = document.createElement("div");
        box.className = "Box";

        var head = document.createElement("div");
        head.className = "Head";

        var item = document.createElement("div");
        item.className = "Item";
        item.innerText = itemName;

        var clickCount = 0;

        var delButton = document.createElement("button");
        delButton.className = "Del-Item";
        delButton.innerHTML = '<i class="fa-solid fa-ban"></i>';
        delButton.addEventListener("click", function () {
            clickCount++;
            if (clickCount === 3) {
                newTally.remove();
                clickCount = 0;
                saveToLocalStorage();
            }
        });


        head.appendChild(item);
        head.appendChild(delButton);

        var body = document.createElement("div");
        body.className = "Body";

        var minusButton = document.createElement("button");
        minusButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
        minusButton.addEventListener("click", function () {
            var inputNumber = body.querySelector("input");
            inputNumber.value = Math.max(0, parseInt(inputNumber.value) - 1);
            logValueDelayed(itemName, -1);
        });

        var numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.value = quantity;

        var plusButton = document.createElement("button");
        plusButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
        plusButton.addEventListener("click", function () {
            UpdatePoint();
            var inputNumber = body.querySelector("input");
            inputNumber.value = parseInt(inputNumber.value) + Point;
            logValueDelayed(itemName, Point);
        });

        body.appendChild(minusButton);
        body.appendChild(numberInput);
        body.appendChild(plusButton);

        box.appendChild(head);
        box.appendChild(body);
        newTally.appendChild(box);



        document.getElementById("Tally").appendChild(newTally);

        saveToLocalStorage();
        document.getElementById("itemName").value = '';
    } else {
        alert('Vui lòng nhập tên người chơi');
    }
}

function logValueDelayed(itemName, quantity) {
    const currentTime = new Date();
    const timeString = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
    const dateString = `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()}`;

    const logText = `${itemName} ${quantity > 0 ? '+' : ''}${quantity} lúc ${timeString} - ${dateString}`;

    if (currentLog === null || currentLog.itemName !== itemName) {
        // Nếu không có thông báo hiện tại hoặc thông báo hiện tại không phải là cùng một mục
        if (currentLog !== null) {
            // Nếu có thông báo hiện tại, thêm vào HistoryTally
            addToHistory(currentLog);
        }
        // Tạo một thông báo mới
        currentLog = { itemName, quantity, time: currentTime };
    } else {
        // Nếu đang trong khoảng thời gian ngắn, cập nhật thông báo hiện tại
        currentLog.quantity += quantity;
        currentLog.time = currentTime;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        // Sau 1 giây, thêm thông báo hiện tại (nếu có) vào HistoryTally
        if (currentLog !== null) {
            addToHistory(currentLog);
            currentLog = null;
        }
    }, 1500);
}

function addToHistory(log) {
    const timeString = `${log.time.getHours()}:${log.time.getMinutes()}:${log.time.getSeconds()}`;
    const dateString = `${log.time.getDate()}/${log.time.getMonth() + 1}/${log.time.getFullYear()}`;
    const logText = `${timeString} - ${log.itemName} ${log.quantity > 0 ? '+' : ''}${log.quantity}`;

    const newParagraph = document.createElement("p");
    newParagraph.innerText = logText;
    HistoryTally.appendChild(newParagraph);
    saveToLocalStorage();
    saveHistoryToLocalStorage();
}

function saveToLocalStorage() {
    const tallies = [];
    const tallyElements = document.getElementsByClassName("Item");
    const tallyInputs = document.querySelectorAll(".Tally input");

    for (let i = 0; i < tallyElements.length; i++) {
        tallies.push({
            itemName: tallyElements[i].innerText,
            quantity: parseInt(tallyInputs[i].value)
        });
    }

    localStorage.setItem('tallies', JSON.stringify(tallies));
}

function saveHistoryToLocalStorage() {
    const historyLogs = [];
    const historyItems = HistoryTally.querySelectorAll("p");

    historyItems.forEach(item => {
        historyLogs.push(item.innerText);
    });

    localStorage.setItem('historyLogs', JSON.stringify(historyLogs));
}

function loadFromLocalStorage() {
    const savedTallies = JSON.parse(localStorage.getItem('tallies')) || [];
    const savedHistoryLogs = JSON.parse(localStorage.getItem('historyLogs')) || [];

    savedTallies.forEach(tally => {
        addTally(tally.itemName, tally.quantity);
    });

    // Set input values based on loaded data
    const tallyInputs = document.querySelectorAll(".Tally input");

    savedTallies.forEach((tally, index) => {
        tallyInputs[index].value = tally.quantity;
    });

    savedHistoryLogs.forEach(log => {
        addToHistoryLog(log);
    });
}

function addToHistoryLog(logText) {
    const newParagraph = document.createElement("p");
    newParagraph.innerText = logText;
    HistoryTally.appendChild(newParagraph);
}


const resetButton = document.getElementById("resetButton");
const deleteAllButton = document.getElementById("DeleteAll");
let pressTimer;

// Hàm xử lý khi nút được giữ trong 3 giây
function handleLongPress() {
    const tallyInputs = document.querySelectorAll(".Tally input");

    tallyInputs.forEach(input => {
        input.value = 0;
        localStorage.removeItem('historyLogs');
        document.getElementById("HistoryTally").innerHTML = '';
    });

    alert('Đặt lại thành công.');
    saveToLocalStorage(); // Lưu trạng thái mới vào localStorage nếu cần
}

resetButton.addEventListener("click", function () {
    alert('Nhấn và giữ 3 giây để đặt lại số điểm & lịch sử.');
});





deleteAllButton.addEventListener("touchstart", function () {
    pressTimer = window.setTimeout(function () {
        localStorage.removeItem('tallies');
        localStorage.removeItem('historyLogs');
        document.getElementById("Tally").innerHTML = '';
        document.getElementById("HistoryTally").innerHTML = '';
        document.querySelector('.HistoryTally').classList.add('Hidden');

        alert('Xóa tất cả thành công.');
    }, 2000);
});





var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    // Dành cho di động
    deleteAllButton.addEventListener("click", function () {
        alert('Nhấn và giữ 3 giây để xoá toàn bộ.');
    });

    deleteAllButton.addEventListener("touchend", function () {
        window.clearTimeout(pressTimer);
    });

    deleteAllButton.addEventListener("touchleave", function () {
        window.clearTimeout(pressTimer);
    });

    // Dành cho di động
    resetButton.addEventListener("touchstart", function () {
        pressTimer = window.setTimeout(handleLongPress, 2000);
    });

    resetButton.addEventListener("touchend", function () {
        window.clearTimeout(pressTimer);
    });

    resetButton.addEventListener("touchleave", function () {
        window.clearTimeout(pressTimer);
    });

} else {
    // Dành cho máy tính
    deleteAllButton.addEventListener("click", function () {
        alert('Nhấn và giữ 3 giây để xoá toàn bộ.');
    });

    deleteAllButton.addEventListener("touchend", function () {
        window.clearTimeout(pressTimer);
    });

    deleteAllButton.addEventListener("touchleave", function () {
        window.clearTimeout(pressTimer);
    });

    // Dành cho máy tính
    resetButton.addEventListener("mousedown", function () {
        pressTimer = window.setTimeout(handleLongPress, 2000);
    });

    resetButton.addEventListener("mousend", function () {
        window.clearTimeout(pressTimer);
    });

    resetButton.addEventListener("mouseout", function () {
        window.clearTimeout(pressTimer);
    });
}
