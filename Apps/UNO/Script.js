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
        Fail('SmartPoint đã tắt');
    } else {
        smartPoint.classList.add("active");

        // Lấy tất cả các phần tử có class là "Tally"
        var tallyElements = document.getElementsByClassName('Tally');

        // Lấy số lượng phần tử có class là "Tally"
        var tallyCount = tallyElements.length;
        Point = tallyCount;
        Done('SmartPoint đã bật', 'Tính năng điểm thông minh, sẽ tự động tính toán số người chơi và cộng điểm một cách thông minh.');
    }

    smartPointActive = !smartPointActive;
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

function Done(message, additionalInfo) {
    console.log(message);
    if (additionalInfo) {
        console.log(additionalInfo);
    }
}

const HistoryTally = document.getElementById("HistoryTally");
let currentLog = null;
let timeoutId = null;

const jsonData = [
    [
        {
            "name": "Hùng",
            "fullname": "Hùng Đinh",
            "id": 61551995024526,
        },
        {
            "name": "Hoàng",
            "fullname": "Lê Huy Hoàng",
            "id": 100015905130912,
        },
        {
            "name": "Hiền",
            "fullname": "Bùi Thanh Hiền",
            "id": 100022625414871,
        },
        {
            "name": "Hoa",
            "fullname": "Nguyễn Thị Thanh Hoa",
            "id": 100037528999692,
        },
        {
            "name": "Thiện",
            "fullname": "Quang Thiện",
            "id": 100028302531768,
        },
        {
            "name": "Minh",
            "fullname": "Vũ Trần Quang Minh ",
            "id": 61552484927647,
        },

    ]
];

function findIdByName(itemName) {
    // Loop through jsonData to find the matching item
    for (let i = 0; i < jsonData[0].length; i++) {
        if (jsonData[0][i].name === itemName) {
            return jsonData[0][i].id;
        }
    }
    // Return null if no match found
    return null;
}

function addTally(itemName, quantity) {
    // Get or set itemName and quantity from input or default values
    itemName = itemName || document.getElementById("itemName").value;
    quantity = quantity || 0;

    // Capitalize the first letter of itemName
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    // Only proceed if itemName is not empty
    if (itemName.trim() !== "") {
        document.querySelector('.HistoryTally').classList.remove('Hidden');

        // Create the new tally element
        var newTally = document.createElement("div");
        newTally.className = "Tally";

        // Create the avatar element with the provided image URL
        var avatar = document.createElement("div");
        avatar.className = "Avatar";
        var avatarImg = document.createElement("img");
        var itemId = findIdByName(itemName);
        if (itemId) {
            avatarImg.src = `https://graph.facebook.com/${itemId}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        } else {
            avatarImg.src = "/DATA/logo.png"; // Replace with default avatar URL or handle as needed
        }
        avatar.appendChild(avatarImg);

        // Create the box element
        var box = document.createElement("div");
        box.className = "Box";

        // Create the head element with item name and delete button
        var head = document.createElement("div");
        head.className = "Head";

        var item = document.createElement("div");
        item.className = "Item";
        item.innerText = itemName;

        var delButton = document.createElement("button");
        delButton.className = "Del-Item";
        delButton.innerHTML = '<i class="fa-solid fa-ban"></i>';
        delButton.addEventListener("click", function () {
            Swal.fire({
                title: `Bạn muốn xoá ${itemName} ?`,
                text: "Chỉ bao gồm người chơi, điểm số.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Xoá",
                cancelButtonText: "Huỷ"
            }).then((result) => {
                if (result.isConfirmed) {
                    newTally.remove();
                    saveToLocalStorage(); // Assuming this function exists and handles local storage saving
                    Done('Xóa tất cả thành công.');
                }
            });
        });

        head.appendChild(item);
        head.appendChild(delButton);

        // Create the body element with buttons and input
        var body = document.createElement("div");
        body.className = "Body";

        var minusButton = document.createElement("button");
        minusButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
        minusButton.addEventListener("click", function () {
            var inputNumber = body.querySelector("input");
            inputNumber.value = Math.max(0, parseInt(inputNumber.value) - 1);
            logValueDelayed(itemName, -1); // Assuming this function exists
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

        // Assemble the tally structure
        box.appendChild(head);
        box.appendChild(body);
        newTally.appendChild(avatar);
        newTally.appendChild(box);

        document.getElementById("Tally").appendChild(newTally);

        saveToLocalStorage(); // Assuming this function exists and handles local storage saving
        document.getElementById("itemName").value = '';
        startTimer();
    } else {
        Warning('Vui lòng nhập tên người chơi');
    }
}


function logValueDelayed(itemName, quantity) {
    const currentTime = new Date();
    const timeString = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}}`;
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
resetButton.addEventListener("click", function () {
    Swal.fire({
        title: "Bạn có muốn đặt lại điểm số không ?",
        text: "Tất cả các người chơi sẽ trở về số 0. Hãy tắt SmartPoint nếu bật nhé !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yah sure",
        cancelButtonText: "Huỷ"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
            const tallyInputs = document.querySelectorAll(".Tally input");

            tallyInputs.forEach(input => {
                input.value = 0;
                localStorage.removeItem('historyLogs');
                document.getElementById("HistoryTally").innerHTML = '';
            });

            Done('Đặt lại thành công.');
            saveToLocalStorage();
        }
    });
});



const deleteAllButton = document.getElementById("DeleteAll");

deleteAllButton.addEventListener("click", function () {
    Swal.fire({
        title: "Bạn muốn xoá toàn bộ dữ liệu ?",
        text: "Bao gồm người chơi, điểm số và lịch sử.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yah sure",
        cancelButtonText: "Huỷ"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('tallies');
            localStorage.removeItem('historyLogs');
            document.getElementById("Tally").innerHTML = '';
            document.getElementById("HistoryTally").innerHTML = '';
            document.querySelector('.HistoryTally').classList.add('Hidden');

            Done('Xóa tất cả thành công.');
            resetTimer();
        }
    });
});





function Done(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'success'
    )
}

function Fail(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'error'
    )
}
function Warning(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'warning'
    )
}
function Info(T1, T2) {
    Swal.fire(
        T1,
        T2,
        'info'
    )
}

function Confirm(T1) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
}


let startTime;
let timerInterval;

function pad(value) {
    return value.toString().padStart(2, '0');
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    document.getElementById('timer').innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    localStorage.setItem('timerStartTime', startTime);
    localStorage.setItem('timerRunning', 'true');
}

function startTimer() {
    if (!timerInterval) {
        startTime = startTime || Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    document.getElementById('timer').innerText = '00:00:00';

    localStorage.removeItem('timerStartTime');
    localStorage.setItem('timerRunning', 'false');
}

window.onload = function() {
    const storedStartTime = localStorage.getItem('timerStartTime');
    const timerRunning = localStorage.getItem('timerRunning');

    if (timerRunning === 'true' && storedStartTime) {
        startTime = parseInt(storedStartTime, 10);
        startTimer();
    }
}