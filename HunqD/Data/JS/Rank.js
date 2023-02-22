var data = `{
    "Top": {
        "uid1": 100067058574264 ,
        "name1": "Phạm Nhi",
        "note1": "Bà hoàng thả tim ❤",

        "uid2": 100013708202721 ,
        "name2": "Tô Phương Thuý",
        "note2": "Chuyên gia Haha 🤣",

        "uid3": 100089227729627 ,
        "name3": "Phạm Đạt",
        "note3": "Kẻ bán nụ cười 😂" ,

        "uid4": 100075076793753 ,
        "name4": "Chính Nguyễn",
        "note4": "Fan cứng mới nổi" ,

        "uid5": 100088260422422 ,
        "name5": "Trần Ngọc Ánh",
        "note5": "Chuyên gia rep story ✨" 
    }

}`;


var TOP = JSON.parse(data);
var Ranking = document.getElementById('Ranking')


AV1 = "https://graph.facebook.com/"+TOP.Top["uid1"]+"/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";
NA1 = TOP.Top["name1"];
NO1 = TOP.Top["note1"];

AV2 = "https://graph.facebook.com/"+TOP.Top["uid2"]+"/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";
NA2 = TOP.Top["name2"];
NO2 = TOP.Top["note2"];

AV3 = "https://graph.facebook.com/"+TOP.Top["uid3"]+"/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";
NA3 = TOP.Top["name3"];
NO3 = TOP.Top["note3"];

AV4 = "https://graph.facebook.com/"+TOP.Top["uid4"]+"/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";
NA4 = TOP.Top["name4"];
NO4 = TOP.Top["note4"];

AV5 = "https://graph.facebook.com/"+TOP.Top["uid5"]+"/picture?type=large&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662";
NA5 = TOP.Top["name5"];
NO5 = TOP.Top["note5"];


Ranking.innerHTML =
    '  <h1>Bảng xếp hạng tương tác</h1>' +
    ' <div class="UserTop" id="UserTop" >' +
    '                    <div class="Avatar">' +
    '                        <img class="imgA" src="' + AV1 + '" alt="" srcset="">' +
    '                    </div>' +
    '                    <div class="Name">' +
    '                        <h1 id="nameTop1">' + NA1 + '</h1>' +
    '                        <p id="nTop1">' + NO1 + '</p>' +
    '                    </div>' +
    '                    <div class="Rank">' +
    '                        <img  class="imgA" src="./Data/IMG/Rank/one.png" alt="" srcset="">' +
    '                    </div>' +
    '                </div>' +
    '' +
    '                <div class="UserTop">' +
    '                    <div class="Avatar">' +
    '                        <img class="imgA" src="' + AV2 + '" alt="" srcset="">' +
    '                    </div>' +
    '                    <div class="Name">' +
    '                        <h1>' + NA2 + '</h1>' +
    '                        <p>' + NO2 + '</p>' +
    '                    </div>' +
    '                    <div class="Rank">' +
    '                        <img src="./Data/IMG/Rank/second-place-medal.png" alt="" srcset="">' +
    '                    </div>' +
    '                </div>' +
    '' +
    '                <div class="UserTop">' +
    '                    <div class="Avatar">' +
    '                        <img  class="imgA"  src="' + AV3 + '" alt="" srcset="">' +
    '                    </div>' +
    '                    <div class="Name">' +
    '                        <h1>' + NA3 + '</h1>' +
    '                        <p>' + NO3 + '</p>' +
    '                    </div>' +
    '                    <div class="Rank">' +
    '                        <img src="./Data/IMG/Rank/third-place-medal.png" alt="" srcset="">' +
    '                    </div>' +
    '                </div>' +
    '                <div class="UserTop">' +
    '                    <div class="Avatar">' +
    '                        <img  class="imgA" src="' + AV4 + '" alt="" srcset="">' +
    '                    </div>' +
    '                    <div class="Name">' +
    '                        <h1>' + NA4 + '</h1>' +
    '                        <p>' + NO4 + '</p>' +
    '                    </div>' +
    '                    <div class="Rank">' +
    '                        <img src="./Data/IMG/Rank/FanCung.png" alt="" srcset="">' +
    '                    </div>' +
    '                </div>' +
    '                <div class="UserTop">' +
    '                    <div class="Avatar">' +
    '                        <img  class="imgA" src="' + AV5 + '" alt="" srcset="">' +
    '                    </div>' +
    '                    <div class="Name">' +
    '                        <h1>' + NA5 + '</h1>' +
    '                        <p>' + NO5 + '</p>' +
    '                    </div>' +
    '                    <div class="Rank">' +
    '                        <img src="./Data/IMG/Rank/Chat.png" alt="" srcset="">' +
    '                    </div>' +
    '                </div>' +
    '   <h5>Cập nhật mỗi T7 hàng tuần</h5> '
    '';



