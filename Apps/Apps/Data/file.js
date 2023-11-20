window.onload = function()
{
    renderAppList();  
};

const searchInputElement = document.getElementById("search-input");
const searchButtonElement = document.getElementById("search-button");
const osSelectElement = document.getElementById("os-select");
const typeSelectElement = document.getElementById("type-select");
const appListElement = document.querySelector(".app-list");

searchButtonElement.addEventListener("click", renderAppList);
searchInputElement.addEventListener("input", renderAppList);
osSelectElement.addEventListener("change", renderAppList);
typeSelectElement.addEventListener("change", renderAppList);



  function renderAppList() {
    appListElement.innerHTML = "";
    
    const searchTerm = searchInputElement.value.toLowerCase();
    const osFilter = osSelectElement.value;
    const typeFilter = typeSelectElement.value || "";
  
    const filteredApps = apps.filter((app) => {
      return (
        app.name.toLowerCase().includes(searchTerm) &&
        (osFilter === "" || app.os === osFilter) &&
        (typeFilter === "" || app.type === typeFilter)
      );
    });
  
    if (filteredApps.length === 0) {
      const noDataElement = document.createElement("div");
      noDataElement.classList.add("no-data");
      noDataElement.innerText = "Không có dữ liệu";
      appListElement.appendChild(noDataElement);
    } else {
        filteredApps.forEach((app) => {
            const appElement = document.createElement("div");
            appElement.classList.add("app");
            let osIcon = '';
            if (app.os === "Android") {
              osIcon = '<i class="fab fa-android"></i>';
            } else if (app.os === "iOS") {
              osIcon = '<i class="fab fa-apple"></i>';
            } else if (app.os === "Windows") {
              osIcon = '<i class="fab fa-windows"></i>';
            } else {
              osIcon = '<i class="fa fa-question-circle"></i>';
            }
            appElement.innerHTML = `
              <img src="${app.logo}" alt="${app.name} logo">
              <div class="info">
                <div class="infoApp">
                    <h2>${app.name}</h2>
                    <p>${osIcon}</p>
                </div>
                <p>${app.description}</p>
              </div>
              <div class="download">
                <a href="${app.downloadLink}">
                  <button>Tải về</button>
                </a>
              </div>
            `;
            // ${app.downloadLink}
            appListElement.appendChild(appElement);
          });
    }
  }
  
  