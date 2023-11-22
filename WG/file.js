let totalCalories = parseInt(localStorage.getItem('totalCalories')) || 0;
let todayCalories = 2900; // Đã sửa giá trị từ 3000 thành 2900 để phù hợp với mục tiêu trong HTML
let lastSavedDate = localStorage.getItem('lastSavedDate') || getCurrentDate();

document.addEventListener('DOMContentLoaded', function () {
    const currentCaloriesElement = document.getElementById('currentCalories');
    currentCaloriesElement.textContent = totalCalories;

    const todayCaloriesElement = document.getElementById('todayCalories');
    const now = new Date();
    const formattedDateTime = `${now.getHours()}:${now.getMinutes()} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    todayCaloriesElement.textContent = formattedDateTime;

    // Check if it's a new day
    if (getCurrentDate() !== lastSavedDate) {
        const historyDaysElement = document.getElementById('historyDays');
        const historyItem = document.createElement('p');
        historyItem.textContent = `Ngày hôm qua, bạn đã bổ sung tổng cộng ${totalCalories} Calo.`;
        historyDaysElement.appendChild(historyItem);

        // Reset totalCalories for the new day
        totalCalories = 0;

        // Save the new date to localStorage
        lastSavedDate = getCurrentDate();
        localStorage.setItem('lastSavedDate', lastSavedDate);
    }

    // Restore history from localStorage
    const historyElement = document.getElementById('history');
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    storedHistory.forEach(item => {
        const historyItem = document.createElement('p');
        historyItem.textContent = item;
        historyElement.appendChild(historyItem);
    });
});

function addCalories() {
    const foodNameInput = document.getElementById('foodName');
    const caloriesAmountInput = document.getElementById('caloriesAmount');
    const timeInput = document.getElementById('timeInput');

    const foodName = foodNameInput.value;
    const caloriesAmount = parseInt(caloriesAmountInput.value);
    const selectedTime = timeInput.value;

    if (isNaN(caloriesAmount) || !selectedTime) {
        alert('Vui lòng nhập thông tin đầy đủ và chính xác.');
        return;
    }

    totalCalories += caloriesAmount;

    if (totalCalories === todayCalories) {
        alert('Bạn đã hoàn thành');
    }
    if (totalCalories === todayCalories / 2) {
        alert('Bạn đã hoàn thành 1/2');
    }

    const currentCaloriesElement = document.getElementById('currentCalories');
    currentCaloriesElement.textContent = totalCalories;

    const historyElement = document.getElementById('history');
    const historyDaysElement = document.getElementById('historyDays');
    
    const historyItem = document.createElement('p');
    const formattedDateTime = selectedTime;
    historyItem.textContent = `${formattedDateTime} - Bạn đã bổ sung ${caloriesAmount} Calo bằng ${foodName}.`;
    historyElement.appendChild(historyItem);

    // Update history in localStorage
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    storedHistory.push(`${formattedDateTime} - Bạn đã bổ sung ${caloriesAmount} Calo bằng ${foodName}.`);
    localStorage.setItem('history', JSON.stringify(storedHistory));

    // Check if it's a new day
    if (getCurrentDate() !== lastSavedDate) {
        const historyItem = document.createElement('p');
        historyItem.textContent = `Ngày hôm qua, bạn đã bổ sung tổng cộng ${totalCalories} Calo.`;
        historyDaysElement.appendChild(historyItem);

        // Reset totalCalories for the new day
        totalCalories = 0;

        // Save the new date to localStorage
        lastSavedDate = getCurrentDate();
        localStorage.setItem('lastSavedDate', lastSavedDate);
    }

    // Reset input values
    foodNameInput.value = '';
    caloriesAmountInput.value = '';

    // Update the time input
    const timeNow = now.toTimeString().split(' ')[0]; // Get HH:mm format
    timeInput.value = timeNow;

    // Save to localStorage
    localStorage.setItem('totalCalories', totalCalories);
}

function undoLastCalories() {
    const historyElement = document.getElementById('history');
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];

    if (storedHistory.length > 0) {
        const lastItem = storedHistory.pop();
        const caloRegex = /\d+/;
        const lastCaloAmount = parseInt(lastItem.match(caloRegex)[0]);

        totalCalories -= lastCaloAmount;

        const currentCaloriesElement = document.getElementById('currentCalories');
        currentCaloriesElement.textContent = totalCalories;

        // Update history in localStorage
        localStorage.setItem('totalCalories', totalCalories);
        localStorage.setItem('history', JSON.stringify(storedHistory));

        // Remove last item from the displayed history
        historyElement.removeChild(historyElement.lastChild);
    } else {
        alert('Không có calo nào để hoàn lại.');
    }
}

function getCurrentDate() {
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
}

setInterval(updateDateTime, 1000);

function updateDateTime() {
    const todayCaloriesElement = document.getElementById('todayCalories');
    const now = new Date();
    const formattedDateTime = `${now.getHours()}:${now.getMinutes()} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    todayCaloriesElement.textContent = formattedDateTime;

    // Check if it's a new day
    if (getCurrentDate() !== lastSavedDate) {
        const historyDaysElement = document.getElementById('historyDays');
        const historyItem = document.createElement('p');
        historyItem.textContent = `Ngày hôm qua, bạn đã bổ sung tổng cộng ${totalCalories} Calo.`;
        historyDaysElement.appendChild(historyItem);

        // Reset totalCalories for the new day
        totalCalories = 0;

        // Save the new date to localStorage
        lastSavedDate = getCurrentDate();
        localStorage.setItem('lastSavedDate', lastSavedDate);
    }
}
