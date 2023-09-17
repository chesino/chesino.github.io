
window.onscroll = function () { myFunction() };

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    document.body.classList.add("padding")
  } else {
    navbar.classList.remove("sticky");
    document.body.classList.remove("padding")

  }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Function to populate a table with JSON data
function populateTable(tableId, data) {

    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    for (const key in data) {
        const rowData = data[key];
        const row = document.createElement('tr');
        const status = rowData.Status;
        const statusClass = status === 0 ? 'Stop' : (status !== 0 ? 'Run' : '');

        if (key === "Motor" || key === "Inverter" ) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rowData.Description}</td>
                <td class="${statusClass}">${rowData.Status}</td>
                <td>${rowData.Voltage + 'v' || '-'}</td>
                <td>${rowData.Frequency + 'Hz' || '-'}</td>
                <td>${rowData.Current + 'A' || '-'}</td>
                <td>${rowData.RPM || '-'}</td>
            `;
            tbody.appendChild(row);
        } else {
            row.innerHTML = `
            <td>${rowData.Description}</td>
            <td class="${statusClass}">${rowData.Status}</td>
        `;
        }
        tbody.appendChild(row);
    }
}

// Function to fetch JSON data from a URL
function fetchJsonData(url, callback) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching JSON:', error));
}

// Call the fetchJsonData function to load data from the specified URL
fetchJsonData('./Database/Data.json', jsonData => {
    // Call the populateTable function for each table
    populateTable('A-table', jsonData.A);
    populateTable('B-table', jsonData.B);
    populateTable('C-table', jsonData.C);
    populateTable('D-table', jsonData.D);
    populateTable('E-table', jsonData.E);
    // Call populateTable for other tables as needed
});