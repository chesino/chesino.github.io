function openTab(evt, Tabname) {
    var body = document.querySelector('body');
    var blur = document.querySelector('.Blur');

    // Declare all variables
    var i, tabcontent, tablinks;

    // Check if the Tabname is already active, then hide it and return
    var currentTab = document.getElementById(Tabname);
    if (currentTab.style.display === "block") {
        currentTab.style.display = "none";
        evt.currentTarget.className = evt.currentTarget.className.replace(" active", "");
        body.classList.remove('MenuON');
        return;
    }


    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("Tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        body.classList.remove('MenuON');
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("Func");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    blur.style.display = "block";
    body.classList.add('MenuON');
    currentTab.style.display = "block";
    evt.currentTarget.className += " active";

}

function closeTab() {
    var body = document.querySelector('body');
    var blur = document.querySelector('.Blur');
    var tabcontent = document.getElementsByClassName("Tabcontent");
    var tablinks = document.getElementsByClassName("Func");

    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    body.classList.remove('MenuON');
    blur.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    var blur = document.querySelector('.Blur');
    blur.addEventListener('click', closeTab);
});

let cashAmount = 0;
let cardAmount = 0;
let totalAmount = 0;
let transactionsHistory = [];
let debtAmount = 0;
let savingsAmount = 0;

document.addEventListener('DOMContentLoaded', function () {
    // Lấy giá trị tiền mặt từ localStorage (nếu tồn tại), nếu không thì mặc định là 0
    cashAmount = parseInt(localStorage.getItem('cashAmount')) || 0;
    cardAmount = parseInt(localStorage.getItem('cardAmount')) || 0;
    totalAmount = parseInt(localStorage.getItem('totalAmount')) || 0;
    debtAmount = parseInt(localStorage.getItem('debtAmount')) || 0;
    savingsAmount = parseInt(localStorage.getItem('savingsAmount')) || 0;
    totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;


    // Hiển thị giá trị số tiền mặt và tiền thẻ trong các phần tử displayCash và displayCard
    const displayCash = document.getElementById('displayCash');
    const displayCard = document.getElementById('displayCard');
    const displayTotal = document.getElementById('displayTotal');
    const tiennoDiv = document.getElementById('tienno');
    const savingsTotalDiv = document.getElementById('savingsTotal');


    displayCash.innerText = cashAmount.toLocaleString();
    displayCard.innerText = cardAmount.toLocaleString();
    displayTotal.innerText = totalAmount.toLocaleString();
    tiennoDiv.innerText = debtAmount.toLocaleString();
    savingsTotalDiv.innerText = savingsAmount.toLocaleString();
    displayTotal.innerText = totalAmount.toLocaleString();

    const savedTransactions = localStorage.getItem('transactionsHistory');
    if (savedTransactions) {
        transactionsHistory = JSON.parse(savedTransactions);
    }

    var marquee = document.getElementById('marquee');
    var storedText = localStorage.getItem('savedText');
    if (storedText !== null) {
        marquee.innerText = storedText;
    }

    // Hiển thị lịch sử giao dịch
    displayTransactionHistory();
    Rule503020();
});

function displayTransactionHistory() {
    const transactionDiv = document.getElementById('Transactions');
    transactionDiv.innerHTML = ''; // Xóa các giao dịch hiện tại để hiển thị lại toàn bộ lịch sử

    for (const transaction of transactionsHistory) {
        const p = document.createElement('p');
        p.innerHTML = transaction;
        transactionDiv.appendChild(p);
    }
}

