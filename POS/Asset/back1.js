const DATA_ENTRY_SHEET_NAME = "DataBase"; // Mặc định là sheet "DataBase"
const CUSTOMER_SHEET_NAME = "Customer"; // Sheet "Customer"
var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
// Phương thức kiểm tra token
function isAuthorized(token, taskType) {
    const tokenSheet = spreadsheet.getSheetByName("Token");
    if (!tokenSheet) return false;
    const data = tokenSheet.getDataRange().getValues(); // Lấy toàn bộ bảng Token
    const headers = data[0];
    const taskCol = headers.indexOf('Task');
    const tokenCol = headers.indexOf('Token');
    for (let i = 1; i < data.length; i++) {
        const task = data[i][taskCol];
        const tkn = data[i][tokenCol];
        // Kiểm tra quyền truy cập nếu token là "full" hoặc token này có quyền truy cập vào taskType
        if (tkn === token && (task === taskType || task === 'full')) {
            return true;
        }
    }
    return false;
}
// Phương thức doGet
function doGet(e) {
    const token = e.parameter.token;
    const sheetName = e.parameter.sheet;
    // Kiểm tra token cho quyền đọc và viết
    if (!token || !isAuthorized(token, 'read')) {
        return ContentService.createTextOutput(JSON.stringify({
                error: "Unauthorized"
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    // Nếu yêu cầu sheet là "Token", chỉ admin mới có quyền đọc
    if (sheetName === 'Token' && !isAuthorized(token, 'admin')) {
        return ContentService.createTextOutput(JSON.stringify({
                error: "Unauthorized access to Token sheet"
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    if (!sheetName) {
        return ContentService.createTextOutput(JSON.stringify({
                error: "Sheet name is required"
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
                error: `Sheet "${sheetName}" not found`
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();
    const headers = data[0];
    const timeZone = Session.getScriptTimeZone(); // Mặc định là GMT+7 nếu đã đặt đúng
    const jsonData = [];
    for (let i = 1; i < data.length; i++) {
        const rowObject = {};
        for (let j = 0; j < headers.length; j++) {
            let value = data[i][j];
            if (value instanceof Date) {
                // Format thủ công theo giờ Việt Nam
                value = Utilities.formatDate(value, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
            }
            rowObject[headers[j]] = value;
        }
        jsonData.push(rowObject);
    }
    return ContentService.createTextOutput(JSON.stringify(jsonData))
        .setMimeType(ContentService.MimeType.JSON);
}
// Phương thức doPost
function doPost(request = {}) {
    const {
        postData: {
            contents,
            type,
            token
        } = {}
    } = request;
    // Kiểm tra token
    if (!token || !isAuthorized(token, 'write')) {
        return ContentService.createTextOutput(JSON.stringify({
                error: "Unauthorized"
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    var data = parseFormData(contents);
    // Lấy sheet Customer
    var sheet = spreadsheet.getSheetByName(CUSTOMER_SHEET_NAME);
    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
                error: 'Sheet không hợp lệ'
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    // Tìm khách hàng theo Name và Phone
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var headers = values[0];
    var nameCol = headers.indexOf('Name');
    var phoneCol = headers.indexOf('Phone');
    var usageCol = headers.indexOf('Usage');
    var totalCol = headers.indexOf('Total');
    for (var i = 1; i < values.length; i++) {
        if (values[i][nameCol] === data.Name && values[i][phoneCol] === data.Phone) {
            // Cập nhật Usage và Total
            var row = i + 1;
            var currentUsage = Number(values[i][usageCol]) || 0;
            var currentTotal = Number(values[i][totalCol]) || 0;
            sheet.getRange(row, usageCol + 1).setValue(currentUsage + 1);
            sheet.getRange(row, totalCol + 1).setValue(currentTotal + Number(data.Total));
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                message: 'Cập nhật thành công'
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }
    // Nếu không tìm thấy khách hàng, thêm mới
    appendToGoogleSheet(sheet, data);
    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Thêm mới thành công'
    })).setMimeType(ContentService.MimeType.JSON);
}
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