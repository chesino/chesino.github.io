// Hàm định dạng số: làm tròn và thêm dấu chấm mỗi 3 số (theo chuẩn Việt Nam)
function formatNumber(num) {
  return Math.round(num).toLocaleString('vi-VN');
}

/* Các hàm Modal Thông báo & Xác nhận */
function showMessage(message, callback) {
  const messageModal = document.getElementById('messageModal');
  const messageText = document.getElementById('messageText');
  messageText.textContent = message;
  messageModal.style.display = 'block';
  document.getElementById('messageModalOk').onclick = function() {
    messageModal.style.display = 'none';
    if (callback) callback();
  }
  document.getElementById('closeMessageModal').onclick = function() {
    messageModal.style.display = 'none';
    if (callback) callback();
  }
}

function showConfirm(message, callbackYes, callbackNo) {
  const confirmModal = document.getElementById('confirmModal');
  const confirmText = document.getElementById('confirmText');
  confirmText.textContent = message;
  confirmModal.style.display = 'block';
  document.getElementById('confirmYes').onclick = function() {
    confirmModal.style.display = 'none';
    if (callbackYes) callbackYes();
  }
  document.getElementById('confirmNo').onclick = function() {
    confirmModal.style.display = 'none';
    if (callbackNo) callbackNo();
  }
  document.getElementById('closeConfirmModal').onclick = function() {
    confirmModal.style.display = 'none';
    if (callbackNo) callbackNo();
  }
}

// Khởi tạo dữ liệu sản phẩm từ localStorage hoặc mảng rỗng
let products = JSON.parse(localStorage.getItem('products')) || [];

// Cập nhật datalist cho input tên sản phẩm
function updateProductDatalist() {
  const datalist = document.getElementById('productList');
  datalist.innerHTML = '';
  products.forEach(prod => {
    const option = document.createElement('option');
    option.value = prod.name;
    datalist.appendChild(option);
  });
}
updateProductDatalist();

// Xử lý tăng giảm số lượng
document.getElementById('increaseQty').addEventListener('click', () => {
  const qtyInput = document.getElementById('quantity');
  qtyInput.value = parseInt(qtyInput.value) + 1;
});
document.getElementById('decreaseQty').addEventListener('click', () => {
  const qtyInput = document.getElementById('quantity');
  if (parseInt(qtyInput.value) > 1) {
    qtyInput.value = parseInt(qtyInput.value) - 1;
  }
});

// Xử lý chuyển đổi giữa giảm giá phần trăm và giá cố định
document.querySelectorAll('input[name="discountType"]').forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.value === 'percent') {
      document.getElementById('discountPercentSection').style.display = 'block';
      document.getElementById('discountFixedSection').style.display = 'none';
    } else {
      document.getElementById('discountPercentSection').style.display = 'none';
      document.getElementById('discountFixedSection').style.display = 'block';
    }
  });
});

// Xử lý nút giảm giá cố định (10%,20%,30%,50)
document.querySelectorAll('.discount-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.getElementById('discountPercent').value = this.getAttribute('data-value');
    document.getElementById('discountCustomInput').style.display = 'none';
    document.querySelectorAll('.discount-btn').forEach(b => {
      b.style.backgroundColor = '';
      b.style.color = '';
    });
    this.style.backgroundColor = 'var(--primary-color)';
    this.style.color = 'white';
  });
});

// Xử lý nút "Tùy chỉnh" cho giảm giá phần trăm
document.querySelector('.discount-btn-custom').addEventListener('click', function() {
  const customInput = document.getElementById('discountCustomInput');
  customInput.style.display = 'block';
  customInput.focus();
  document.querySelectorAll('.discount-btn').forEach(b => {
    b.style.backgroundColor = '';
    b.style.color = '';
  });
});
document.getElementById('discountCustomInput').addEventListener('change', function() {
  document.getElementById('discountPercent').value = this.value;
});

let purchaseList = [];

