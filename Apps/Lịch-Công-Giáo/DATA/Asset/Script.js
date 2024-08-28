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
                const lcg = contentDiv.querySelector('.lcgtg:first-child').innerHTML.trim();

                // Gán dữ liệu vào các thẻ p với id tương ứng
                document.querySelector('.content').innerHTML = `
                    <div class="main">
                        <p id="date-saint">${dateAndSaint}</p>
                        <p id="celebration-type">${celebrationType}</p>
                        <p id="readings-gospel">${readingsAndGospel}</p>
                        <p id="priest-vestment-color">${priestVestmentColor}</p>
                    </div>
                    <div>${lcg}</div>
                `;
            } else {
                document.querySelector('.content').innerHTML = 'Nội dung không tìm thấy';
            }
        })
        .catch(error => {
            console.error('Có lỗi xảy ra:', error);
            document.querySelector('.content').innerHTML = 'Có lỗi xảy ra khi tải nội dung';
        });
});
