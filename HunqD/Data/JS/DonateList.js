const donateBtn = document.querySelector('#btnDonate');
const ibtndonate = document.querySelector('#ibtndonate');
const donateDiv = document.querySelector('.Donate');

let isFirstTimeClick = false;
let clickCount = 0;

donateBtn.addEventListener('click', function () {
    if (!isFirstTimeClick) {
        ListDonate();
        isFirstTimeClick = true;
    }
    donateDiv.classList.toggle('active');
    clickCount++;
    if (clickCount % 2 === 1) {
        ibtndonate.className = "fa-solid fa-star";
    } else {
        ibtndonate.className = "fa-regular fa-star";
    }
});

donateDiv.addEventListener('click', function (event) {
    if (event.target === this) {
        donateDiv.classList.remove('active');
        ibtndonate.className = "fa-regular fa-star";
    }
});


function ListDonate() {
    const donateList = [
        { name: "Nguyễn Văn A", amount: "20.000", time: "20:40-14/05/2023" },
        { name: "Nguyễn Văn B", amount: "50.000", time: "21:00-14/05/2023" },
        { name: "Nguyễn Văn C", amount: "100.000", time: "22:00-14/05/2023" },
    ];

    const listdonate = document.querySelector(".listdonate");

    function showNextDonor(index) {
        const donor = donateList[index];

        const item = document.createElement("div");
        item.classList.add("listdonate-item");
        item.innerHTML = `
    <h1><span>Cảm ơn </span>${donor.name}<span> đã ủng hộ.</span></h1>
    <h2>${donor.amount}đ</h2>
    <p>${donor.time}</p>`;

        listdonate.appendChild(item);

        // Wait for the fade in animation to finish
        setTimeout(() => {
            // Mark the item as active to show it
            item.classList.add("active");

            // Wait for a certain time
            setTimeout(() => {
                // Mark the item as hidden to fade it out
                item.classList.add("hide");

                // Wait for the fade out animation to finish
                setTimeout(() => {
                    // Remove the item from the DOM
                    item.remove();

                    // Show the next donor (if any)
                    if (index < donateList.length - 1) {
                        showNextDonor(index + 1);
                    } else {
                        isFirstTimeClick = false;
                    }
                }, 500); // wait for the fade out animation
            }, 3000); // wait for a certain time
        }, 500); // wait for the fade in animation
    }

    // Start showing the donors
    showNextDonor(0);

}