// Hàm tính thành tiền cho 1 mục theo chế độ giá
function calculateItemTotal(basePrice, qty, tax, discount, discountType, priceMode) {
  basePrice = parseFloat(basePrice);
  qty = parseInt(qty);
  tax = parseFloat(tax);
  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = basePrice * (discount / 100);
  } else {
    discountAmount = parseFloat(discount);
  }
  if (priceMode === 'exclude') {
    let priceAfterDiscount = basePrice - discountAmount;
    let taxAmount = priceAfterDiscount * (tax / 100);
    return Math.round((priceAfterDiscount + taxAmount) * qty);
  } else {
    // Giá đã bao gồm thuế
    return Math.round((basePrice - discountAmount) * qty);
  }
}

// Cập nhật bảng danh sách mua
function updatePurchaseTable() {
  const tbody = document.querySelector('#purchaseTable tbody');
  tbody.innerHTML = '';
  let totalAmount = 0;
  purchaseList.forEach((item, index) => {
    totalAmount += parseFloat(item.total);
    const formattedPrice = formatNumber(item.basePrice);
    const formattedTotal = formatNumber(item.total);
    let formattedDiscount = item.discount;
    if (item.discountType === 'percent') {
      formattedDiscount = item.discount + '%';
    } else {
      formattedDiscount = formatNumber(item.discount);
    }
    // Nếu sản phẩm mua theo mode include thì hiển thị "VAT" còn nếu exclude thì hiển thị số phần trăm thuế
    let taxDisplay = item.priceMode === 'exclude' ? parseFloat(item.tax).toFixed(0) : 'VAT';
    const tr = document.createElement('tr');
    tr.innerHTML = `
          <td>${item.name}</td>
          <td>${formattedPrice}</td>
          <td>${taxDisplay}</td>
          <td>${formattedDiscount}</td>
          <td>${item.quantity}</td>
          <td>${formattedTotal}</td>
          <td>
            <button class="btn-small" onclick="editItem(${index})">Sửa</button>
            <button class="btn-small" onclick="deleteItem(${index})">Xóa</button>
          </td>
        `;
    tbody.appendChild(tr);
  });
  document.getElementById('totalAmount').textContent = formatNumber(totalAmount);
  document.getElementById('totalAmountHead').textContent = formatNumber(totalAmount);
}

// Xử lý thêm sản phẩm vào danh sách mua
document.getElementById('addToListBtn').addEventListener('click', () => {
  const name = document.getElementById('productName').value.trim();
  const quantity = document.getElementById('quantity').value;
  const basePrice = document.getElementById('basePrice').value;
  const tax = document.getElementById('tax').value;
  const discountType = document.querySelector('input[name="discountType"]:checked').value;
  let discount = 0;
  if (discountType === 'percent') {
    discount = document.getElementById('discountPercent').value || 0;
  } else {
    discount = document.getElementById('discountFixed').value || 0;
  }
  // Lấy giá trị mode khi mua sản phẩm
  const priceMode = document.querySelector('input[name="priceMode"]:checked').value;
  
  if (name === '' || basePrice === '') {
    showMessage('Vui lòng nhập tên sản phẩm và giá!');
    return;
  }
  
  const total = calculateItemTotal(basePrice, quantity, tax, discount, discountType, priceMode);
  const item = { name, basePrice, tax, discount, discountType, quantity, total, priceMode };
  purchaseList.push(item);
  updatePurchaseTable();
  
  // Nếu sản phẩm mới, thêm vào danh sách sản phẩm và lưu vào localStorage
  if (!products.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    products.push({ name: name, basePrice: basePrice });
    localStorage.setItem('products', JSON.stringify(products));
    updateProductDatalist();
  }
  
  // Reset form
  document.getElementById('productName').value = '';
  document.getElementById('basePrice').value = '';
  document.getElementById('discountFixed').value = '';
  document.getElementById('discountPercent').value = 0;
  document.getElementById('discountCustomInput').value = '';
  document.getElementById('discountCustomInput').style.display = 'none';
  document.querySelectorAll('.discount-btn').forEach(b => {
    b.style.backgroundColor = '';
    b.style.color = '';
  });
});

