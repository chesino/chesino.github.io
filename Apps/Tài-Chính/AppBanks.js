function handlePasteClick() {
  navigator.clipboard.readText()
    .then(function(clipboardData) {
      const inputText = clipboardData;

      let regexA, regexB, regexC, regexD, regexE, regexF;

      if (inputText.includes("Thẻ VCB Visa")) {
        regexA = /[+-]?\d{1,3}(?:,\d{3})*(?:,\d{1,3})?(?= VND(?!\.))/;
        regexB = /\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/;
        regexC = /\d{1,3}(?:,\d{3})*(?= VND\.)/;
        regexE = /sử dụng tại ([^\d]+) số tiền/;
      } else {
        regexA = /[+-]?\d{1,3}(?:,\d{3})*(?:,\d{1,3})?(?= VND(?!\.))/;
        regexB = /\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/;
        regexC = /\d{1,3}(?:,\d{3})*(?= VND\.)/;
      }

      const regexArr = [regexA, regexB, regexC, regexE];

      const matches = regexArr.map(regex => inputText.match(regex));

      let transactionMessage = '';

      if (matches[0] !== null) {
        var SoTienGD = matches[0][0].replace(/,/g, '');
        var SoTienGDr = matches[0][0];
        var ThoiGianGD = '[' + matches[1][0].replace(/-/g, '/') + ']';

        let NoiDungGD = ''; // Khai báo biến 
        // Swal prompt
        (async () => {
          const { value: text } = await Swal.fire({
            input: "textarea",
            inputLabel: "Nội dung giao dịch",
            inputPlaceholder: "Hãy nhập nội dung giao dịch...",
            inputAttributes: {
              "aria-label": "Type your message here"
            },
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            confirmButtonColor: "#3085d6",

          });
          if (text || text === "") {
            let NoiDungGD = text;

            if (NoiDungGD != "") {
              NoiDungGD += "."
            }
            if (inputText.includes("Thẻ VCB Visa")) {
              SoTienGD = "-" + SoTienGD;
              SoTienGDr = "-" + SoTienGDr;
            };
            if (inputText.includes("VED")) {
              NoiDungGD += "Shopee.";
            };

            if (inputText.includes("Hủy GD thẻ VCB Visa")) {
              SoTienGD = "+" + SoTienGD;
              SoTienGDr = "+" + SoTienGDr;
              NoiDungGD += "Hoàn trả do huỷ GD";
            };

            if (inputText.includes("MOMO")) {
              NoiDungGD += "MOMO.";
            };
            if (inputText.includes("BEGROUP")) {
              SoTienGD = "-" + SoTienGD;
              SoTienGDr = "-" + SoTienGDr;
              NoiDungGD += "BE.";
            };
            if (inputText.includes("CIRCLE K")) {
              SoTienGD = "-" + SoTienGD;
              SoTienGDr = "-" + SoTienGDr;
              NoiDungGD += "CIRCLE K.";
            };



            // Thêm các dòng code cần thực thi sau khi nhập xong vào đây
            if (matches[3] !== null) {
              if (SoTienGD < 0) {
                transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + 'đ. ' + NoiDungGD + 'Banking.';
              } else {
                transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + 'đ. ' + NoiDungGD + 'Banking.';
              }

            } else {
              if (SoTienGD < 0) {
                transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + 'đ.' + NoiDungGD;
              } else {
                transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + 'đ.' + NoiDungGD;
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
          }
        })();
      } else {
        Fail('Không đúng định dạng hoặc không có dữ liệu.')
      }
    })
    .catch(function() {
      Warning('🤔 Có sao chép gì đâu mà dán.')
    });
  Rule503020();
}