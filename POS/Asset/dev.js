// Xem dung lượng đã lưu
function getLocalStorageSizeInKB() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
    }
    // mỗi ký tự ~2 bytes (UTF-16), chuyển ra KB
    return (total * 2) / 1024;
}


// DEV
async function logCameraInfo() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        console.log('Danh sách camera:');
        videoDevices.forEach((device, index) => {
            console.log(`Camera ${index + 1}:`);
            console.log(`- Label: ${device.label || 'Không có (cần cấp quyền)'}`);
            console.log(`- Device ID: ${device.deviceId}`);
            console.log(`- Group ID: ${device.groupId}`);
            console.log('--------------------------');
        });
    } catch (err) {
        console.error('Không thể lấy thông tin thiết bị:', err);
    }
}


function checkPassword() {
    const correctPassword = "HunqD"; // Đổi thành mật khẩu bạn muốn
    const userInput = document.getElementById("passwordInput").value;

    if (userInput === correctPassword) {
        // Hiện tất cả các div có class "dev"
        document.querySelectorAll(".dev").forEach(el => {
            el.style.display = "block";
        });
    } else {
        document.querySelectorAll(".dev").forEach(el => {
            el.style.display = "none";
        });
    }
}

// Ghi lại console log
(function () {
    const original = {
        log: console.log,
        error: console.error,
        warn: console.warn
    };
    ['log', 'error', 'warn'].forEach(fn => {
        console[fn] = function (...args) {
            original[fn].apply(console, args);
            const out = document.getElementById("commandOutput");
            if (out) {
                out.textContent += `[console.${fn}] ` + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\n';
            }
        };
    });
})();

// Chạy lệnh JS
function runDevCommand() {
    const input = document.getElementById("commandInput").value;
    const outputEl = document.getElementById("commandOutput");
    try {
        const result = eval(input);
        outputEl.textContent += '\n✅ Kết quả:\n' + formatResult(result) + '\n';
    } catch (e) {
        outputEl.textContent += '\n❌ Lỗi:\n' + e.message + '\n';
    }
}

// Format kết quả trả về
function formatResult(res) {
    if (typeof res === 'object') {
        try {
            return JSON.stringify(res, null, 2);
        } catch {
            return res.toString();
        }
    }
    return String(res);
}

// Xem dung lượng LocalStorage
function getLocalStorageSizeInKB() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
    }
    return (total * 2) / 1024;
}

function showLocalStorageSize() {
    const kb = getLocalStorageSizeInKB();
    console.log(`📦 LocalStorage đang dùng khoảng ${kb.toFixed(2)} KB`);
}

// Camera info
async function logCameraInfo() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        videoDevices.forEach((device, index) => {
            console.log(`Camera ${index + 1}:`);
            console.log(`- Label: ${device.label || 'Không có (cần cấp quyền)'}`);
            console.log(`- Device ID: ${device.deviceId}`);
            console.log(`- Group ID: ${device.groupId}`);
        });
    } catch (err) {
        console.error('Không thể lấy thông tin thiết bị:', err);
    }
}

// Hiện các hàm toàn cục
function listGlobalFunctions() {
    const funcs = Object.entries(window)
        .filter(([key, val]) => typeof val === 'function')
        .map(([key]) => key)
        .sort();
    console.log("📑 Hàm toàn cục:");
    console.log(funcs.join('\n'));
}

// Hiện biến toàn cục (không phải function)
function listGlobalVariables() {
    const vars = Object.entries(window)
        .filter(([key, val]) => typeof val !== 'function')
        .map(([key]) => key)
        .sort();
    console.log("🌐 Biến toàn cục:");
    console.log(vars.join('\n'));
}

// Xóa output
function clearConsole() {
    const out = document.getElementById("commandOutput");
    if (out) out.textContent = '';
    console.clear();
}

