HunqD();
function HunqD() {
    const summonerName = 'HunqD';

    // Thay đổi API_KEY bằng API Key của bạn từ Riot Games
    const API_KEY = 'RGAPI-96388fae-c753-4eff-842c-2b056813ad87';

    // Tạo URL yêu cầu API
    const apiUrl = `https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`;

    // Gửi yêu cầu đến API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            document.getElementById('icon').src = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/" + data.profileIconId +".png";
            document.getElementById('name').src = data.name;
            document.getElementById('level').src = data.summonerLevel;
            // resultDiv.innerHTML = `
            //     <h2>Thông tin người chơi</h2>
            //     <p>Tên người chơi: ${data.name}</p>
            //     <p>ID người chơi: ${data.id}</p>
            //     <p>puuid: ${data.puuid}</p>
            //     <p>Máy chủ: ${data.region}</p>
            //     <p>Cấp: ${data.summonerLevel}</p>
            //     <p>revisionDate: ${data.revisionDate}</p>
            //     <img alt="${data.profileIconId}" srcset="http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/${data.profileIconId}.png">
            // `;
            const rankApiUrl = `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${API_KEY}`;

            fetch(rankApiUrl)
                .then(response => response.json())
                .then(rankData => {
                    // Xử lý phản hồi từ API về rank ở đây
                    if (rankData.length > 0) {
                        const rankInfo = rankData[0]; // Giả sử lấy thông tin rank đầu tiên
                        document.getElementById('rank-tier').textContent = rankInfo.tier + ' ' + rankInfo.rank;
                        document.getElementById('rank-points').textContent = rankInfo.leaguePoints + ' điểm';
                    } else {
                        document.getElementById('rank-info').innerHTML = '<p>Người chơi này không có rank hiện tại.</p>';
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu đến API Rank: ', error);
                    document.getElementById('rank-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin rank.</p>';
                });

        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu đến API: ', error);
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin người chơi.</p>';
        });
}

document.getElementById('search-button').addEventListener('click', function () {
    const summonerName = document.getElementById('summoner-name').value;

    // Thay đổi API_KEY bằng API Key của bạn từ Riot Games
    const API_KEY = 'RGAPI-96388fae-c753-4eff-842c-2b056813ad87';

    // Tạo URL yêu cầu API
    const apiUrl = `https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`;

    // Gửi yêu cầu đến API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            document.getElementById('icon').src = "http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/" + data.profileIconId +".png";
            document.getElementById('name').src = data.name;

            // resultDiv.innerHTML = `
            //     <h2>Thông tin người chơi</h2>
            //     <p>Tên người chơi: ${data.name}</p>
            //     <p>ID người chơi: ${data.id}</p>
            //     <p>puuid: ${data.puuid}</p>
            //     <p>Máy chủ: ${data.region}</p>
            //     <p>Cấp: ${data.summonerLevel}</p>
            //     <p>revisionDate: ${data.revisionDate}</p>
            //     <img alt="${data.profileIconId}" srcset="http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/${data.profileIconId}.png">
            // `;
            const rankApiUrl = `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${API_KEY}`;

            fetch(rankApiUrl)
                .then(response => response.json())
                .then(rankData => {
                    // Xử lý phản hồi từ API về rank ở đây
                    if (rankData.length > 0) {
                        const rankInfo = rankData[0]; // Giả sử lấy thông tin rank đầu tiên
                        document.getElementById('rank-tier').textContent = rankInfo.tier + ' ' + rankInfo.rank;
                        document.getElementById('rank-points').textContent = rankInfo.leaguePoints + ' điểm';
                    } else {
                        document.getElementById('rank-info').innerHTML = '<p>Người chơi này không có rank hiện tại.</p>';
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu đến API Rank: ', error);
                    document.getElementById('rank-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin rank.</p>';
                });

        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu đến API: ', error);
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin người chơi.</p>';
        });



});
// Lấy thông tin về lịch sử rank và điểm rank
