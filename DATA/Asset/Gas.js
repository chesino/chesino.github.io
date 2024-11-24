let gas95Price = 0;

async function fetchData() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=https://www.pvoil.com.vn/tin-gia-xang-dau');
        const data = await response.json();
        const text = data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const table = doc.querySelector('.table');

        if (table) {
            const dateUpdateElement = table.querySelector('thead tr span strong');
            const dateUpdate = dateUpdateElement ? dateUpdateElement.innerText : 'N/A';

            const rows = table.querySelectorAll('tbody tr');
            const prices = {
                gas95: 'N/A',
                gas92: 'N/A',
                oilDO: 'N/A',
                oilKO: 'N/A',
                gas95s: 'N/A',
                gas92s: 'N/A',
                oilDOs: 'N/A',
                oilKOs: 'N/A'
            };

            const updatePrices = (product, price, isSale) => {

                
                if (product.includes('Xăng RON 95')) {
                    console.log(  isSale ? prices.gas95s = price : prices.gas95 = price);
                    
                    isSale ? prices.gas95s = price : prices.gas95 = price;
                    if (!isSale) {
                        gas95Price = price; // Set gas95Price for calculation
                    }
                } else if (product.includes('Xăng E5 RON 92')) {
                    isSale ? prices.gas92s = price : prices.gas92 = price;
                } else if (product.includes('Dầu DO 0,05S')) {
                    isSale ? prices.oilDOs = price : prices.oilDO = price;
                } else if (product.includes('Dầu KO')) {
                    isSale ? prices.oilKOs = price : prices.oilKO = price;
                }
            };

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');

                if (cells.length > 3) {
                    const product = cells[1].innerText.trim();
                    const price = cells[2].innerText.trim().replace(/\./g, '');
                    updatePrices(product, price, false);

                    const salePrice = cells[3].innerText.trim().replace(/\./g, '');
                    updatePrices(product, salePrice, true);
                }
            });

            document.getElementById('gas-95').innerText = formatWithDots(prices.gas95) + 'đ';
            document.getElementById('gas-92').innerText = formatWithDots(prices.gas92) + 'đ';
            document.getElementById('oil-do').innerText = formatWithDots(prices.oilDO) + 'đ';
            document.getElementById('oil-ko').innerText = formatWithDots(prices.oilKO) + 'đ';

            updateSalePrice('gas-95s', prices.gas95s + 'đ');
            updateSalePrice('gas-92s', prices.gas92s + 'đ');
            updateSalePrice('oil-dos', prices.oilDOs + 'đ');
            updateSalePrice('oil-kos', prices.oilKOs + 'đ');

            document.getElementById('dateupdate').innerText = dateUpdate;
        } else {
            Fail('Lỗi', 'Không thể cập nhật giá xăng dầu');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        Fail('Lỗi', 'Lỗi khi lấy dữ liệu xăng dầu');
    }
}

function updateSalePrice(elementId, price) {
    const element = document.getElementById(elementId);
    element.innerText = price;
    if (price.includes('-')) {
        element.classList.add('negative');
    } else if (price.includes('+')) {
        element.classList.add('positive');
    } else {
        element.classList.remove('negative', 'positive');
    }
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
