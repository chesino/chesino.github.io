// Import Firebase (Sử dụng CDN Modular v9/v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- CONFIG FIREBASE (Bạn thay bằng config của bạn) ---
const firebaseConfig = {
            apiKey: "AIzaSyAFVEewFQpvq7awQi4xobqNvOq2Fmsso1E",
            authDomain: "pos-hunq.firebaseapp.com",
            projectId: "pos-hunq",
            storageBucket: "pos-hunq.firebasestorage.app",
            messagingSenderId: "723349111259",
            appId: "1:723349111259:web:84d6d982b838c68da7e7fe",
            measurementId: "G-6Z229N0WFX"
        };

const appInstance = initializeApp(firebaseConfig);
const db = getFirestore(appInstance);
const authInstance = getAuth(appInstance);

// --- GLOBAL STATE ---
let currentUser = null;
let cart = [];
let products = []; // Cache sản phẩm
let currentCustomer = null; // Khách hàng đang chọn

// --- AUTHENTICATION MODULE ---
const auth = {
    init: () => {
        onAuthStateChanged(authInstance, async (user) => {
            if (user) {
                // Lấy role từ Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                const userData = userDoc.exists() ? userDoc.data() : { role: 'staff' };
                currentUser = { ...user, ...userData };
                
                // UI Update
                document.getElementById('auth-screen').classList.add('hidden');
                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('user-role-display').innerText = currentUser.role.toUpperCase();
                
                // Phân quyền nút Admin
                if(currentUser.role === 'admin') {
                    document.getElementById('btn-manage').classList.remove('hidden');
                }
                
                app.fetchProducts();
            } else {
                document.getElementById('auth-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('hidden');
            }
        });

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const pass = document.getElementById('password').value;
            try {
                await signInWithEmailAndPassword(authInstance, email, pass);
            } catch (error) {
                document.getElementById('login-error').innerText = "Sai thông tin đăng nhập!";
            }
        });
    },
    logout: () => signOut(authInstance)
};