function addMoney(cash, card) {
    const cashValue = parseInt(document.getElementById('cash').dataset.rawValue) || 0;
    const cardValue = parseInt(document.getElementById('card').dataset.rawValue) || 0;
    const cashWithdrawValue = parseInt(document.getElementById('cashWithdraw').dataset.rawValue) || 0;
    const cardWithdrawValue = parseInt(document.getElementById('cardWithdraw').dataset.rawValue) || 0;
    const TotalMoney = document.getElementById('displayTotal');
    const displayCash = document.getElementById('displayCash');
    const displayCard = document.getElementById('displayCard');

    // Cộng dồn số tiền mặt và tiền thẻ từ người dùng
    if (cash === undefined || cash === 0) {
        cashAmount += cashValue;
    }
    if (card === undefined || card === 0) {
        cardAmount += cardValue;
    }
    if (cash !== undefined || cash >= 0) {
        cashAmount += cash;
    }
    if (card !== undefined || card >= 0) {
        cardAmount += card;
    }

    // Trừ số tiền mặt và tiền thẻ từ người dùng
    cashAmount -= cashWithdrawValue;
    cardAmount -= cardWithdrawValue;

    // Cộng dồn giá trị mới từ người dùng vào tổng tiền
    const totalValue = cashAmount + cardAmount;

    TotalMoney.innerText = totalValue.toLocaleString();
    displayCash.innerText = cashAmount.toLocaleString();
    displayCard.innerText = cardAmount.toLocaleString();

    // Reset các giá trị input về 0 sau khi nhấn nút "Nhập"
    document.getElementById('cash').value = '';
    document.getElementById('card').value = '';
    document.getElementById('cashWithdraw').value = '';
    document.getElementById('cardWithdraw').value = '';
    document.getElementById('cash').dataset.rawValue = 0;
    document.getElementById('card').dataset.rawValue = 0;
    document.getElementById('cashWithdraw').dataset.rawValue = 0;
    document.getElementById('cardWithdraw').dataset.rawValue = 0;
    
    document.getElementById('cashNote').value = '';
    document.getElementById('cashWithdrawNote').value = '';

    localStorage.setItem('cashAmount', cashAmount);
    localStorage.setItem('cardAmount', cardAmount);
    localStorage.setItem('totalAmount', totalValue);

    let transactionMessage = '[' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '] ';
    const cashNote = document.getElementById('cashNote').value.trim();
    const cashWithdrawNote = document.getElementById('cashWithdrawNote').value.trim();

    if (cashValue > 0 || cardValue > 0 || cashWithdrawValue > 0 || cardWithdrawValue > 0) {
        if (cashValue > 0) {
            transactionMessage += 'Số dư Tiền Mặt +' + cashValue.toLocaleString() + 'đ.';
            if (cashNote !== '') {
                transactionMessage += cashNote + '.';
                
            }
        }

        if (cardValue > 0) {
            transactionMessage += 'Số dư Tiền Thẻ +' + cardValue.toLocaleString() + 'đ.';
            if (cashNote !== '') {
                transactionMessage += cashNote + '.';
            }
        }

        if (cashWithdrawValue > 0) {
            transactionMessage += 'Số dư Tiền Mặt -' + cashWithdrawValue.toLocaleString() + 'đ.';
            if (cashWithdrawNote !== '') {
                transactionMessage += cashWithdrawNote + '.';
            }
        }

        if (cardWithdrawValue > 0) {
            transactionMessage += 'Số dư Tiền Thẻ -' + cardWithdrawValue.toLocaleString() + 'đ.';
            if (cashWithdrawNote !== '') {
                transactionMessage += cashWithdrawNote + '.';
            }
        }
        displayTransaction(transactionMessage);
        // Thêm giao dịch mới vào đầu danh sách
        transactionsHistory.unshift(transactionMessage);
        SaveHistory();
        displayTransactionHistory();
        Trans('Thành công');
    }
    Rule503020();
    changeColor();
}
function SaveHistory() {
    // Giới hạn số lượng giao dịch lưu lại (nếu muốn)
    const maxTransactionHistory = 50; // Số lượng giao dịch tối đa muốn lưu lại
    if (transactionsHistory.length > maxTransactionHistory) {
        transactionsHistory.pop();
    }

    // Lưu lịch sử giao dịch vào localStorage
    localStorage.setItem('transactionsHistory', JSON.stringify(transactionsHistory));
}