// Hàm sửa mục trong danh sách mua
function editItem(index) {
  const item = purchaseList[index];
  document.getElementById('productName').value = item.name;
  document.getElementById('basePrice').value = item.basePrice;
  document.getElementById('tax').value = item.tax;
  document.getElementById('quantity').value = item.quantity;
  // Cài đặt lại chế độ giá (priceMode)
  document.querySelectorAll('input[name="priceMode"]').forEach(radio => {
    if (radio.value === item.priceMode) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  });
  document.querySelectorAll('input[name="discountType"]').forEach(radio => {
    if (radio.value === item.discountType) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  });
  if (item.discountType === 'percent') {
    document.getElementById('discountPercent').value = item.discount;
    document.querySelectorAll('.discount-btn').forEach(btn => {
      if (btn.getAttribute('data-value') === item.discount) {
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
      } else {
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }
    });
  } else {
    document.getElementById('discountFixed').value = item.discount;
  }
  purchaseList.splice(index, 1);
  updatePurchaseTable();
}

// Hàm xóa mục khỏi danh sách mua sử dụng modal xác nhận
function deleteItem(index) {
  showConfirm('Bạn có chắc muốn xóa sản phẩm này?', function() {
    purchaseList.splice(index, 1);
    updatePurchaseTable();
  });
}

// Xử lý chuyển đổi giữa chế độ giá (chưa bao gồm thuế / đã bao gồm thuế)
document.querySelectorAll('input[name="priceMode"]').forEach(radio => {
  radio.addEventListener('change', function() {
    let priceMode = this.value;
    if (priceMode === 'exclude') {
      document.getElementById('taxGroup').style.display = 'block';
      document.querySelector('label[for="basePrice"]').textContent = 'Giá gốc (chưa bao gồm thuế)';
    } else {
      document.getElementById('taxGroup').style.display = 'none';
      document.querySelector('label[for="basePrice"]').textContent = 'Giá đã bao gồm thuế';
    }
  });
});

// Modal lưu hóa đơn
const invoiceModal = document.getElementById('invoiceModal');
const invoiceTimeInput = document.getElementById('invoiceTime');
const invoiceNoteInput = document.getElementById('invoiceNote');
const saveInvoiceBtn = document.getElementById('saveInvoiceBtn');
const closeModalBtn = document.getElementById('closeModal');
const confirmSaveInvoiceBtn = document.getElementById('confirmSaveInvoice');

saveInvoiceBtn.addEventListener('click', () => {
  const now = new Date();
  invoiceTimeInput.value = now.toLocaleString('vi-VN');
  invoiceNoteInput.value = '';
  invoiceModal.style.display = 'block';
});
closeModalBtn.addEventListener('click', () => {
  invoiceModal.style.display = 'none';
});
confirmSaveInvoiceBtn.addEventListener('click', () => {
  if (purchaseList.length === 0) {
    showMessage('Danh sách mua trống!');
    return;
  }
  const history = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
  const invoice = {
    time: invoiceTimeInput.value,
    note: invoiceNoteInput.value,
    items: purchaseList,
    total: document.getElementById('totalAmount').textContent
  };
  history.push(invoice);
  localStorage.setItem('invoiceHistory', JSON.stringify(history));
  showMessage('Hóa đơn đã được lưu vào lịch sử!', function() {
    purchaseList = [];
    updatePurchaseTable();
    loadInvoiceHistory();
    invoiceModal.style.display = 'none';
  });
});