// --- POS LOGIC MODULE ---
const app = {
    // 1. Lấy dữ liệu sản phẩm (Giả lập dữ liệu nếu DB rỗng để test)
    fetchProducts: async () => {
        // Trong thực tế: const q = query(collection(db, "products"));
        // Ở đây tôi tạo dữ liệu mẫu (hardcode) để bạn chạy thử ngay
        products = [
            { id: '1', name: 'Cà phê đen', price: 25000, category: 'drink' },
            { id: '2', name: 'Cà phê sữa', price: 30000, category: 'drink' },
            { id: '3', name: 'Bánh mì', price: 15000, category: 'food' },
            { id: '4', name: 'Trà đào', price: 35000, category: 'drink' },
            { id: '5', name: 'Croissant', price: 45000, category: 'food' }
        ];
        // Nếu muốn lấy từ firebase: 
        // const querySnapshot = await getDocs(collection(db, "products"));
        // products = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        
        app.renderProducts(products);
    },

    renderProducts: (list = products) => {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = list.map(p => `
            <div class="product-card" onclick="app.addToCart('${p.id}')">
                <h4>${p.name}</h4>
                <div class="product-price">${p.price.toLocaleString()}đ</div>
            </div>
        `).join('');
    },

    filterProducts: () => {
        const keyword = document.getElementById('search-box').value.toLowerCase();
        const cat = document.getElementById('category-filter').value;
        
        const filtered = products.filter(p => {
            const matchName = p.name.toLowerCase().includes(keyword);
            const matchCat = cat === 'all' || p.category === cat;
            return matchName && matchCat;
        });
        app.renderProducts(filtered);
    },

    // 2. Giỏ hàng (Logic phức tạp nhất)
    addToCart: (id) => {
        const product = products.find(p => p.id === id);
        const existing = cart.find(item => item.id === id);
        
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        app.renderCart();
    },

    updateQty: (id, change) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        }
        app.renderCart();
    },

    renderCart: () => {
        const container = document.getElementById('cart-items');
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <b>${item.name}</b><br>
                    <small>${(item.price * item.qty).toLocaleString()}đ</small>
                </div>
                <div class="qty-controls">
                    <button onclick="app.updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="app.updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
        app.updateTotal();
    },

    // 3. Tính toán tiền & Giảm giá
    updateTotal: () => {
        const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        // Xử lý logic giảm giá
        const discountType = document.getElementById('discount-type').value;
        let discount = 0;
        
        if (discountType === 'percent_10') discount = subTotal * 0.1;
        else if (discountType === 'percent_20') discount = subTotal * 0.2;
        else if (discountType === 'fixed_50') discount = 50000;

        if (discount > subTotal) discount = subTotal; // Không giảm quá số tiền

        const final = subTotal - discount;

        document.getElementById('sub-total').innerText = subTotal.toLocaleString() + 'đ';
        document.getElementById('discount-amount').innerText = discount.toLocaleString() + 'đ';
        document.getElementById('final-total').innerText = final.toLocaleString() + 'đ';
        
        return { subTotal, discount, final };
    },

    // 4. CRM: Tìm khách hàng bằng SĐT
    findCustomer: async () => {
        const phone = document.getElementById('cust-phone').value;
        if (!phone) return;

        const q = query(collection(db, "customers"), where("phone", "==", phone));
        const snap = await getDocs(q);

        if (!snap.empty) {
            const docData = snap.docs[0];
            currentCustomer = { id: docData.id, ...docData.data() };
            document.getElementById('cust-name-display').innerHTML = 
                `${currentCustomer.name} <br><small>Điểm: ${currentCustomer.points || 0}</small>`;
        } else {
            // Logic tạo nhanh khách nếu chưa có (Tuỳ chọn)
            if(confirm("Khách mới! Tạo nhanh không?")) {
                const name = prompt("Tên khách hàng:");
                if(name) {
                    const newRef = await addDoc(collection(db, "customers"), {
                        name: name, phone: phone, points: 0, createdAt: new Date()
                    });
                    currentCustomer = { id: newRef.id, name, phone, points: 0 };
                    document.getElementById('cust-name-display').innerText = name;
                }
            } else {
                currentCustomer = null;
                document.getElementById('cust-name-display').innerText = "Khách lẻ";
            }
        }
    },

    // 5. Thanh toán & Lưu trữ
    checkout: async () => {
        if (cart.length === 0) return alert("Giỏ hàng trống!");
        
        const totals = app.updateTotal();
        
        const orderData = {
            items: cart,
            subTotal: totals.subTotal,
            discount: totals.discount,
            finalTotal: totals.finalTotal,
            cashierId: currentUser.uid,
            cashierName: currentUser.email, // Hoặc tên
            createdAt: new Date(),
            customerId: currentCustomer ? currentCustomer.id : 'guest'
        };

        try {
            // 1. Lưu Order
            await addDoc(collection(db, "orders"), orderData);

            // 2. Tích điểm (Ví dụ: 10.000đ = 1 điểm)
            if (currentCustomer) {
                const pointsEarned = Math.floor(totals.finalTotal / 10000);
                const customerRef = doc(db, "customers", currentCustomer.id);
                await updateDoc(customerRef, {
                    points: increment(pointsEarned)
                });
                alert(`Thanh toán thành công! Khách tích được ${pointsEarned} điểm.`);
            } else {
                alert("Thanh toán thành công (Khách lẻ).");
            }

            // Reset
            cart = [];
            currentCustomer = null;
            document.getElementById('cust-phone').value = '';
            document.getElementById('cust-name-display').innerText = "Khách lẻ";
            app.renderCart();

        } catch (e) {
            console.error(e);
            alert("Lỗi thanh toán: " + e.message);
        }
    },
    
    showManagement: () => {
        if(currentUser.role !== 'admin') return alert("Chỉ Admin mới được truy cập!");
        alert("Chuyển đến trang quản lý (Thêm/Sửa/Xóa sản phẩm, Xem báo cáo doanh thu...)");
        // Logic chuyển tab hoặc render UI quản lý ở đây
    }
};

// Expose functions to Window for HTML onclick
window.app = app;
window.auth = auth;

// Start
auth.init();