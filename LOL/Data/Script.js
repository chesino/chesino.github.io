document.getElementById('search-button').addEventListener('click', function () {
    const summonerName = document.getElementById('summoner-name').value;
    const API_KEY = 'RGAPI-96388fae-c753-4eff-842c-2b056813ad87';

    const apiUrl = `https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Xử lý phản hồi từ API summoner
            document.getElementById('profileIconId').src = `http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/${data.profileIconId}.png`;
            document.getElementById('summonerName').innerText = data.name;
            document.getElementById('summonerLevel').innerText = data.summonerLevel;
            document.getElementById('summonerID').innerText = data.id;

            const rankApiUrl = `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${API_KEY}`;
            fetch(rankApiUrl)
                .then(response => response.json())
                .then(rankData => {
                    // Xử lý phản hồi từ API rank
                    if (rankData.length > 0) {
                        const rankInfo = rankData[0];
                        document.getElementById('RankIcon').src = `./Data/Rank/${rankInfo.tier}.png`;

                        const rankNames = {
                            'IRON': 'Sắt',
                            'BRONZE': 'Đồng',
                            'SILVER': 'Bạc',
                            'GOLD': 'Vàng',
                            'PLATINUM': 'Bạch kim',
                            'DIAMOND': 'Kim cương',
                            'MASTER': 'Cao thủ',
                            'GRANDMASTER': 'Đại cao thủ',
                            'CHALLENGER': 'Thách đấu'
                        };

                        rankInfo.tier = rankNames[rankInfo.tier] || rankInfo.tier;

                        document.getElementById('RankInfo').innerText = `${rankInfo.tier} ${rankInfo.rank}`;
                        document.getElementById('leaguePoints').innerText = `${rankInfo.leaguePoints} Điểm`;
                        document.getElementById('PointsWL').innerText = `W:${rankInfo.wins}  |  L:${rankInfo.losses}`;
                    } else {
                        document.getElementById('RankIcon').src = './Data/Rank/iron.png';
                        document.getElementById('RankInfo').innerText = 'Không có RANK.';
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu đến API Rank: ', error);
                    document.getElementById('rank-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin rank.</p>';
                });

            function normalizeChampionName(championName) {
                return championName.replace(/[^a-zA-Z0-9]/g, '');
            }

            const masteryApiUrl = `https://vn2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}/top?count=3&api_key=${API_KEY}`;
            fetch(masteryApiUrl)
                .then(response => response.json())
                .then(masteryData => {
                    // Xử lý phản hồi từ API thông thạo tướng
                    const championMasteryInfo = document.getElementById('champion-mastery-info');
                    championMasteryInfo.innerHTML = '';
                    if (masteryData.length > 0) {
                        let firstChampionLogged = false;

                        masteryData.forEach(championMastery => {
                            const championId = championMastery.championId;
                            const championJsonUrl = 'http://ddragon.leagueoflegends.com/cdn/13.17.1/data/en_US/champion.json';
                            fetch(championJsonUrl)
                                .then(response => response.json())
                                .then(championData => {
                                    const championList = championData.data;
                                    const champion = championList[Object.keys(championList).find(key => championList[key].key === championId.toString())];

                                    if (champion) {
                                        const championName = champion.name;
                                        console.log(champion.name);
                                        // Đối tượng lưu trữ cost của các tướng
                                        const championCosts = {
                                            'Yasuo': '9',
                                            'Leesin': '7',
                                            'Riven': '16',
                                            'Lucian': '19',
                                            "Vel'Koz": '2',
                                            "Kha'Zix": '4'
                                            // Thêm các tướng khác và cost tương ứng ở đây
                                        };
                                        console.log(championCosts);
                                        
                                        let championCost = '0'; // Giá trị mặc định nếu không tìm thấy cost

                                        if (championName in championCosts) {
                                            championCost = championCosts[championName];  
                                        }

                                        const normalizedChampionName = normalizeChampionName(championName);
                                        let capitalizedChampionName = normalizedChampionName.charAt(0).toUpperCase() + normalizedChampionName.slice(1).toLowerCase();
                                        


                                        if (!firstChampionLogged) {
                                            const championImageURL = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${capitalizedChampionName}_${championCost}.jpg`;
                                            document.getElementById('MainChampion').style.backgroundImage = `url(${championImageURL})`;
                                            firstChampionLogged = true;
                                        }

                                        // Kiểm tra và thay đổi tên nếu cần
                                        if (capitalizedChampionName === 'Leesin') {
                                            capitalizedChampionName = 'LeeSin'; 
                                        }

                                        const championImageUrl = `http://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/${capitalizedChampionName}.png`;


                                        const championPointsFormatted = championMastery.championPoints.toLocaleString();
                                        const championInfo = document.createElement('div');



                                        championInfo.innerHTML = `
                                                <div class="Champion">
                                                    <div class="Icon">
                                                        <img class="ChampionIcon" src="${championImageUrl}" alt="${championName} icon">
                                                    </div>
                                                    <div class="Info">
                                                        <h2>${championName}</h2>
                                                        <p>${championPointsFormatted}</p>
                                                    </div>
                                                    <div class="Mastery">
                                                        <img src="./Data/Mastery/Level_${championMastery.championLevel}.webp" alt="" srcset="">
                                                    </div>
                                                </div>
                                            `;
                                        document.getElementById('champion-mastery-info').appendChild(championInfo);
                                    } else {
                                        console.error(`Không tìm thấy tướng có ID ${championId}`);
                                    }
                                })
                                .catch(error => {
                                    console.error('Lỗi khi tải dữ liệu champion: ', error);
                                });
                        });
                    } else {
                        document.getElementById('champion-mastery-info').innerHTML = '<p>Người chơi này không có thông thạo tướng.</p>';
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu đến API thông thạo tướng: ', error);
                    document.getElementById('champion-mastery-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông thạo tướng.</p>';
                });
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu đến API: ', error);
        });
});
