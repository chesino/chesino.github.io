const products = [
  {
    "name": "Minecraft iOS",
    "description": "Mướn tài khoản tải, hỗ trợ cập nhật 5k/lần. Hạn sử dụng 1 lần tải.",
    "price": "15.000đ",
    "priceroot": "~170.000đ",
    "image": "./Asset/Shop/minecraftPE.png"
  },
  {
    "name": "Netflix 4K 1T",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Tháng.",
    "price": "75.000đ",
    "priceroot": "~260.000đ",
    "image": "./Asset/Shop/Netflix.jpg"
  },
  {
    "name": "Netflix 4K 6T",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 6 Tháng.",
    "price": "400.000đ",
    "priceroot": "~1.560.000đ",
    "image": "./Asset/Shop/Netflix.jpg"
  },
  {
    "name": "Spotify Premium 1M",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Tháng.",
    "price": "25.000đ",
    "priceroot": "~59.000đ",
    "image": "./Asset/Shop/Spotify.png"
  },
  {
    "name": "Spotify Premium",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 6 Tháng.",
    "price": "135.000đ",
    "priceroot": "~354.000đ",
    "image": "./Asset/Shop/Spotify.png"
  },
  {
    "name": "Spotify Premium",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Năm.",
    "price": "250.000đ",
    "priceroot": "~708.000đ",
    "image": "./Asset/Shop/Spotify.png"
  },
  {
    "name": "Canva Pro",
    "description": "Tài khoản dùng riêng. Hạn sử dụng Vĩnh viễn.",
    "price": "200.000đ",
    "priceroot": "~9.999.999đ",
    "image": "./Asset/Shop/Canva.png"
  },
  {
    "name": "Capcut Pro",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Tháng.",
    "price": "100.000đ",
    "priceroot": "~199.000đ",
    "image": "./Asset/Shop/capcut.jpg"
  },
  {
    "name": "Chat GPT Plus",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Tháng.",
    "price": "350.000đ",
    "priceroot": "~498.500đ",
    "image": "./Asset/Shop/ChatGPTPlus.jpg"
  },
  {
    "name": "Chat GPT Plus",
    "description": "Tài khoản dùng chung. Hạn sử dụng 1 Tháng.",
    "price": "150.000đ",
    "priceroot": "~498.500đ",
    "image": "./Asset/Shop/ChatGPTPlus.jpg"
  },
  {
    "name": "Youtube Premium",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Tháng.",
    "price": "40.000đ",
    "priceroot": "~79.000đ",
    "image": "./Asset/Shop/Youtube.jpg"
  },
  {
    "name": "Youtube Premium",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 6 Tháng.",
    "price": "200.000đ",
    "priceroot": "~474.000đ",
    "image": "./Asset/Shop/Youtube.jpg"
  },
  {
    "name": "Youtube Premium",
    "description": "Tài khoản dùng riêng. Hạn sử dụng 1 Năm.",
    "price": "380.000đ",
    "priceroot": "~948.000đ",
    "image": "./Asset/Shop/Youtube.jpg"
  }
];

const cart = [];

// Hiển thị danh sách sản phẩm
const renderProducts = () => {
  const productContainer = document.getElementById('products');
  productContainer.innerHTML = '';

  products.forEach((product, index) => {
    const productCard = `
      <div class="Card">
        <div class="image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product">
          <h1 class="name">${product.name}</h1>
          <p class="description">${product.description}</p>
        </div>
        <div class="buy">
          <p class="price">
            <span class="priceroot">${product.priceroot}</span>
            ${product.price}
          </p>
          <button onclick="addToCart(${index})">
            <i class="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
      </div>
    `;
    productContainer.innerHTML += productCard;
  });
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = (index) => {
  const product = products[index];
  const cartItem = cart.find(item => item.name === product.name);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
};

// Hiển thị giỏ hàng
const renderCart = () => {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const cartItem = `
      <div class="CartItem">
        <div class="image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="name">
          <h2>${item.name}</h2>
          <div class="price">
            ${formatWithDots(parseInt(item.price.replace('.', '').replace('đ', '')) * item.quantity)}đ
          </div>
        </div>
        <div class="quantity">
          <button class="del" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <div class="quantityitem">${item.quantity}</div>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
    cartContainer.innerHTML += cartItem;
  });

  // Hiển thị nút thanh toán nếu giỏ hàng có sản phẩm
  const checkoutButton = document.getElementById('checkoutButton');
  checkoutButton.style.display = cart.length > 0 ? 'block' : 'none';

  // Cập nhật tổng tiền
  updateTotalPrice();
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateQuantity = (index, change) => {
  cart[index].quantity += change;
  if (cart[index].quantity === 0) {
    removeFromCart(index);
  } else {
    renderCart();
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = (index) => {
  cart.splice(index, 1);
  renderCart();
};

// Cập nhật tổng tiền
const updateTotalPrice = () => {
  const totalPrice = cart.reduce((total, item) => {
    return total + parseInt(item.price.replace('.', '').replace('đ', '')) * item.quantity;
  }, 0);
  document.getElementById('totalPrice').innerText = formatWithDots(totalPrice) + 'đ';
};

// Hiển thị div thanh toán
const showCheckout = () => {
  document.getElementById('checkout').style.display = 'block';
};

// Xác nhận thanh toán
const confirmCheckout = () => {
  Fail('Lỗi','Tính năng này đang phát triển')
  cart.length = 0; // Xóa giỏ hàng sau khi thanh toán
  renderCart();
  document.getElementById('checkout').style.display = 'none';
};

// Định dạng số tiền với dấu chấm
function formatWithDots(value) {
  if (isNaN(value)) {
    return ''; // Nếu không phải là số thì trả về chuỗi rỗng
  }

  let intValue = parseInt(value, 10);
  let parts = intValue.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join('.');
}

document.addEventListener('DOMContentLoaded', renderProducts);
