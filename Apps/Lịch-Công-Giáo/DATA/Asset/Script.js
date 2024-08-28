document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.allorigins.win/get?url=https://loichuahomnay.vn/lich-cong-giao')
        .then(response => response.json())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            const contentDiv = doc.querySelector('#the-post');

            if (contentDiv) {
                // Tách dữ liệu sau khi đã loại bỏ .pgae
                const dateAndSaint = contentDiv.querySelector('.ttlcghn').innerText.trim();
                const celebrationType = contentDiv.querySelector('.ploaile').innerText.trim();
                const readingsAndGospel = contentDiv.querySelector('.dsbd').innerText.trim();
                const priestVestmentColor = contentDiv.querySelector('.paole').innerText.trim();
                const lcg = contentDiv.querySelector('.lcgth').innerHTML.trim();

                // Gán dữ liệu vào các thẻ p với id tương ứng
                document.querySelector('.content').innerHTML = `
                    <div>${lcg}</div>
                `;

                const leDIV = document.getElementById('leDIV');
                const ngayhomnay = document.getElementById('ngayhomnay');
                const loaile = document.getElementById('loaile');
                const lehomnay = document.getElementById('lehomnay');
                const tinmung = document.getElementById('tinmung');
                const aole = document.getElementById('aole');

                const [date, content] = dateAndSaint.split(": ");
                ngayhomnay.innerText = date;

                if (celebrationType === 'Lễ nhớ - Thường Niên') {
                    loaile.style.backgroundColor = '#ffff0099'
                    loaile.style.color = '#000000'
                } else if (celebrationType === 'Lễ trọng - Thường Niên') {
                    loaile.style.backgroundColor = '#ff00009e'
                    loaile.style.color = '#ffffff'
                } else if (celebrationType === 'Lễ kính - Thường Niên') {
                    loaile.style.backgroundColor = '#00fd1f8c'
                    loaile.style.color = '#000000'
                }
                loaile.innerText = celebrationType;
                lehomnay.innerText = content;

                const readings = readingsAndGospel.replace(`Các bài đọc và tin mừng hôm nay`, "");
                tinmung.innerText = readings;

                const mauao = priestVestmentColor.replace("Áo Lễ Linh Mục: ", "");

                if (mauao === 'Đỏ') {
                    aole.src = './DATA/Chasuble/Red.png'
                } else if (mauao === 'Xanh') {
                    aole.src = './DATA/Chasuble/Green.png'
                } else if (mauao === 'Trắng') {
                    aole.src = './DATA/Chasuble/White.png'
                } else if (mauao === 'Vàng') {
                    aole.src = './DATA/Chasuble/Gold.png'
                } else if (mauao === 'Hồng') {
                    aole.src = './DATA/Chasuble/Pink.png'
                } else if (mauao === 'Tím') {
                    aole.src = './DATA/Chasuble/Purple.png'
                }

            } else {
                document.querySelector('.content').innerHTML = 'Nội dung không tìm thấy';
            }
        })
        .catch(error => {
            console.error('Có lỗi xảy ra:', error);
            document.querySelector('.content').innerHTML = 'Có lỗi xảy ra khi tải nội dung';
        });
});