function recordDebt() {
    const debtValue = parseInt(document.getElementById('debtAmount').dataset.rawValue) || 0;
    const payWho = document.getElementById('payWho').value;
    const debtWho = payWho;
    const payAmount = parseInt(document.getElementById('payAmount').dataset.rawValue) || 0;

    let transactionMessage = '[' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '] ';
    if (debtValue > 0) {
        addMoney(debtValue)
        debtAmount -= debtValue;
        const tiennoDiv = document.getElementById('tienno');
        tiennoDiv.innerText = debtAmount.toLocaleString();
        localStorage.setItem('debtAmount', debtAmount);
        transactionMessage += 'Số dư Tiền Mặt +' + debtValue.toLocaleString() + 'đ. Mượn của ' + debtWho + '.';
        displayTransaction(transactionMessage);
        transactionsHistory.unshift(transactionMessage);
        SaveHistory();
        changeColor();
    }
    if (debtAmount < 0) {
        if (payAmount > 0) {
            if (cashAmount >= payAmount) {
                addMoney(-payAmount, 0);
                debtAmount += payAmount;
                const tiennoDiv = document.getElementById('tienno');
                tiennoDiv.innerText = debtAmount.toLocaleString();
                localStorage.setItem('debtAmount', debtAmount);
                transactionMessage += 'Số dư Tiền Mặt -' + payAmount.toLocaleString() + 'đ Trả cho ' + payWho + '.';
                displayTransaction(transactionMessage);
                transactionsHistory.unshift(transactionMessage);
            } else {
                if (cardAmount >= payAmount) {
                    addMoney(0, -payAmount);
                    debtAmount += payAmount;
                    const tiennoDiv = document.getElementById('tienno');
                    tiennoDiv.innerText = debtAmount.toLocaleString();
                    localStorage.setItem('debtAmount', debtAmount);
                    transactionMessage += 'Số dư Tiền Thẻ -' + payAmount.toLocaleString() + 'đ Trả cho ' + payWho + '.';
                    displayTransaction(transactionMessage);
                    transactionsHistory.unshift(transactionMessage);
                } else {
                    Warning('Tài khoản của bạn không đủ để trả nợ.');
                };
            };
            
            SaveHistory();
            changeColor();
        }
        Trans('Thành công');
    } else {
        Warning('Có nợ ai đâu mà trả 🤔')
    }

    document.getElementById('payWho').value = '';
    document.getElementById('debtAmount').value = 0;
    document.getElementById('payAmount').value = 0;
    document.getElementById('debtAmount').dataset.rawValue = 0;
    document.getElementById('payAmount').dataset.rawValue = 0;

    changeColor();
}

function saveSavings() {
    let transactionMessage = '[' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + '] ';
    const savingsValue = parseInt(document.getElementById('savingsAmount').dataset.rawValue) || 0;
    if (savingsValue > 0) {

        if (cashAmount >= savingsValue) {
            addMoney(-savingsValue, 0);
            savingsAmount += savingsValue;
            transactionMessage += 'Số dư Tiết Kiệm +' + savingsValue.toLocaleString() + 'đ.';
            displayTransaction(transactionMessage);
            transactionsHistory.unshift(transactionMessage);
            Trans('Thành công');
        } else {
            if (cardAmount >= savingsValue) {
                addMoney(0, -savingsValue);
                savingsAmount += savingsValue;
                transactionMessage += 'Số dư Tiết Kiệm +' + savingsValue.toLocaleString() + 'đ.';
                displayTransaction(transactionMessage);
                transactionsHistory.unshift(transactionMessage);
            } else {
                Warning('Không có đủ tiền bà đặt tiết kiệm 🤣.');
            }

        }
        
        
        SaveHistory();
        const savingsTotalDiv = document.getElementById('savingsTotal');
        savingsTotalDiv.innerText = savingsAmount.toLocaleString();
        localStorage.setItem('savingsAmount', savingsAmount);
    }
    document.getElementById('savingsAmount').value = '';
    document.getElementById('withdrawalAmount').value = '';
    document.getElementById('savingsAmount').dataset.rawValue = 0;
    document.getElementById('withdrawalAmount').dataset.rawValue = 0;

    Rule503020();
    changeColor();
}