function listGlobalFunctions() {
    const funcs = Object.entries(window)
        .filter(([key, val]) => typeof val === 'function' && !key.startsWith('on'))
        .map(([key]) => key)
        .sort();

    const ul = document.getElementById("functionList");
    ul.innerHTML = "";

    funcs.forEach(fnName => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.style.padding = "4px 8px";
        li.style.borderBottom = "1px solid #ddd";
        li.textContent = fnName;
        li.title = `Chạy thử ${fnName}()`;

        li.onclick = () => {
            try {
                const result = window[fnName]();
                logOutput(`▶️ Gọi ${fnName}():\n` + formatResult(result));
            } catch (e) {
                logOutput(`❌ Lỗi khi chạy ${fnName}(): ${e.message}`);
            }
        };

        ul.appendChild(li);
    });

    console.log("📑 Đã liệt kê " + funcs.length + " hàm toàn cục.");
}

function logOutput(message) {
    const outputEl = document.getElementById("commandOutput");
    outputEl.textContent += message + "\n";
}


function renderTable() {
    const tableBody = document.querySelector("#storageTable tbody");
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ

    if (localStorage.length === 0) {
        const row = `<tr><td colspan="3" style="text-align:center;">Không có dữ liệu</td></tr>`;
        tableBody.innerHTML = row;
        return;
    }

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const row = `
        <tr>
          <td>${key}</td>
          <td>${value.length > 100 ? value.substring(0, 100) + "..." : value}</td>
          <td><button onclick="deleteItem('${key}')">Xoá</button></td>
        </tr>
      `;
        tableBody.innerHTML += row;
    }
}

function deleteItem(key) {
    if (confirm(`Bạn có chắc chắn muốn xoá "${key}"?`)) {
        localStorage.removeItem(key);
        renderTable();
    }
}

function clearAll() {
    if (confirm('Bạn có chắc chắn muốn xoá toàn bộ dữ liệu LocalStorage?')) {
        localStorage.clear();
        renderTable();
    }
}

// Khi mở trang, load bảng
renderTable();




const driver = window.driver.js.driver;

// Danh sách các bước
const stepsPart1 = [
    {
        element: '.search-box input',
        popover: {
            title: 'Tìm kiếm dịch vụ',
            description: 'Bạn có thể nhập tên dịch vụ để tìm nhanh hơn.',
            position: 'bottom'
        }
    },
    {
        element: '#scan-barcode',
        popover: {
            title: 'Quét mã',
            description: 'Dùng nút này để quét mã vạch tìm dịch vụ nhanh.',
            position: 'left'
        }
    },
    {
        element: '.categories-wrapper',
        popover: {
            title: 'Danh mục dịch vụ',
            description: 'Chọn danh mục để lọc các dịch vụ theo nhu cầu.',
            position: 'bottom'
        }
    },
    {
        element: '.products-grid',
        popover: {
            title: 'Danh sách dịch vụ',
            description: 'Nhấn vào từng dịch vụ để thêm vào giỏ hàng.',
            position: 'top'
        }
    },
    {
        element: '.product-item[data-id="2"]',
        popover: {
            title: 'Ví dụ: Cắt tóc',
            description: 'Nhấn vào đây để thêm dịch vụ "Cắt tóc" vào đơn.',
            position: 'left'
        }
    }
];

