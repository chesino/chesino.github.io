
const dailyLimits = {
    1: 100000, // Thứ 2
    2: 100000, // Thứ 3
    3: 100000, // Thứ 4
    4: 100000, // Thứ 5
    5: 120000, // Thứ 6
    6: 250000, // Thứ 7
    0: 120000  // Chủ nhật
};

const today = new Date();
const dateString = today.toLocaleDateString('vi-VN');

let storedTransactions = JSON.parse(localStorage.getItem('storedTransactions')) || {};
let transactions = storedTransactions[dateString] || [];
const dailyLimit = dailyLimits[today.getDay()];
document.getElementById('daily-limit').innerHTML = `<i class="fa-solid fa-receipt"></i> ` + formatWithDots(dailyLimit) + 'đ';

function updateProgress() {
  const totalSpent = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const remaining = dailyLimit - totalSpent;
  const percent = (remaining / dailyLimit) * 100;
  const progressBar = document.getElementById('progress');

  if (remaining < 0) {
    progressBar.style.width = '100%';
    progressBar.classList.add('over-limit');
    const overSpentPercent = ((totalSpent - dailyLimit) / dailyLimit) * 100;
    progressBar.textContent = `Vượt quá ${overSpentPercent.toFixed(2)}%`;
  } else {
    progressBar.style.width = percent + '%';
    progressBar.classList.remove('over-limit');
    progressBar.textContent = '';
  }
  document.getElementById('remaining-balance').innerHTML =  formatWithDots(remaining) + 'đ';
}
function renderTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <span>${formatWithDots(transaction.amount)}Ω -${transaction.note}</span>
            <button onclick="editTransaction(${index})">Sửa</button>
            <button onclick="deleteTransaction(${index})">Xóa</button>
        `;
        transactionList.appendChild(div);
    });
    updateProgress();
}

function addTransaction() {
    const amount = parseInt(document.getElementById('amount').dataset.rawValue);
    const note = document.getElementById('note').value;
    if (isNaN(amount) || amount <= 0 || !note) {
        alert('Vui lòng nhập số tiền và ghi chú hợp lệ');
        return;
    }
    transactions.push({ amount, note });
    storedTransactions[dateString] = transactions;
    localStorage.setItem('storedTransactions', JSON.stringify(storedTransactions));
    document.getElementById('amount').value = '';
    document.getElementById('note').value = '';
    renderTransactions();
}

function editTransaction(index) {
    const amount = prompt('Nhập số tiền mới:', transactions[index].amount);
    const note = prompt('Nhập ghi chú mới:', transactions[index].note);
    if (amount && note) {
        transactions[index] = { amount: parseInt(amount), note };
        storedTransactions[dateString] = transactions;
        localStorage.setItem('storedTransactions', JSON.stringify(storedTransactions));
        renderTransactions();
    }
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    storedTransactions[dateString] = transactions;
    localStorage.setItem('storedTransactions', JSON.stringify(storedTransactions));
    renderTransactions();
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    for (let date in storedTransactions) {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<button onclick="viewTransactions('${date}')">${date}</button>`;
        historyList.appendChild(div);
    }
}

function viewTransactions(date) {
    const transactionsForDate = storedTransactions[date];
    if (!transactionsForDate) {
        // Nếu không có giao dịch nào cho ngày này, hiển thị số dư là 0
        document.getElementById('history-paragraph').innerHTML = `Ngày ${date}<br>Số tiền đã dùng: 0đ<br>Số dư còn lại: ${formatWithDots(dailyLimit)}đ`;
        return;
    }
    
    const dailyLimitForDate = dailyLimits[new Date(date).getDay()];
    const totalSpent = transactionsForDate.reduce((total, transaction) => total + transaction.amount, 0);
    const remaining = dailyLimitForDate - totalSpent;

    document.getElementById('history-paragraph').innerHTML = `Ngày ${date}<br>Số tiền đã dùng: ${formatWithDots(totalSpent)}đ<br>Số dư còn lại: ${formatWithDots(remaining)}đ`;
}

function checkNewDay() {
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit && lastVisit !== dateString) {
        storedTransactions[lastVisit] = transactions;
        localStorage.setItem('storedTransactions', JSON.stringify(storedTransactions));
        transactions = [];
    }
    localStorage.setItem('lastVisit', dateString);
}

checkNewDay();
renderTransactions();
renderHistory();

document.addEventListener('DOMContentLoaded', function() {
  // Get all input elements with the class 'inputFM'
  var inputFields = document.querySelectorAll('.inputFM');

  // Attach a keyup event listener to each input field
  inputFields.forEach(function(inputField) {
    inputField.addEventListener('keyup', function(event) {
      // Check if the pressed key is Enter (key code 13)
      if (event.keyCode === 13) {
        // Get the parent Card element to determine which button to click
        var parentCard = inputField.closest('.Card');

        // Find the button inside the parent Card and trigger its click event
        var button = parentCard.querySelector('button');
        if (button) {
          button.click();
        }
      }
    });
  });
});

const inputElements = document.querySelectorAll('.inputFM');
inputElements.forEach((input) => {
  input.addEventListener('input', formatNumber);
});

function formatNumber(event) {
  let input = event.target;
  let rawValue = input.value.replace(/\./g, ''); // Lưu trữ giá trị gốc (loại bỏ dấu chấm)
  let formattedValue = formatWithDots(rawValue);
  input.value = formattedValue;
  input.dataset.rawValue = rawValue; // Lưu trữ giá trị gốc trong thuộc tính 'data-raw-value'
}

function formatWithDots(value) {
  if (isNaN(value)) {
    return ''; // Nếu không phải là số thì trả về chuỗi rỗng
  }

  // Chuyển đổi giá trị thành số nguyên từ chuỗi đã loại bỏ dấu chấm
  let intValue = parseInt(value, 10);

  let parts = intValue.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join('.');
}