function withdrawSavings() {
    let transactionMessage = new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString() + ' - ';
    const withdrawalValue = parseInt(document.getElementById('withdrawalAmount').dataset.rawValue) || 0;
    if (withdrawalValue > 0 && withdrawalValue <= savingsAmount) {
        savingsAmount -= withdrawalValue;
        const savingsTotalDiv = document.getElementById('savingsTotal');
        savingsTotalDiv.innerText = savingsAmount.toLocaleString();

        addMoney(withdrawalValue);
        localStorage.setItem('savingsAmount', savingsAmount);
        transactionMessage += 'Số dư Tiết Kiệm -' + withdrawalValue.toLocaleString() + 'đ.';
        displayTransaction(transactionMessage);
        transactionsHistory.unshift(transactionMessage);
        SaveHistory();
        Trans('Thành công')
    } else {
        Warning('vượt quá số dư');
    }
    document.getElementById('savingsAmount').value = '';
    document.getElementById('withdrawalAmount').value = '';
    document.getElementById('savingsAmount').dataset.rawValue = 0;
    document.getElementById('withdrawalAmount').dataset.rawValue = 0;
    Rule503020();
    changeColor();
}

function TinhTienMuaHang() {
    var GiaGocSanPham = document.getElementById('GiaGocSanPham').dataset.rawValue;
    var GiaSanPham = document.getElementById('GiaSanPham').dataset.rawValue;
    var CoNenMuaKhong = document.getElementById('CoNenMuaKhong');

    var ptram = GiaSanPham * 100 / totalAmount;
    var giamgia = GiaGocSanPham - GiaSanPham;
    var ptramgiamgia = giamgia * 100 / GiaGocSanPham;

    if (GiaSanPham >= totalAmount) {
        if (ptramgiamgia >= 50) {
            CoNenMuaKhong.innerHTML = `
        <p class="alert red">⚠ Nếu mua sẽ hết <strong>${ptram.toFixed(2)}%</strong> tổng số tiền của bạn.</p>
        <p class="alert green" >✅ <strong>${giamgia.toLocaleString()}đ | ${ptramgiamgia.toFixed(1)}%</strong> so với giá gốc.</p>
        `
        } else {
            CoNenMuaKhong.innerHTML = `
            <p class="alert red" >⚠ Nếu mua sẽ hết <strong>${ptram.toFixed(2)}%</strong> tổng số tiền của bạn.</p>
            <p class="alert red" >⚠ <strong>${giamgia.toLocaleString()}đ | ${ptramgiamgia.toFixed(1)}%</strong> so với giá gốc.</p>
            `
        }
    }
    if (GiaSanPham < totalAmount) {
        if (ptramgiamgia >= 20) {
            CoNenMuaKhong.innerHTML = `
        <p class="alert green">✅ Nếu mua sẽ hết <strong>${ptram.toFixed(2)}%</strong> tổng số tiền của bạn.</p>
        <p class="alert green" >✅ <strong>${giamgia.toLocaleString()}đ | ${ptramgiamgia.toFixed(1)}%</strong> so với giá gốc.</p>
        `
        } else {
            CoNenMuaKhong.innerHTML = `
            <p class="alert green">✅Nếu mua sẽ hết <strong>${ptram.toFixed(2)}%</strong> tổng số tiền của bạn.</p>
            <p><strong>${giamgia.toLocaleString()}đ | ${ptramgiamgia.toFixed(1)}%</strong> so với giá gốc.</p>
            `
        }
    }


}

