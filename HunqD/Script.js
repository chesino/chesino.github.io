const jsonData = [
    [
        {
          "name": "Me",
          "profileURL": "",
          "timestamp": 1697068800,
          "id": "61551995024526"
          
        },
        {
          "name": "Ánh Hằng",
          "profileURL": "https://www.facebook.com/profile.php?id=100092307943151",
          "timestamp": 1701959002,
          "id": "100092307943151"
        },
        {
          "name": "Trần Ngọc Ánh",
          "profileURL": "https://www.facebook.com/profile.php?id=100088260422422",
          "timestamp": 1697116606,
          "id": "100088260422422"
        },
        {
          "name": "Hải Yến",
          "profileURL": "https://www.facebook.com/profile.php?id=100073434319397",
          "timestamp": 1701998563,
          "id": "100073434319397"
        },
        {
          "name": "Phuong Linh",
          "profileURL": "https://www.facebook.com/profile.php?id=100063894533991",
          "timestamp": 1702186683,
          "id": "100063894533991"
        },
        {
          "name": "Ngọc Linh",
          "profileURL": "https://www.facebook.com/profile.php?id=100060666301063",
          "timestamp": 1697275904,
          "id": "100060666301063"
        },
        {
          "name": "Nisi Kawa",
          "profileURL": "https://www.facebook.com/profile.php?id=100057501075921",
          "timestamp": 1702021105,
          "id": "100057501075921"
        },
        {
          "name": "Trọng Nghĩa",
          "profileURL": "https://www.facebook.com/profile.php?id=100052261622413",
          "timestamp": 1702295638,
          "id": "100052261622413"
        },
        {
          "name": "Nhi Rex",
          "profileURL": ""
        },
        {
          "name": "Nhỏ Nguyễn",
          "profileURL": "https://www.facebook.com/profile.php?id=100044510499977",
          "timestamp": 1697286855,
          "id": "100044510499977"
        },
        {
          "name": "Phan Mai Ly",
          "profileURL": "https://www.facebook.com/profile.php?id=100042744378107",
          "timestamp": 1701868351,
          "id": "100042744378107"
        },
        {
          "name": "Tiến Đạt",
          "profileURL": "https://www.facebook.com/profile.php?id=100042140778354",
          "timestamp": 1697278179,
          "id": "100042140778354"
        },
        {
          "name": "Vo Hoang Phi Nhung",
          "profileURL": "https://www.facebook.com/ins.pnkunn",
          "timestamp": 1702269050
        },
        {
          "name": "Ngô Khanh",
          "profileURL": "https://www.facebook.com/ngo.h.khanh.716",
          "timestamp": 1697112574
        },
        {
          "name": "Quang Thiện",
          "profileURL": "https://www.facebook.com/q.thien.vu.9",
          "timestamp": 1697114063
        },
        {
          "name": "Bùi Thanh Hiền",
          "profileURL": "https://www.facebook.com/hien40555",
          "timestamp": 1697111769
        },
        {
          "name": "Kiều My",
          "profileURL": "https://www.facebook.com/profile.php?id=100022277839522",
          "timestamp": 1702221540,
          "id": "100022277839522"
        },
        {
          "name": "Lê Ngọc Trầm",
          "profileURL": "https://www.facebook.com/tram.lengoctram.948",
          "timestamp": 1701954695
        },
        {
          "name": "Nhật Hạ",
          "profileURL": "https://www.facebook.com/nhatha941",
          "timestamp": 1697276525
        },
        {
          "name": "Tiến Lê",
          "profileURL": "https://www.facebook.com/profile.php?id=100014569175965",
          "timestamp": 1697276841,
          "id": "100014569175965"
        },
        {
          "name": "Minh Quân",
          "profileURL": "https://www.facebook.com/quan31702",
          "timestamp": 1697275928
        },
        {
          "name": "Thanh Anh",
          "profileURL": "https://www.facebook.com/thanhanh66",
          "timestamp": 1697282191
        },
        {
          "name": "Ân Thanh Tân",
          "profileURL": "https://www.facebook.com/tandeptrai29122002",
          "timestamp": 1697283245
        },
        {
          "name": "Nguyễn AnhDuy",
          "profileURL": "https://www.facebook.com/nguyenahdyy",
          "timestamp": 1697276964
        },
        {
          "name": "Trung Nguyễn",
          "profileURL": "https://www.facebook.com/trung22121998",
          "timestamp": 1697385319
        },
        {
          "name": "Nâu",
          "profileURL": "https://www.facebook.com/naucuabame",
          "timestamp": 1697111612
        },
        {
          "name": "Hao Tu",
          "profileURL": "https://www.facebook.com/profile.php?id=61552165441962",
          "timestamp": 1701964236,
          "id": "61552165441962"
        },
        {
          "name": "Lê Đức Thảnh",
          "profileURL": "https://www.facebook.com/profile.php?id=61551121340761",
          "timestamp": 1697280584,
          "id": "61551121340761"
        },
        {
          "name": "Hồ Ngọc Tâm Nhi",
          "profileURL": "https://www.facebook.com/profile.php?id=61551075231497",
          "timestamp": 1702271524,
          "id": "61551075231497"
        }
      ]
];

