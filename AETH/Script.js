
function addTally() {
    // Lấy giá trị từ ô input
    var itemName = document.getElementById("itemName").value;

    // Kiểm tra nếu tên không trống
    if (itemName.trim() !== "") {
        // Tạo một thẻ Tally mới
        var newTally = document.createElement("div");
        newTally.className = "Tally";

        // Tạo phần Head của Tally
        var head = document.createElement("div");
        head.className = "Head";

        // Tạo phần Item của Head
        var item = document.createElement("div");
        item.className = "Item";
        item.innerText = itemName;

        var clickCount = 0;

        // Tạo nút Del-Item
        var delButton = document.createElement("button");
        delButton.className = "Del-Item";
        delButton.innerHTML = '<i class="fa-solid fa-ban"></i>';
        delButton.addEventListener("click", function () {
            // Tăng biến đếm lên 1 mỗi lần nút được nhấn
            clickCount++;

            // Nếu biến đếm đạt đến 2, xoá Tally và đặt lại biến đếm
            if (clickCount === 3) {
                newTally.remove();
                clickCount = 0; // Đặt lại biến đếm
            }
        });

        // Gắn các phần tử con vào Head
        head.appendChild(item);
        head.appendChild(delButton);

        // Tạo phần Body của Tally
        var body = document.createElement("div");
        body.className = "Body";

        // Tạo nút trừ
        var minusButton = document.createElement("button");
        minusButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
        minusButton.addEventListener("click", function () {
            // Giảm giá trị input:number đi 1
            var inputNumber = body.querySelector("input");
            inputNumber.value = Math.max(0, parseInt(inputNumber.value) - 1);
        });

        // Tạo input:number
        var numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.value = "0";

        // Tạo nút cộng
        var plusButton = document.createElement("button");
        plusButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
        plusButton.addEventListener("click", function () {
            // Tăng giá trị input:number lên 1
            var inputNumber = body.querySelector("input");
            inputNumber.value = parseInt(inputNumber.value) + 1;
        });

        // Gắn các phần tử con vào Body
        body.appendChild(minusButton);
        body.appendChild(numberInput);
        body.appendChild(plusButton);

        // Gắn các phần tử con vào Tally
        newTally.appendChild(head);
        newTally.appendChild(body);

        // Gắn Tally vào #Tally
        document.getElementById("Tally").appendChild(newTally);
    }else {
        alert('???')
    }
}