function displayTransaction(message) {
    const transactionDiv = document.getElementById('Transactions');
    const p = document.createElement('p');
    p.innerHTML = message;
    // Thêm giao dịch mới vào đầu danh sách
    transactionDiv.insertBefore(p, transactionDiv.firstChild);
}


function exportTransactions() {
    const textToSave = transactionsHistory.join('\n');
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lịch Sử Giao Dịch.txt';
    a.click();
}

let clickCount = 0;
// Hàm thực hiện chức năng xoá toàn bộ giao dịch
function clearTransactions() {
    clickCount++;
    if (clickCount === 2) {
        transactionsHistory = [];
        localStorage.removeItem('transactionsHistory');
        displayTransactionHistory();
        clickCount = 0; // Reset số lần bấm về 0 sau khi xóa lịch sử
    }
}

function changeColor() {
    var spanElements = document.querySelectorAll('.Card.Money h1 ');
    for (var i = 0; i < spanElements.length; i++) {
        var spanElement = spanElements[i];
        var value = parseFloat(spanElement.innerText);

        if (value < 0) {
            spanElement.classList.add('red');
            spanElement.classList.remove('green');
        } else if (value > 1) {
            spanElement.classList.add('green');
            spanElement.classList.remove('red');
        } else {
            // Remove both classes if value is between 0 and 1
            spanElement.classList.remove('red', 'green');
        }
    }

    //Lịch sử giao dịch 
    const transactions = document.querySelectorAll('#Transactions p');

    // Duyệt qua từng thẻ p để thêm lớp CSS tương ứng
    transactions.forEach((p) => {
        if (p.textContent.includes('+')) {
            p.classList.add('green');
        } else if (p.textContent.includes('-')) {
            p.classList.add('red');
        }
    });
}

window.addEventListener('load', changeColor);

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

function Note() {
    var marquee = document.getElementById('marquee');
    var inputText = confirm("Nhấn OK nếu bạn muốn thay đổi văn bản.");

    if (inputText) {
        var text = prompt("Nhập văn bản của bạn:");
        if (text !== null) {
            marquee.innerText = text;
            // Lưu văn bản vào local storage
            localStorage.setItem('savedText', text);
        } else {
            alert("Bạn đã hủy nhập liệu.");
        }
    }
}


function Rule503020() {
    totalAmount = parseInt(localStorage.getItem('totalAmount')) || 0;
    document.getElementById('ToltalMoney').innerText = formatWithDots(totalAmount + savingsAmount);

    var v50 = totalAmount * 50 / 100;
    var v30 = totalAmount * 30 / 100;
    var v20 = totalAmount * 20 / 100;

    var v502 = (totalAmount + savingsAmount) * 50 / 100;
    var v202 = 100 - 50 - (savingsAmount * 100) / (totalAmount + savingsAmount);
    var v302 = (totalAmount + savingsAmount) * v202 / 100;


    var v203 = (savingsAmount * 100) / (totalAmount + savingsAmount);
    var v503 = totalAmount * 70 / 100;
    var v303 = totalAmount * 30 / 100;

    if (totalAmount > 0) {
        if (savingsAmount <= 0) {
            document.getElementById('save20').innerText = '+' + formatWithDots(v20) + 'đ';
            document.getElementById('ThietYeu').innerText = formatWithDots(v50);
            document.getElementById('TieuSai').innerText = formatWithDots(v30);
            document.getElementById('ptsave50').innerText = '50%';
            document.getElementById('ptsave30').innerText = '30%';
            document.getElementById('ptsave20').innerText = '20%';
        } else {
            document.getElementById('save20').innerText = '';
            document.getElementById('ThietYeu').innerText = formatWithDots(v502);
            document.getElementById('TieuSai').innerText = formatWithDots(v302);
            document.getElementById('ptsave50').innerText = '50%';
            document.getElementById('ptsave30').innerText = '30%';
            document.getElementById('ptsave20').innerText = '20%';
        }
        if (v203 > 30) {
            document.getElementById('save20').innerText = '';
            document.getElementById('ThietYeu').innerText = formatWithDots(v503);
            document.getElementById('TieuSai').innerText = formatWithDots(v303);
            document.getElementById('ptsave50').innerText = (100 - v203) / 2 + '%';
            document.getElementById('ptsave30').innerText = (100 - v203) / 2 + '%';
            document.getElementById('ptsave20').innerText = v203 + '%';
        }
    }

}

