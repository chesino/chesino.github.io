const API_KEY = 'RGAPI-96388fae-c753-4eff-842c-2b056813ad87';
const championCosts = {
    'Yasuo': '9',
    'Leesin': '7',
    'Riven': '16',
    'Lucian': '19',
    "Vel'Koz": '2',
    "Kha'Zix": '4'
    // Thêm các tướng khác và cost tương ứng ở đây
};

// Hàm gọi API và xử lý phản hồi JSON
async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${url}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
}

// Hàm lấy thông tin Summoner và xử lý
async function fetchSummonerInfo() {
    try {
        const summonerName = document.getElementById('summoner-name').value;
        const apiUrl = `https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`;
        const data = await fetchJson(apiUrl);

        document.getElementById('profileIconId').src = `http://ddragon.leagueoflegends.com/cdn/13.17.1/img/profileicon/${data.profileIconId}.png`;
        document.getElementById('summonerName').innerText = data.name;
        document.getElementById('summonerLevel').innerText = data.summonerLevel;
        document.getElementById('summonerID').innerText = data.id;

        return data;
    } catch (error) {
        console.error('Error fetching summoner info:', error);
        document.getElementById('rank-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin Summoner.</p>';
        throw error;
    }
}

// Hàm lấy thông tin Rank và xử lý
async function fetchRankInfo(summonerId) {
    try {
        const rankApiUrl = `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
        const rankData = await fetchJson(rankApiUrl);

        if (rankData.length > 0) {
            const rankInfo = rankData[0];
            document.getElementById('RankIcon').src = `./Data/Ranks/${rankInfo.tier}.png`;

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
    } catch (error) {
        console.error('Error fetching rank info:', error);
        document.getElementById('rank-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông tin rank.</p>';
    }
}

// Hàm lấy thông tin Mastery và xử lý
async function fetchMasteryInfo(summonerId) {
    try {
        const masteryApiUrl = `https://vn2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/top?count=3&api_key=${API_KEY}`;
        const masteryData = await fetchJson(masteryApiUrl);
        const championMasteryInfo = document.getElementById('champion-mastery-info');
        championMasteryInfo.innerHTML = '';

        if (masteryData.length > 0) {
            let firstChampionLogged = false;

            for (const championMastery of masteryData) {
                const championId = championMastery.championId;
                const championJsonUrl = 'https://ddragon.leagueoflegends.com/cdn/13.17.1/data/vi_VN/champion.json';
                const championData = await fetchJson(championJsonUrl);
                const championList = championData.data;
                const champion = championList[Object.keys(championList).find(key => championList[key].key === championId.toString())];
                
                
                if (champion) {
                    const championName = champion.name;
                    const championCost = championCosts[championName] || '0';
                    const normalizedChampionName = championName.replace(/[^a-zA-Z0-9]/g, '');
                    const capitalizedChampionName = normalizedChampionName.charAt(0).toUpperCase() + normalizedChampionName.slice(1).toLowerCase();

                    if (!firstChampionLogged) {
                        const championImageURL = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${capitalizedChampionName}_${championCost}.jpg`;
                        document.getElementById('MainChampion').style.backgroundImage = `url(${championImageURL})`;
                        firstChampionLogged = true;
                    }

                    const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/${capitalizedChampionName}.png`;
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
            }
        } else {
            document.getElementById('champion-mastery-info').innerHTML = '<p>Người chơi này không có thông thạo tướng.</p>';
        }
    } catch (error) {
        console.error('Error fetching mastery info:', error);
        document.getElementById('champion-mastery-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm thông thạo tướng.</p>';
    }
}
// Hàm lấy lịch sử thi đấu và hiển thị 10 trận gần nhất 

// Tạo bảng ánh xạ từ queueId sang tên tiếng Việt
const queueMapping = {
    420: 'Rank Đơn / Đôi',
    430: 'Đấu Thường',
    440: 'Rank Linh Hoạt',
    // Thêm các loại trận đấu khác tại đây
    // Ví dụ:
    // 450: 'ARAM',
};

async function fetchMatchHistory(puuid) {
    try {
        const matchHistoryApiUrl = `https://sea.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${API_KEY}`;
        const matchHistoryData = await fetchJson(matchHistoryApiUrl);
        const matchHistoryInfo = document.getElementById('match-history-info');
        matchHistoryInfo.innerHTML = '';

        if (matchHistoryData.length > 0) {
            for (const gameId of matchHistoryData) {
                const matchInfoApiUrl = `https://sea.api.riotgames.com/lol/match/v5/matches/${gameId}?api_key=${API_KEY}`;
                const matchInfo = await fetchJson(matchInfoApiUrl);

                // Lọc ra thông tin của puuid đã nhập vào
                const participant = matchInfo.info.participants.find(participant => participant.puuid === puuid);

                if (participant) {
                    const matchDate = new Date(matchInfo.info.gameCreation);

                    // Định dạng ngày giờ
                    const matchDateTimeString = matchDate.toLocaleTimeString() + ' ' + matchDate.toLocaleDateString();
                    const win = participant.win ? 'Thắng' : 'Thất bại';
                    if (participant.win === true) {
                        classWin = 'Win';
                    } else {
                        classWin = 'Lose';
                    }
                    const queueType = queueMapping[matchInfo.info.queueId] || 'Không xác định';

                    const matchInfoElem = document.createElement('div');
                    matchInfoElem.classList.add('Match');
                    
                    matchInfoElem.innerHTML = `


                        <div class="${classWin}">
                            <div class="Head">
                                <p>${queueType}</p>
                                <p>${matchDateTimeString}</p>
                            </div>
                            <div class="Body">
                                <div class="Champion">
                                    <img src="/DATA/logo.png" alt="" srcset="https://ddragon.leagueoflegends.com/cdn/13.17.1/img/champion/${participant.championName}.png">
                                </div>
                                <div class="Info">
                                    <h2>${participant.championName}</h2>
                                    <h3>${participant.kills}/${participant.deaths}/${participant.assists}</h3>
                                </div>
                            </div>
                        </div>
                    `;
                    matchHistoryInfo.appendChild(matchInfoElem);
                }
            }
        } else {
            matchHistoryInfo.innerHTML = '<p>Không có trận đấu gần đây.</p>';
        }
    } catch (error) {
        console.error('Error fetching match history:', error);
        document.getElementById('match-history-info').innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm lịch sử thi đấu.</p>';
    }
}





// Thêm lịch sử thi đấu vào sự kiện click nút tìm kiếm
document.getElementById('search-button').addEventListener('click', async function () {
    try {
        const summonerData = await fetchSummonerInfo();
        if (summonerData) {
            await fetchRankInfo(summonerData.id);
            await fetchMasteryInfo(summonerData.id);
            await fetchMatchHistory(summonerData.puuid);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});


