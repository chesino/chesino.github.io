window.onload = function () {
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
      appElement.classList.add("App");
      let osIcon = '';
      if (app.os === "Android") {
        osIcon = '<i class="fab fa-android"></i> Android';
      } else if (app.os === "iOS") {
        osIcon = '<i class="fab fa-apple"></i> iOS';
      } else if (app.os === "Windows") {
        osIcon = '<i class="fab fa-windows"></i> Windows';
      } else {
        osIcon = '<i class="fa fa-question-circle"></i> Khác';
      }

      if (app.type === "Game") {
        type = '<i class="fa-solid fa-gamepad"></i> Trò chơi';
      } else if (app.type === "App") {
        type = '<i class="fa-solid fa-cube"></i> Ứng dụng';
      } else if (app.type === "Trick") {
        type = '<i class="fa-solid fa-wand-magic-sparkles"></i> Thủ thuật';
      } else {
        type = '<i class="fa-solid fa-question"></i>';
      }

      
      if (app.time == undefined) {
        time = '<i class="fa-solid fa-question"></i>';
      }else {
        time = '<i class="fa-regular fa-calendar"></i> ' + app.time 
      }

      if (app.size == undefined) {
        size = 'N/A';
      }else {
        size = app.size
      }

      
      appElement.innerHTML = `
      <div class="InfoApp">
        <div class="Info">
          <div class="Icon">
            <img src="${app.logo}" alt="${app.name}">
          </div>
          <div class="Name">
            <h1>${app.name}</h1>
            <p>${app.description}</p>
          </div>
      </div>
      <div class="Download">
        <a href="${app.downloadLink}">
          <button>
            <i class="fa-solid fa-download"></i>
          </button>
        </a>
      </div>
    </div>
    <div class="More">
      <div class="OStype">${osIcon}</div>
      <div class="Type">${type}</div>
      <div class="Category">${time}</div>
      <div class="Storage"><i class="fa-solid fa-database"></i> ${size}</div>
      
    </div>
`;
      // ${app.downloadLink}
      appListElement.appendChild(appElement);
    });
  }
}

