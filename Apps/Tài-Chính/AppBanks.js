function handlePasteClick() {
    navigator.clipboard.readText()
        .then(function (clipboardData) {
            alert("Đã nhấn")
            const inputText = clipboardData;

            const regexA = /[+-]?\d{1,3}(?:,\d{3})*(?:,\d{1,3})?(?= VND(?!\.))/;
            const regexB = /\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/;
            const regexC = /\d{1,3}(?:,\d{3})*(?= VND\.)/;
            const regexE = /toi\d{10} [A-Z\s]+|toi \d+ [A-Z\s]+/g;
            const regexF = /(?<=\()[^)]+(?=\))/;
            const regexD = /tu \d+ [A-Z\s]+/g;
            const regexArr = [regexA, regexB, regexC, regexE, regexF, regexD];

            const matches = regexArr.map(regex => inputText.match(regex));

            let transactionMessage = '';

            if (matches[0] !== null) {
                let SoTienGD = parseFloat(matches[0][0].replace(/,/g, ''));
                let SoTienGDr = matches[0][0];
                let ThoiGianGD = '[' + matches[1][0].replace(/-/g, '/') + ']';

                if (matches[3] !== null) {
                    let NguoiNhan = matches[3][0].startsWith('toi') ? 'Chuyển tiền tới ' + matches[3][0].replace(/^toi | N$/g, '') : matches[3][0];
                    let NguoiGui = matches[5][0].startsWith('tu') ? 'Từ ' + matches[5][0].replace(/^tu /, '') : matches[5][0];
                    if (SoTienGD < 0) {
                        transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + ' đ. ' + NguoiNhan + '.';
                    } else {
                        transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + ' đ. ' + NguoiGui + NguoiNhan + '.';
                    }

                } else {
                    if (SoTienGD < 0) {
                        transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + ' đ.';
                    } else {
                        transactionMessage = ThoiGianGD + ' Số dư Tiền Thẻ ' + SoTienGDr + ' đ.';
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
                Fail('Không đúng định dạng hoặc không có dữ liệu.');
            }
        })
        .catch(function (error) {
            console.error('Lỗi: ', error);
            Warning('🤔 Có sao chép gì đâu mà dán.');
        });
    Rule503020();
}
