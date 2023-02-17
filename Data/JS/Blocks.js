var showBlock = document.getElementById("showBlock");
function CheckBlock() {
    var Who = document.getElementById("getBlock").value;
    
    if (Who == 'BLOCK') {
        showBlock.innerText = 'Tài khoản "'+Who+'" đã bị hạn chế hoặc bị chặn.'
    } else {
        if (Who == 'Hoàng Nguyễn Thy Thy') {
            showBlock.innerText = 'NYC Thy của tui sợ bị hạn chế hay chặn à, không có sao đâu yên tâm he 😉.'
        } else {
            showBlock.innerText ='Bạn không nằm trong danh sách bị chặn hay hạn chế.'
        }
    }
    
}