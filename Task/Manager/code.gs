const DATA_ENTRY_SHEET_NAME = "DataBase"; // Mặc định là sheet "DataBase"
const CUSTOMER_SHEET_NAME = "Customer"; // Sheet "Customer"
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

// Phương thức doPost
const doPost = (request = {}) => {
  const { postData: { contents, type } = {} } = request;
  var data = parseFormData(contents);
  
  // Lấy tên sheet từ dữ liệu gửi lên, nếu không có thì sử dụng sheet mặc định
  var sheetName = data.sheetName || DATA_ENTRY_SHEET_NAME; 
  
  // Chọn sheet cần xử lý
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  // Nếu không tìm thấy sheet, trả về lỗi
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Sheet không hợp lệ' }))
                          .setMimeType(ContentService.MimeType.JSON);
  }
  
  appendToGoogleSheet(sheet, data);
  return ContentService.createTextOutput(contents).setMimeType(ContentService.MimeType.JSON);
};

// Hàm chuyển đổi dữ liệu từ chuỗi URL encoded sang đối tượng
function parseFormData(postData) {
  var data = [];
  var parameters = postData.split('&');
  for (var i = 0; i < parameters.length; i++) {
    var keyValue = parameters[i].split('=');
    data[keyValue[0]] = decodeURIComponent(keyValue[1]);
  }
  return data;
}

// Hàm ghi dữ liệu vào Google Sheets
function appendToGoogleSheet(sheet, data) {
  // Lấy các headers từ sheet hiện tại
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Map dữ liệu từ client vào các cột của sheet
  var rowData = headers.map(header => data[header] || ''); // Nếu không có dữ liệu cho header, để trống
  
  // Thêm dòng dữ liệu vào cuối bảng
  sheet.appendRow(rowData);
}


// GET
const AUTH_TOKEN = "PRO"; // Token bí mật

function doGet(e) {
  // Lấy token và tên sheet từ tham số URL
  var token = e.parameter.token;
  var sheetName = e.parameter.sheet;

  // Kiểm tra token
  if (token !== AUTH_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Kiểm tra tên sheet
  if (!sheetName) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet name is required" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lấy sheet từ Google Sheets
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: `Sheet "${sheetName}" not found` }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lấy dữ liệu toàn bộ bảng và header
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();

  // Chuyển dữ liệu thành JSON
  var jsonData = [];
  var headers = data[0]; // Dòng đầu làm header
  for (var i = 1; i < data.length; i++) { // Bắt đầu từ dòng 2
    var rowObject = {};
    for (var j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = data[i][j]; // Gán header với giá trị tương ứng của từng cột
    }
    jsonData.push(rowObject);
  }

  // Trả về dạng JSON
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