// Tải lịch sử hóa đơn từ localStorage và hiển thị kèm các nút chỉnh sửa, tải về, chia sẻ
function loadInvoiceHistory() {
  const history = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  history.forEach((inv, index) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <strong>Thời gian:</strong> ${inv.time} <br>
      <strong>Ghi chú:</strong> ${inv.note || '—'} <br>
      <strong>Tổng tiền:</strong> ${inv.total} <br>
      <strong>Sản phẩm:</strong> 
      <ul>
        ${inv.items.map(item => {
          // Nếu giảm giá > 0 thì hiển thị thông tin giảm giá, ngược lại thì bỏ qua
          const discountText = item.discount > 0 
            ? ` [-${item.discountType === 'percent' ? item.discount + '%' : formatNumber(item.discount)}]`
            : '';
          return `<li>${item.name} (x${item.quantity})${discountText}: ${formatNumber(item.total)}</li>`;
        }).join('')}
      </ul>
      <button class="btn-small" onclick="editInvoice(${index})">Chỉnh sửa</button>
      <button class="btn-small" onclick="downloadInvoice(${index})">Tải về</button>
      <button class="btn-small" onclick="shareInvoice(${index})">Chia sẻ</button>
      <button class="btn-small" onclick="deleteInvoice(${index})">Xoá hoá đơn</button>
    `;
    historyList.appendChild(div);
  });
}
loadInvoiceHistory();

// Hàm chỉnh sửa hóa đơn sử dụng modal xác nhận
function editInvoice(index) {
  const history = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
  const inv = history[index];
  showConfirm('Bạn có chắc muốn chỉnh sửa hóa đơn này?', function() {
    purchaseList = inv.items;
    updatePurchaseTable();
    history.splice(index, 1);
    localStorage.setItem('invoiceHistory', JSON.stringify(history));
    loadInvoiceHistory();
  });
}

// Hàm tải về hóa đơn (xuất file JSON)
function downloadInvoice(index) {
  const history = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
  const inv = history[index];
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inv, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "invoice_" + Date.now() + ".json");
  dlAnchorElem.style.display = "none";
  document.body.appendChild(dlAnchorElem);
  dlAnchorElem.click();
  document.body.removeChild(dlAnchorElem);
}

// Hàm chia sẻ hóa đơn (sử dụng Web Share API)
function shareInvoice(index) {
  const history = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
  const inv = history[index];
  const shareData = {
    title: 'Hóa đơn mua hàng',
    text: `Thời gian: ${inv.time}\nGhi chú: ${inv.note}\nTổng tiền: ${inv.total}\nSản phẩm:\n${inv.items.map(item => item.name + ' (x' + item.quantity + '): ' + formatNumber(item.total)).join('\n')}`
  };
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Hóa đơn đã được chia sẻ thành công'))
      .catch((err) => console.error('Lỗi chia sẻ', err));
  } else {
    showMessage('Trình duyệt của bạn không hỗ trợ chức năng chia sẻ!');
  }
}

// Tải file product.json khi nhấn nút
document.getElementById('loadProductsBtn').addEventListener('click', () => {
  fetch('product.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      localStorage.setItem('products', JSON.stringify(products));
      updateProductDatalist();
      showMessage('Đã tải danh sách sản phẩm mới!');
    })
    .catch(err => {
      console.error(err);
      showMessage('Không tải được file product.json!');
    });
});


// Add this to main.js after the existing code

// 1. Preview price calculation
function updatePricePreview() {
  const basePrice = document.getElementById('basePrice').value || 0;
  const qty = document.getElementById('quantity').value || 1;
  const tax = document.getElementById('tax').value || 0;
  const discountType = document.querySelector('input[name="discountType"]:checked').value;
  let discount = 0;
  
  if (discountType === 'percent') {
    discount = document.getElementById('discountPercent').value || 0;
  } else {
    discount = document.getElementById('discountFixed').value || 0;
  }
  
  const priceMode = document.querySelector('input[name="priceMode"]:checked').value;
  
  if (basePrice > 0) {
    const total = calculateItemTotal(basePrice, qty, tax, discount, discountType, priceMode);
    document.getElementById('pricePreview').textContent = formatNumber(total);
    document.getElementById('pricePreviewContainer').style.display = 'block';
  } else {
    document.getElementById('pricePreviewContainer').style.display = 'none';
  }
}

// Add event listeners to update price preview when inputs change
const priceInputs = ['basePrice', 'quantity', 'tax', 'discountPercent', 'discountFixed', 'discountCustomInput'];
priceInputs.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener('input', updatePricePreview);
  }
});

// Add listeners for radio buttons
document.querySelectorAll('input[name="discountType"], input[name="priceMode"]').forEach(radio => {
  radio.addEventListener('change', updatePricePreview);
});

// Also update for discount buttons
document.querySelectorAll('.discount-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    setTimeout(updatePricePreview, 10); // Small delay to ensure discount value is updated
  });
});

// 2. Toggle for detailed/compact view
let isDetailedView = true;

function toggleCartView() {
  isDetailedView = !isDetailedView;
  
  // Update toggle button text
  const toggleBtn = document.getElementById('toggleViewBtn');
  toggleBtn.textContent = isDetailedView ? 'Hiển thị ngắn gọn' : 'Hiển thị chi tiết';
  
  // Update table headers
  const tableHeaders = document.querySelector('#purchaseTable thead tr');
  if (isDetailedView) {
    tableHeaders.innerHTML = `
      <th>Tên</th>
      <th>Giá</th>
      <th>Thuế</th>
      <th>Giảm giá</th>
      <th>Số lượng</th>
      <th>Thành tiền</th>
      <th>Hành động</th>
    `;
  } else {
    tableHeaders.innerHTML = `
      <th>Tên</th>
      <th>Thành tiền</th>
      <th>Hành động</th>
    `;
  }
  
  // Refresh the purchase table with current view mode
  updatePurchaseTable();
}

// Update the updatePurchaseTable function to support both view modes
// Replace the existing updatePurchaseTable function with this one
function updatePurchaseTable() {
  const tbody = document.querySelector('#purchaseTable tbody');
  tbody.innerHTML = '';
  let totalAmount = 0;
  
  purchaseList.forEach((item, index) => {
    totalAmount += parseFloat(item.total);
    const formattedPrice = formatNumber(item.basePrice);
    const formattedTotal = formatNumber(item.total);
    let formattedDiscount = item.discount;
    
    if (item.discountType === 'percent') {
      formattedDiscount = item.discount + '%';
    } else {
      formattedDiscount = formatNumber(item.discount);
    }
    
    // If product is purchased in include mode, display "VAT", else display tax percentage
    let taxDisplay = item.priceMode === 'exclude' ? parseFloat(item.tax).toFixed(0) : 'VAT';
    
    const tr = document.createElement('tr');
    
    if (isDetailedView) {
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${formattedPrice}</td>
        <td>${taxDisplay}</td>
        <td>${formattedDiscount}</td>
        <td>${item.quantity}</td>
        <td>${formattedTotal}</td>
        <td>
          <button class="btn-small" onclick="editItem(${index})">Sửa</button>
          <button class="btn-small" onclick="deleteItem(${index})">Xóa</button>
        </td>
      `;
    } else {
      tr.innerHTML = `
        <td>${item.name} (x${item.quantity}) [${formattedDiscount}]</td>
        <td>${formattedTotal}</td>
        <td>
          <button class="btn-small" onclick="editItem(${index})">Sửa</button>
          <button class="btn-small" onclick="deleteItem(${index})">Xóa</button>
        </td>
      `;
    }
    
    tbody.appendChild(tr);
  });
  
  document.getElementById('totalAmount').textContent = formatNumber(totalAmount);
  document.getElementById('totalAmountHead').textContent = formatNumber(totalAmount);
}

