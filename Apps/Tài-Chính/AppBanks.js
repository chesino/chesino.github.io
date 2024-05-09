function handlePasteClick() {
  navigator.clipboard.readText()
    .then(function(clipboardData) {
      const inputText = clipboardData;


      let regexA, regexB, regexC, regexD, regexE, regexF;


      if (inputText.includes("Thẻ VCB Visa")) {
        regexA = /[+-]?\d{1,3}(?:,\d{3})*(?:,\d{1,3})?(?= VND(?!\.))/;
        regexB = /\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/;
        regexC = /\d{1,3}(?:,\d{3})*(?= VND\.)/;
        regexE = /sử dụng tại ([^\d]+) số tiền/;
      } else {
        regexA = /[+-]?\d{1,3}(?:,\d{3})*(?:,\d{1,3})?(?= VND(?!\.))/;
        regexB = /\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/;
        regexC = /\d{1,3}(?:,\d{3})*(?= VND\.)/;
        regexE = /toi\d{10} [A-Z\s]+|toi \d+ [A-Z\s]+/g;
        regexF = /\([^)]+\)/;
        regexD = /tu \d+ [A-Z\s]+/g;
      }


      const regexArr = [regexA, regexB, regexC, regexE, regexF, regexD];

      const matches = regexArr.map(regex => inputText.match(regex));

      let transactionMessage = '';

      if (matches[0] !== null) {
        var SoTienGD = matches[0][0].replace(/,/g, '');
        var SoTienGDr = matches[0][0];
        var ThoiGianGD = '[' + matches[1][0].replace(/-/g, '/') + ']';

        let NoteGD = "";
        if (inputText.includes("Thẻ VCB Visa")) {
          SoTienGD = "-" + SoTienGD;
          SoTienGDr = "-" + SoTienGDr;
          NoteGD = "SD tại..." ;
        };
        if (inputText.includes("Hủy GD thẻ VCB Visa")) {
          SoTienGD = "+" + SoTienGD;
          SoTienGDr = "+" + SoTienGDr;
          NoteGD = "Hoàn trả do huỷ GD" ;
        };
        if (inputText.includes("MOMO")) {
          NoteGD = "GD MOMO."

        };




        if (matches[3] !== null) {
          var NguoiNhan = matches[3][0].replace('toi', 'Chuyển tiền tới ').replace(/^toi | N$/g, '');
          var NguoiGui = matches[5][0].replace('tu', 'Từ ');
          if (SoTienGD < 0) {
            transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + ' đ. ' + NguoiNhan + '.';
          } else {
            transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + ' đ. ' + NguoiGui + NguoiNhan + '.';
          }

        } else {
          if (SoTienGD < 0) {
            transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + 'đ.' + NoteGD;
          } else {
            transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + 'đ.' + NoteGD;
          }
        }

        displayTransaction(transactionMessage);
        transactionsHistory.unshift(transactionMessage);
        SaveHistory();
        displayTransactionHistory();


        if (SoTienGD < 0) {
          addMoney(0, Number(SoTienGD));
          return;
        }
        if (SoTienGD > 0) {
          addMoney(0, Number(SoTienGD));
          return;
        }
      } else {
        Fail('Không đúng định dạng hoặc không có dữ liệu.')
      }
    })
    .catch(function() {
      Warning('🤔 Có sao chép gì đâu mà dán.')
    });
  Rule503020();
}