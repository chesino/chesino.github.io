// Load existing tally data from local storage
document.addEventListener('DOMContentLoaded', () => {
    const savedTallies = JSON.parse(localStorage.getItem('tallies')) || [];
    savedTallies.forEach(tally => {
        addTally(tally.itemName);
    });
});

const itemNameEnter = document.getElementById('itemName');
itemNameEnter.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTally();
    }
});

function addTally(itemName) {
    itemName = itemName || document.getElementById("itemName").value;

    if (itemName.trim() !== "") {
        var newTally = document.createElement("div");
        newTally.className = "Tally";

        var head = document.createElement("div");
        head.className = "Head";

        var item = document.createElement("div");
        item.className = "Item";
        item.innerText = itemName;

        var clickCount = 0;

        var delButton = document.createElement("button");
        delButton.className = "Del-Item";
        delButton.innerHTML = '<i class="fa-solid fa-ban"></i>';
        delButton.addEventListener("click", function () {
            clickCount++;
            if (clickCount === 3) {
                newTally.remove();
                clickCount = 0;
                saveToLocalStorage();
            }
        });

        head.appendChild(item);
        head.appendChild(delButton);

        var body = document.createElement("div");
        body.className = "Body";

        var minusButton = document.createElement("button");
        minusButton.innerHTML = '<i class="fa-solid fa-minus"></i>';
        minusButton.addEventListener("click", function () {
            var inputNumber = body.querySelector("input");
            inputNumber.value = Math.max(0, parseInt(inputNumber.value) - 1);
        });

        var numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.value = "0";

        var plusButton = document.createElement("button");
        plusButton.innerHTML = '<i class="fa-solid fa-plus"></i>';
        plusButton.addEventListener("click", function () {
            var inputNumber = body.querySelector("input");
            inputNumber.value = parseInt(inputNumber.value) + 1;
        });

        body.appendChild(minusButton);
        body.appendChild(numberInput);
        body.appendChild(plusButton);

        newTally.appendChild(head);
        newTally.appendChild(body);

        document.getElementById("Tally").appendChild(newTally);

        saveToLocalStorage();
        document.getElementById("itemName").value = '';
    } else {
        alert('???');
    }
}

function saveToLocalStorage() {
    const tallies = [];
    const tallyElements = document.getElementsByClassName("Item");
    for (const element of tallyElements) {
        tallies.push({ itemName: element.innerText });
    }
    localStorage.setItem('tallies', JSON.stringify(tallies));
}

const deleteAllButton = document.getElementById("DeleteAll");
deleteAllButton.addEventListener("click", function () {
    localStorage.removeItem('tallies');
    document.getElementById("Tally").innerHTML = '';
});



