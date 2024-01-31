
const inputElements = document.querySelectorAll('.inputFM');
inputElements.forEach((input) => {
    input.addEventListener('input', formatNumber);
});

function formatNumber(event) {
    let input = event.target;
    let rawValue = input.value.replace(/\./g, ''); // Lưu trữ giá trị gốc (loại bỏ dấu chấm)
    let formattedValue = formatWithDots(rawValue);
    input.value = formattedValue;
    input.dataset.rawValue = rawValue; // Lưu trữ giá trị gốc trong thuộc tính 'data-raw-value'
}

function formatWithDots(value) {
    if (isNaN(value)) {
        return ''; // Nếu không phải là số thì trả về chuỗi rỗng
    }

    // Chuyển đổi giá trị thành số nguyên từ chuỗi đã loại bỏ dấu chấm
    let intValue = parseInt(value, 10);

    let parts = intValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
}

const Nation = document.getElementById('Nation');
const country = 1;

Nation.addEventListener("click", () => {
    if (Nation.innerText === 'VN') {
        Nation.innerText = 'JP';
        country = 0;
    } else {
        Nation.innerText = 'VN';
        country = 1; //1 là Việt Nam 0 là Nhật
    }
});

function CalcA() {
    // GDP/Năm 
    var YGDPVN = 100000000; //Thống kê 2023
    var YGDPJP = 100000000;

    // Mức chi tiêu trung bình / năm 
    var SpendVN = 2795000 * 12;
    var SpendJP = 2795000;



    const Total = document.getElementById('Total').dataset.rawValue;
    const Nation = document.getElementById('Nation');
    const DWeek = document.getElementById('DWeek').value;
    const HWeek = document.getElementById('HWeek').value;
    const Spend = document.getElementById('Spend').dataset.rawValue;
    const Target = document.getElementById('Target').dataset.rawValue;
    let Currency = '';

    if (Nation.innerText == 'VN') {
        Currency = 'đ'
    } else {
        Currency = '¥'
    }

    var YTotal  = Total * 12 ;
    var YTotalSpend = Spend * 12 ;
    var YTotalSave = YTotal - YTotalSpend ;

    var WTotal = Total / 4;
    var WTotalSpend = Spend / 4;

    var DTotal = WTotal / DWeek;
    var DTotalSpend = WTotalSpend / DWeek;

    var Haverage = HWeek / DWeek;
    var HTotal = (WTotal / DWeek) / (Haverage);
    var HTotalSpend = (WTotalSpend / DWeek) / (Haverage);

    var PerSave = ( YTotal - YTotalSpend) * 100 / Target ;
    var Guess = Target / (Total - Spend);

  

    document.getElementById('resultYear').innerText = formatWithDots(YTotal) + Currency; 
    document.getElementById('resultYear2').innerText = formatWithDots(YTotalSpend) + Currency; 
    document.getElementById('resultYear3').innerText = formatWithDots(YTotalSave) + Currency; 

    
    document.getElementById('resultWekk').innerText = formatWithDots(WTotal) + Currency; 
    document.getElementById('resultWekk2').innerText = formatWithDots(WTotalSpend) + Currency;

    document.getElementById('resultDay').innerText = formatWithDots(DTotal) + Currency; 
    document.getElementById('resultDay2').innerText = formatWithDots(DTotalSpend) + Currency; 

    document.getElementById('resultHour').innerText = formatWithDots(HTotal) + Currency; 
    document.getElementById('resultHour2').innerText = formatWithDots(HTotalSpend) + Currency; 
    document.getElementById('resultHour3').innerText = formatWithDots(PerSave) + '% so với Mục tiêu'; 
    document.getElementById('resultHour4').innerText = formatWithDots(Guess) + ' Tháng'; 
    
    const Rate1 = document.getElementById('resultRate')
    const Rate2 =  document.getElementById('resultRate2')
    const Rate3 = document.getElementById('resultRate3')
    const Rate4 = document.getElementById('resultRate4')
    
    if (country === 1) {
        //Thu nhập
        if (YTotal < YGDPVN) {
            Rate1.innerText = 'Thấp';
        }else if (YTotal == YGDPVN) {
            Rate1.innerText = 'Trung bình';
        }else {
            Rate1.innerText = 'Cao';
        }

        //Chi tiêu
        if (YTotalSpend < SpendVN) {
            Rate2.innerText = 'Thấp';
        }else if (YTotalSpend == SpendVN) {
            Rate2.innerText = 'Trung bình';
        }else {
            Rate2.innerText = 'Cao';
        }

        //Tiết kiệm
        if (PerSave < 20) {
            Rate3.innerText = 'Thấp';
        }else if (PerSave == 20) {
            Rate3.innerText = 'Trung bình';
        }else {
            Rate3.innerText = 'Cao';
        }

        //Mục tiêu
        if (Guess < 12) {
            Rate4.innerText = 'Ngắn hạn';
        }
        if (Guess > 12) {
            Rate4.innerText = 'Dài hạn';
        }


    } else{
        

    }
}