function exportData() {
    const dataToExport = {
        cashAmount,
        cardAmount,
        totalAmount,
        debtAmount,
        savingsAmount,
        transactionsHistory
    };

    const dataString = JSON.stringify(dataToExport);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'DuLieu.json';
    a.click();
}

function importData() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.json';
    inputElement.addEventListener('change', handleFileSelect);
    inputElement.click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const importedData = JSON.parse(e.target.result);

            // Gán giá trị từ dữ liệu nhập vào biến
            cashAmount = importedData.cashAmount;
            cardAmount = importedData.cardAmount;
            totalAmount = importedData.totalAmount;
            debtAmount = importedData.debtAmount;
            savingsAmount = importedData.savingsAmount;
            transactionsHistory = importedData.transactionsHistory;

            // Hiển thị lại dữ liệu sau khi nhập
            displayData();

            // Lưu lại dữ liệu vào localStorage
            localStorage.setItem('cashAmount', cashAmount);
            localStorage.setItem('cardAmount', cardAmount);
            localStorage.setItem('totalAmount', totalAmount);
            localStorage.setItem('debtAmount', debtAmount);
            localStorage.setItem('savingsAmount', savingsAmount);
            localStorage.setItem('transactionsHistory', JSON.stringify(transactionsHistory));

            // Thông báo nhập dữ liệu thành công
            Info('Nhập Dữ Liệu', 'Dữ liệu đã được nhập thành công.');
        };

        reader.readAsText(file);
    }
}

function displayData() {
    // Hiển thị dữ liệu vào các phần tử HTML
    const displayCash = document.getElementById('displayCash');
    const displayCard = document.getElementById('displayCard');
    const displayTotal = document.getElementById('displayTotal');
    const tiennoDiv = document.getElementById('tienno');
    const savingsTotalDiv = document.getElementById('savingsTotal');


    displayCash.innerText = cashAmount.toLocaleString();
    displayCard.innerText = cardAmount.toLocaleString();
    displayTotal.innerText = totalAmount.toLocaleString();
    tiennoDiv.innerText = debtAmount.toLocaleString();
    savingsTotalDiv.innerText = savingsAmount.toLocaleString();

    // Hiển thị lịch sử giao dịch
    SaveHistory();
    displayTransactionHistory();
    Rule503020();
}

document.addEventListener('DOMContentLoaded', function () {
    // Get all input elements with the class 'inputFM'
    var inputFields = document.querySelectorAll('.inputFM');

    // Attach a keyup event listener to each input field
    inputFields.forEach(function (inputField) {
        inputField.addEventListener('keyup', function (event) {
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
function Trans(T1) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
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

function Clear() {
    localStorage.clear();
}

function Wallet532() {
    var W532 = document.getElementById('Wallet532');
    
    // Toggle the "Show" class
    W532.classList.toggle("Show");

    // Check if the "Show" class is present after toggling
    var isWalletVisible = W532.classList.contains("Show");

    // Save the state to local storage
    localStorage.setItem('Wallet532State', isWalletVisible);
}

// Load the initial state from local storage when the page loads
document.addEventListener('DOMContentLoaded', function () {
    var W532 = document.getElementById('Wallet532');
    
    // Get the stored state from local storage
    var storedState = localStorage.getItem('Wallet532State');

    // If there's a stored state, apply it to the element
    if (storedState !== null) {
        var isWalletVisible = JSON.parse(storedState);
        
        // Toggle the "Show" class based on the stored state
        if (isWalletVisible) {
            W532.classList.add("Show");
        } else {
            W532.classList.remove("Show");
        }
    }
});
