


const devices = [
    { TenThietBi: "Còi, Chuông", Mota: "Không có chú thích ở đây" },
    { TenThietBi: "Đèn", Mota: "Không có chú thích ở đây" },
    { TenThietBi: "Nguồn 0v (-)", Mota: "Không có chú thích ở đây" },
    { TenThietBi: "Nguồn 24v (+)", Mota: "Không có chú thích ở đây" },
    { TenThietBi: "Nút nhấn", Mota: "Nút nhấn không lưu" },
    { TenThietBi: "Công tắc", Mota: "Giống như nút nhấn nhưng sẽ lưu trạng thái." },
    { TenThietBi: "Hành động Grafcet", Mota: "Hành động sẽ đi kèm với Bước [Step] " },
    { TenThietBi: "[Gafcet I/O]", Mota: "Input/Output của Grafcet" },
    { TenThietBi: "Bước [Step]", Mota: "Bước trong Grafcet" },
    { TenThietBi: "Bước khởi tạo [initial Step]", Mota: "Là bước đầu tiên của Grafset, có thể đọc thêm trên phần lưu ý." },
    { TenThietBi: "Đồng bộ", Mota: "Có thể hiểu là song song điều kiện nào thoả mãn thì sẽ chạy điều kiện đó." },
    { TenThietBi: "Chuyển tiếp", Mota: "Chuyển tiếp sẽ đi kèm với điều kiện và thường mắc nối tiếp với bước" },
];

  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];
    const div = document.createElement("div");
    div.classList.add("note", "green");
    
    const noteHeader = document.createElement("div");
    noteHeader.classList.add("note-header");
    noteHeader.setAttribute("data-note", `Ghi chú cho thiết bị ${i}`);
    
    const noteTitle = document.createElement("h5");
    noteTitle.classList.add("note-title");
    noteTitle.textContent = device.TenThietBi;
    
    const img = document.createElement("img");
    img.classList.add("icon");
    img.src = `./img/Picture${i+2}.png`;
    img.alt = `Device ${i+2}`;
    
    noteTitle.appendChild(img);
    
    const expandBtn = document.createElement("button");
    expandBtn.classList.add("expand-btn");
    expandBtn.textContent = "Xem thêm";
    
    noteHeader.appendChild(noteTitle);
    noteHeader.appendChild(expandBtn);
    
    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content");
    noteContent.innerHTML =  device.Mota;
    div.appendChild(noteHeader);
    div.appendChild(noteContent);
    
    document.querySelector(".danhsachthanhphan").appendChild(div);

  }
  

const expandBtns = document.querySelectorAll('.expand-btn');
const noteContents = document.querySelectorAll('.note-content');

for (let i = 0; i < expandBtns.length; i++) {
  expandBtns[i].addEventListener('click', function() {
    if (noteContents[i].style.display === 'block') {
      noteContents[i].style.display = 'none';
      expandBtns[i].innerHTML = 'Xem thêm';
    } else {
      noteContents[i].style.display = 'block';
      expandBtns[i].innerHTML = 'Thu gọn';
    }
  });
}

let count = 0;

function lockPage() {

  localStorage.setItem("lockTime", new Date().getTime());
  setTimeout(function() {
    localStorage.removeItem("lockTime");
  }, 30000);
}

function checkPassword() {
  const password = document.getElementById("password").value;
  if (password === "01231") {
    document.getElementById("OpenAll").style.display = "block";
  } else {
    alert('Mật khẩu sai, Nếu không biết xin đừng thử lại.')
    count++;
    if (count >= 2) {
      lockPage();
      document.body.innerText = 'Do bạn đã nhập sai mật khẩu nên trang đang hạn chế bạn, vui lòng thử lại sau 30s.'
    }
  }
}

window.onload = function() {
  const lockTime = localStorage.getItem("lockTime");
  if (lockTime) {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - lockTime) / 1000);
    if (elapsedTime < 30) {
      document.body.innerText = 'Do bạn đã nhập sai mật khẩu nên trang đang hạn chế bạn, vui lòng thử lại sau 30s.'
    } else {
      localStorage.removeItem("lockTime");
    }
  }
}

window.addEventListener('scroll', function() {
  var toc = document.getElementById('table-of-contents');
  var y = window.scrollY;
  if (y >= 1400) {
    toc.classList.add('square');
  } else {
    toc.classList.remove('square');
  }
});
var toc = document.getElementById('table-of-contents');
toc.addEventListener('click', function() {
  toc.classList.toggle('expanded');
});

