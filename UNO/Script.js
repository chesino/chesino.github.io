function increaseValue() {
    var value = parseInt(document.getElementById('playerCount').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('playerCount').value = value;
    if (value == 10) {
        alert('Bộ bài UNO chỉ hỗ trợ tối đa 10 người chơi. \nQuá nhiều người chơi sẽ dẫn đến nhàm chán !')
    }
}

function decreaseValue() {
    var value = parseInt(document.getElementById('playerCount').value, 10);
    value = isNaN(value) ? 0 : value;
    if (value > 2) {
        value--;
        document.getElementById('playerCount').value = value;
    } else {
        alert('Số người chơi tối thiểu là 2 người trở lên.')
    }
}

function PlayUNO() {
    var playerCount = document.getElementById("playerCount").value;
    if (playerCount < 2) {
        alert("Không thể bắt đầu trò chơi. Số người chơi tối thiểu là 2.");
    } else {
        createPlayerInputs(playerCount);
        document.getElementById("A").classList.add("hidden");
        document.getElementById("B").classList.remove("hidden");
    }
}
function createPlayerInputs(count) {
    // Create input elements based on the number of players
    for (var i = 0; i < count; i++) {
        var input = document.createElement("input");
        input.type = "text";
        input.id = "Player" + (i + 1);
        input.placeholder = "Người chơi " + (i + 1);
        document.getElementById("playerUNO").appendChild(input);
    }
}
function winValue(x) {
    var value = parseInt(document.getElementById('winValue').value, 10);
    value = isNaN(value) ? 0 : value;
    value = x
    document.getElementById('winValue').value = value;
}

function startGame() {
    document.getElementById("B").classList.add("hidden");
    document.getElementById("C").classList.remove("hidden");

    var playerCount = document.getElementById("playerCount").value;
    var playerButtonsContainer = document.getElementById("playerButtons");
    playerButtonsContainer.innerHTML = "";

    for (var i = 1; i <= playerCount; i++) {
        var playerName = document.getElementById("Player" + i).value;
        var button = document.createElement("button");
        button.id = "btnPlayer" + i;
        button.className = "btnPlayer"

        if (playerName === 'Hùng') {
            button.innerHTML = `
            <input type="text" class="Point" id="Point${i}">
            <div class="Avatar">
                <img src="https://graph.facebook.com/100045640179308/picture?type=large&amp;access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662" alt="" srcset="">
            </div>
            <div class="Name">
                <h1>Hùng</h1>
            </div>
            `;
        } else {
            button.innerHTML = `
            <input type="text" class="Point" id="Point${i}">
             <div class="Name">
                <h1>${playerName}</h1>
            </div>
            
            `
                ;
        }
        button.setAttribute("onclick", `WinRate(${i})`);
        playerButtonsContainer.appendChild(button);
    }
  
}
var Rank = 0;

function WinRate(x) {
    var MaxPoint = document.getElementById("playerCount").value;
    var MaxRank = MaxPoint - 1;

    var currentPointElement = document.getElementById(`Point${x}`);
    var historyPointElement = document.getElementById("historyPoint");
    var buttonElement = document.getElementById(`btnPlayer${x}`);
    buttonElement.disabled = true;

    if (Rank < MaxRank) {
        Rank++;

        // Lấy tên người chơi từ button
        var playerName = buttonElement.querySelector('.Name h1');
        playerName = playerName ? playerName.innerText : `Player ${x}`;

        // Convert the current content to a number before adding
        var currentPointValue = parseInt(currentPointElement.value, 10) || 0;
        currentPointElement.value = currentPointValue + (MaxPoint - Rank);

        // Tạo một li mới cho entry
        var historyEntry = document.createElement("li");
        historyEntry.textContent = `${playerName}: +${MaxPoint - Rank} điểm`;

        // Chèn vào đầu danh sách lịch sử
        historyPointElement.insertBefore(historyEntry, historyPointElement.firstChild);


        if (Rank == MaxRank) {
            Rank = 0;
            var allButtons = document.querySelectorAll('[id^="btnPlayer"]');
            allButtons.forEach(function (button) {
                button.disabled = false;
            });
            Alert('Xong');
        }
    }
   
}



function Alert(text) {
    // alert(text);
}