function searchUser() {
    const searchInput = document.getElementById('searchInput').value;
    const resultDiv = document.getElementById('result');

    const result = searchByNameOrID(searchInput);

    if (result) {
        const formattedTime = formatTimestamp(result.timestamp);
        const formattedTime2 = formatTimestamp2(result.timestamp);
        if (result.id === undefined) {
            result.id = 'Chưa cập nhật ID'
            img = '/DATA/logo.png';

        } else {
            result.id
            img = `https://graph.facebook.com/${result.id}/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        }
        resultDiv.innerHTML = `

        <div class="Head">
            <div class="Avatar">
                <img src="${img}" alt="" srcset="">
            </div>
            <div class="Icon">
                <i class="fa-solid fa-link"></i>
            </div>
            <div class="Avatar">
                <img src="https://graph.facebook.com/100045640179308/picture?width=9999&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662" alt="" srcset="">
            </div>
        </div>
        <div class="Time">
            <h2> ${result.name}, bạn đã kết nối với Hùng</h2>
            <h1>${formattedTime2}</h1>
        </div>
        <div class="More">
            <div class="Card">
                <div class="Label">
                    Thời gian kết bạn
                </div>
                <div class="Output">
                    ${formattedTime}
                </div>
            </div>
            <div class="Card">
                <div class="Label">
                    ID của bạn
                </div>
                <div class="Output">
                    ${result.id}
                </div>
            </div>
        </div>
      `;
    } else {
        resultDiv.innerHTML = '<p>Bạn không có trong danh sách bạn bè hoặc nhập sai dữ liệu.</p>';
    }
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Đổi timestamp thành mili giây
    return date.toLocaleString(); // Sử dụng phương thức toLocaleString() để định dạng ngày giờ
}
function formatTimestamp2(timestamp) {
    const now = new Date();
    const date = new Date(timestamp * 1000);

    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };

    const nowFormatted = now.toLocaleDateString('en-US', options);
    const dateFormatted = date.toLocaleDateString('en-US', options);

    console.log(`Ngày hiện tại: ${nowFormatted}`);
    console.log(`Ngày từ timestamp: ${dateFormatted}`);

    // Tính số ngày chênh lệch
    const timeDiff = now.getTime() - date.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    const yearsDiff = Math.floor(daysDiff / 365);
    const monthsDiff = Math.floor((daysDiff % 365) / 30);
    const remainingDays = daysDiff % 30;

    let result = '';

    if (yearsDiff > 0) {
        result = `${remainingDays} ngày ${monthsDiff} tháng ${yearsDiff} năm`;
    } else if (monthsDiff > 0) {
        result = `${remainingDays} ngày ${monthsDiff} tháng`;
    } else {
        result = `${remainingDays} ngày`;
    }

    return result;
}


function searchByNameOrID(query) {
    for (const data of jsonData[0]) {
        if (data.name === query || data.id === query  || data.profileURL === query) {
            return data;
        }
    }
    return null;
}
