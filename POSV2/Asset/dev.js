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
  