// Call these functions once to initialize
updatePricePreview();

document.addEventListener('DOMContentLoaded', () => {
  // ======= 1. Áp dụng màu chủ đạo đã lưu =======
  const savedColor = localStorage.getItem('primaryColor') || '#007bff';
  document.documentElement.style.setProperty('--primary-color', savedColor);
  document.getElementById('colorPicker').value = savedColor;
  
  document.getElementById('colorPicker').addEventListener('input', (e) => {
    const newColor = e.target.value;
    document.documentElement.style.setProperty('--primary-color', newColor);
    localStorage.setItem('primaryColor', newColor);
  });
  
  // ======= 2. Áp dụng kích thước chữ =======
  const savedFontSize = localStorage.getItem('fontSize') || '16px';
  document.documentElement.style.setProperty('--font-size', savedFontSize);
  document.getElementById('fontSizeRange').value = parseInt(savedFontSize);
  document.getElementById('fontSizeValue').textContent = savedFontSize;
  
  document.getElementById('fontSizeRange').addEventListener('input', (e) => {
    const newSize = e.target.value + 'px';
    document.documentElement.style.setProperty('--font-size', newSize);
    localStorage.setItem('fontSize', newSize);
    document.getElementById('fontSizeValue').textContent = newSize;
  });
  
  // ======= 3. Tự động điền giá khi chọn sản phẩm =======
  const productNameInput = document.getElementById('productName');
  const basePriceInput = document.getElementById('basePrice');
  
  productNameInput.addEventListener('input', () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.name.toLowerCase() === productNameInput.value.toLowerCase());
    
    if (product) {
      basePriceInput.value = product.basePrice;
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const productTableBody = document.querySelector('#productTable tbody');
  const newProductName = document.getElementById('newProductName');
  const newProductPrice = document.getElementById('newProductPrice');
  const addProductBtn = document.getElementById('addProductBtn');
  
  function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    productTableBody.innerHTML = '';
    
    products.forEach((product, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td><input type="text" value="${product.name}" data-index="${index}" class="editName"></td>
                <td><input type="number" value="${product.basePrice}" data-index="${index}" class="editPrice"></td>
                <td>
                    <button class="btn-small deleteProduct" data-index="${index}">Xóa</button>
                </td>
            `;
      productTableBody.appendChild(row);
    });
    
    // Xử lý sửa tên sản phẩm
    document.querySelectorAll('.editName').forEach(input => {
      input.addEventListener('change', function() {
        const index = this.getAttribute('data-index');
        const newName = this.value.trim();
        
        if (!newName) {
          alert('Tên sản phẩm không được để trống!');
          this.value = products[index].name;
          return;
        }
        
        // Cập nhật tên sản phẩm trong danh sách sản phẩm
        products[index].name = newName;
        localStorage.setItem('products', JSON.stringify(products));
        
        // Cập nhật tên sản phẩm trong lịch sử hóa đơn
        let invoices = JSON.parse(localStorage.getItem('invoiceHistory')) || [];
        invoices.forEach(invoice => {
          invoice.items.forEach(item => {
            if (item.name === products[index].name) {
              item.name = newName;
            }
          });
        });
        localStorage.setItem('invoiceHistory', JSON.stringify(invoices));
      });
    });
    
    // Xử lý sửa giá sản phẩm
    document.querySelectorAll('.editPrice').forEach(input => {
      input.addEventListener('change', function() {
        const index = this.getAttribute('data-index');
        products[index].basePrice = this.value;
        localStorage.setItem('products', JSON.stringify(products));
      });
    });
    
    // Xử lý xóa sản phẩm
    document.querySelectorAll('.deleteProduct').forEach(button => {
      button.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
      });
    });
  }
  
  // Thêm sản phẩm mới
  addProductBtn.addEventListener('click', () => {
    const name = newProductName.value.trim();
    const price = newProductPrice.value.trim();
    
    if (name === '' || price === '') {
      alert('Vui lòng nhập tên và giá sản phẩm!');
      return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, basePrice: price });
    localStorage.setItem('products', JSON.stringify(products));
    
    newProductName.value = '';
    newProductPrice.value = '';
    loadProducts();
  });
  
  // Xử lý chuyển tab
  const sections = {
    'product-list': document.getElementById('productListContainer'),
'settings': document.getElementById('settings'),
  };
  
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.getAttribute('data-section');
      
      for (const key in sections) {
        sections[key].classList.add('hidden');
      }
      
      if (sections[section]) {
        sections[section].classList.remove('hidden');
        if (section === 'product-list') loadProducts();
      }
    });
  });
  
  loadProducts();
});