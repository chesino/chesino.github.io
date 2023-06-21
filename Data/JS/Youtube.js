// Tạo biến global để lưu trạng thái mở tab mới
var isNewTabOpened = false;

function chuyenDoi() {
  var inputText = document.getElementById("inputLink").value;
  var inputType = document.getElementById("inputType").value;
  var resultDiv = document.getElementById("outLink");
  
  
  // Kiểm tra trường nhập liệu có rỗng hay không
  if (inputText === "") {
    resultDiv.innerHTML = "<b>Vui lòng nhập một đường dẫn YouTube hợp lệ.</b>";
    return;
  }

  if (inputType === 'mp4') {
    var downloadType = 'button';
  }else {
    var downloadType = 'single';
  }

  // Tạo một iframe và thiết lập thuộc tính src bằng đường dẫn URL từ API
  var iframe = document.createElement("iframe");
  iframe.id = "iframeYTB";
  var block = document.createElement("div");
  block.id = "Block";
  block.innerHTML = '<p>Bấm vào ô dưới đây.</p> <p>Sau đó chờ và bấm vào <b>"Download"</b> để tải về.</p>';

  
  iframe.src = "https://convert2mp3s.com/api/" + encodeURIComponent(downloadType) + "/" + encodeURIComponent(inputType) + "?url=" + encodeURIComponent(inputText);

  // Xóa bất kỳ nội dung cũ trong div
  resultDiv.innerHTML = "";

  // Thêm iframe vào div
  resultDiv.appendChild(block);
  resultDiv.appendChild(iframe);

  if (inputType === 'mp4') {
    document.getElementById('iframeYTB').style.height = '530px' ;
  }else {
    document.getElementById('iframeYTB').style.height = '220px' ;
  }

}

// Hàm lấy dữ liệu từ clipboard
function pasteClipboardData() {
  navigator.clipboard.readText()
    .then(function (clipboardData) {
      // Gán giá trị từ clipboard vào trường input
      document.getElementById('inputLink').value = clipboardData;
    })
    .catch(function (error) {
      console.error('Lỗi khi đọc dữ liệu từ clipboard: ', error);
    });
}