const stepsPart2 = [
    {
        element: '#invoiceSelect',
        popover: {
            title: 'Chọn ghế',
            description: 'Chọn ghế (hoá đơn) bạn muốn thao tác.',
            position: 'bottom'
        }
    },
    {
        element: '#customer-name',
        popover: {
            title: 'Khách hàng',
            description: 'Nhập tên hoặc số điện thoại khách hàng.',
            position: 'bottom'
        }
    },
    {
        element: '#addNewCustomerBtn',
        popover: {
            title: 'Thêm khách',
            description: 'Bấm để thêm khách hàng mới.',
            position: 'left'
        }
    },
    {
        element: '#staff-name',
        popover: {
            title: 'Thu ngân',
            description: 'Chọn người đang thực hiện giao dịch.',
            position: 'bottom'
        }
    },
    {
        element: '#cart-items',
        popover: {
            title: 'Giỏ hàng',
            description: 'Danh sách các dịch vụ hoặc sản phẩm đã chọn.',
            position: 'top'
        }
    },
    {
        element: '.cart-item:first-child input[type="text"]',
        popover: {
            title: 'Tên dịch vụ',
            description: 'Sửa tên dịch vụ trực tiếp tại đây.',
            position: 'bottom'
        }
    },
    {
        element: '.cart-item:first-child .cart-item-price',
        popover: {
            title: 'Giá dịch vụ',
            description: 'Nhập hoặc điều chỉnh giá tiền.',
            position: 'bottom'
        }
    },
    {
        element: '.cart-item:first-child .quantity-value',
        popover: {
            title: 'Số lượng',
            description: 'Thay đổi số lượng dịch vụ.',
            position: 'bottom'
        }
    },
    {
        element: '.cart-item:first-child .cart-item-remove',
        popover: {
            title: 'Xoá dịch vụ',
            description: 'Nhấn để xoá dịch vụ này khỏi giỏ hàng.',
            position: 'left'
        }
    },
    {
        element: '#payment-method',
        popover: {
            title: 'Phương thức thanh toán',
            description: 'Chọn cách khách hàng thanh toán.',
            position: 'bottom'
        }
    },
    {
        element: '.switch',
        popover: {
            title: 'Loại chiết khấu',
            description: 'Chuyển đổi giữa chiết khấu phần trăm (%) và số tiền (đ).',
            position: 'bottom'
        }
    },
    {
        element: '#discount',
        popover: {
            title: 'Chiết khấu (%)',
            description: 'Nhập số phần trăm chiết khấu nếu đang chọn theo %.',
            position: 'bottom'
        }
    },
    {
        element: '.option-right',
        popover: {
            title: 'Chiết khấu (đ)',
            description: 'Hoặc nhập số tiền chiết khấu nếu chọn theo số tiền.',
            position: 'bottom'
        }
    },
    {
        element: '#subtotal',
        popover: {
            title: 'Tổng tiền',
            description: 'Tổng tiền hàng trước khi chiết khấu.',
            position: 'left'
        }
    },
    {
        element: '#discount-info',
        popover: {
            title: 'Số tiền chiết khấu',
            description: 'Đây là mức giảm giá đã áp dụng.',
            position: 'left'
        }
    },
    {
        element: '#total',
        popover: {
            title: 'Thành tiền',
            description: 'Số tiền khách cần thanh toán sau khi chiết khấu.',
            position: 'left'
        }
    },
    {
        element: '.clear-cart',
        popover: {
            title: 'Xoá giỏ hàng',
            description: 'Xoá toàn bộ dịch vụ trong giỏ hàng.',
            position: 'top'
        }
    },
    {
        element: '.print-btn',
        popover: {
            title: 'In hoá đơn',
            description: 'In hoá đơn hiện tại cho khách.',
            position: 'top'
        }
    },
    {
        element: '.qr-btn',
        popover: {
            title: 'Tạo mã QR',
            description: 'Tạo mã QR từ đơn hàng hiện tại.',
            position: 'top'
        }
    },
    {
        element: '.print-sync-data-btn',
        popover: {
            title: 'In & Lưu',
            description: 'In và lưu đơn hàng vào hệ thống.',
            position: 'top'
        }
    },
    {
        element: '.sync-data-btn',
        popover: {
            title: 'Chỉ lưu',
            description: 'Lưu đơn hàng mà không cần in.',
            position: 'top'
        }
    },
    {
        popover: {
            title: '🎉 Hoàn tất',
            description: 'Bạn đã sẵn sàng sử dụng hệ thống POS!',
        }
    }
];

// Hàm khởi tạo driver
function createDriver(steps) {
    return driver({
        showProgress: true,
        animate: true,
        showButtons: ['next', 'previous'],
        nextBtnText: 'Tiếp',
        prevBtnText: 'Trước',
        doneBtnText: 'Xong',
        steps
    });
}

// 3 hàm hướng dẫn:
function startIntroPart1() {
    setTimeout(() => {
        createDriver(stepsPart1).drive();
    }, 1000);

}

function startIntroPart2() {
    setTimeout(() => {
        createDriver(stepsPart2).drive();
    }, 1000);
}

function startIntroAll() {
    setTimeout(() => {
        createDriver([...stepsPart1, ...stepsPart2]).drive();
    }, 1000);
}


function toggleChat() {
    const popup = document.querySelector('.chat-container');
    const display = window.getComputedStyle(popup).display;
    
    popup.style.display = display === 'none' ? 'flex' : 'none';
    
    if (popup.style.display === 'flex') {
        document.getElementById("chatInput").focus();
    }
    

}

function closeChat() {
    document.querySelector('.chat-container').style.display = 'none';
}
function startIntroAndCloseChat() {
    startIntroAll(); // Gọi phần intro
    setTimeout(() => {
        closeChat(); // Đóng chat sau 1 giây
    }, 1500);
}


document.getElementById('chatAiBtn').addEventListener('click', toggleChat);
document.getElementById('chatCloseBtn').addEventListener('click', closeChat);

document.getElementById('chatSendBtn').addEventListener('click', async () => {
    const message = document.getElementById('chatInput').value.trim();
    if (message !== '') {
        appendMessage('Bạn', message);
        document.getElementById('chatInput').value = '';
        appendMessage('Bot', '<span class="typing">● ● ●</span>');

        // Phân biệt giữa online và offline
        const botResponse = isBotOnline
            ? await getAiBotResponse(message)
            : await getOfflineResponse(message);

        updateBotMessage(botResponse);
    }
});

document.getElementById('chatInput').addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const message = document.getElementById('chatInput').value.trim();
        if (message !== '') {
            appendMessage('Bạn', message);
            document.getElementById('chatInput').value = '';
            appendMessage('Bot', '<span class="typing">● ● ●</span>');

            // Phân biệt giữa online và offline
            const botResponse = isBotOnline
                ? await getAiBotResponse(message)
                : await getOfflineResponse(message);

            updateBotMessage(botResponse);
        }
    }
});


function appendMessage(sender, message) {
    const chatBox = document.getElementById('chatBox');
    const msg = document.createElement('div');

    // Xác định người gửi và style hiển thị tin nhắn
    msg.classList.add(sender === 'Bạn' ? 'user' : 'bot');

    // Xử lý markdown đơn giản (chuyển dòng, in đậm, danh sách)
    const formatted = message
        .replace(/\n/g, '<br>')
        .replace(/\* \*\*(.*?)\*\*/g, '<br>• <strong>$1</strong>');

    msg.innerHTML = formatted;

    // Thêm nút copy
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="far fa-clone"></i>';
    copyBtn.className = 'copy-btn';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(stripHTML(formatted));
        copyBtn.innerHTML = '<i class="far fa-clone"></i>';
        setTimeout(() => copyBtn.innerHTML = '📋 Copy', 2000);
    };

    msg.appendChild(copyBtn);

    // Thêm tin nhắn vào hộp chat
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
// Thêm trước mọi đoạn code dùng stripHTML
function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function formatBotMessage(message) {
    return message
        .replace(/\n/g, '<br>')
        .replace(/\* \*\*(.*?)\*\*/g, '<br>• <strong>$1</strong>') // markdown danh sách in đậm
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');         // markdown in đậm
}



function updateBotMessage(message) {
    const chatBox = document.getElementById('chatBox');
    const botMessages = chatBox.querySelectorAll('.bot');

    if (botMessages.length > 0) {
        const lastBotMessage = botMessages[botMessages.length - 1];

        lastBotMessage.innerHTML = '';  // Xoá "typing..."
        const formatted = formatBotMessage(message);

        // Dùng typeMessage nhưng đợi gõ xong rồi mới thêm nút copy
        typeMessage(lastBotMessage, formatted, () => {
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<i class="far fa-clone"></i>';
            copyBtn.className = 'copy-btn';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(stripHTML(formatted));
                copyBtn.innerHTML = '<i class="fas fa-clone"></i>';
                setTimeout(() => copyBtn.innerHTML = '<i class="far fa-clone"></i>', 2000);
            };
            lastBotMessage.appendChild(copyBtn);
        });
    }
}




// Hàm hiển thị tin nhắn dần dần (giống hiệu ứng gõ chữ)
function typeMessage(element, content, callback = null) {
    let index = 0;
    const chatBox = document.getElementById('chatBox');

    const interval = setInterval(() => {
        const char = content.charAt(index);
        // Nếu là thẻ HTML, chèn cả thẻ
        if (char === '<') {
            const closeIdx = content.indexOf('>', index);
            element.innerHTML += content.substring(index, closeIdx + 1);
            index = closeIdx + 1;
        } else {
            element.innerHTML += char;
            index++;
        }

        chatBox.scrollTop = chatBox.scrollHeight;

        if (index >= content.length) {
            clearInterval(interval);
            if (callback) callback();  // Thêm nút copy sau khi gõ xong
        }
    }, 10); // tốc độ gõ
}



let responsesData = [];

fetch('../Asset/Data.json')
    .then(response => response.json())
    .then(data => {
        responsesData = data;
    })
    .catch(error => console.error('Lỗi khi tải dữ liệu:', error));

let isBotOnline = true; // Biến trạng thái toàn cục

function setBotMode(mode) {
    if (mode === "online") {
        isBotOnline = true;
        appendMessage('bot', 'Đã chuyển sang chế độ AI');
    } else if (mode === "offline") {
        isBotOnline = false;
        appendMessage('bot', 'Đã chuyển sang chế độ cục bộ');
    } else {
        // Toggle nếu không có mode rõ ràng
        isBotOnline = !isBotOnline;
        const message = isBotOnline ? 'Đã chuyển sang chế độ AI' : 'Đã chuyển sang chế độ cục bộ ‼️ đang gặp lỗi không thể sử dụng';
        appendMessage('bot', message);
    }
    

    const status = document.getElementById('botStatus');
    status.textContent = isBotOnline ? "BIMO AI" : "BIMO Local";
}


async function getAiBotResponse(message) {
    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAhyil0-osbzYXFYxDNIHH3ObE0I-hzXpk',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: message }]
                    }]
                })
            }
        );

        const data = await response.json();
        console.log("Phản hồi từ Gemini:", data);

        if (data && data.candidates && data.candidates.length > 0) {
            let reply = data.candidates[0].content.parts[0].text.trim();

            // Tùy chỉnh trả lời nếu cần
            if (message.toLowerCase().includes("xin chào")) {
                reply = "Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?";
            } else if (message.toLowerCase().includes("tạm biệt")) {
                reply = "Tạm biệt! Hẹn gặp lại bạn!";
            } else if (message.toLowerCase().includes("giới thiệu")) {
                reply = "Tôi là trợ lý AI sử dụng mô hình Gemini Flash để hỗ trợ bạn bằng tiếng Việt một cách nhanh chóng và thân thiện.";
            }else if (message.toLowerCase().includes("hỗ trợ")) {
                reply = "Bạn cây hỗ trợ gì?.";
            }

            return reply;
        } else if (data.error) {
            return `❗ Lỗi từ Gemini: ${data.error.message}`;
        } else {
            return "❗ Không có phản hồi từ AI.";
        }
    } catch (error) {
        console.error("Lỗi khi gọi Gemini:", error);
        return "❗ Đã có lỗi xảy ra khi kết nối tới Gemini.";
    }
}


function getOfflineResponse(message) {
    message = message.toLowerCase();
    for (const item of responsesData) {
        for (const key of item.keywords) {
            if (message.includes(key)) {
                const reply = item.replies[Math.floor(Math.random() * item.replies.length)];
                return reply;
            }
        }
    }
    return "❗ Xin lỗi, tôi không thể trả lời câu hỏi này.";
}

setTimeout(() => {
    getOfflineResponse('message');
}, 1000);
