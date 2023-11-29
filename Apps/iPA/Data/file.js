window.onload = function () {
  renderAppList();
};

const searchInputElement = document.getElementById("search-input");
const searchButtonElement = document.getElementById("search-button");
const radioButtons = document.querySelectorAll('input[name="category"]');
const appListElement = document.querySelector(".app-list");

searchButtonElement.addEventListener("click", renderAppList);
searchInputElement.addEventListener("input", renderAppList);

radioButtons.forEach(function (radio) {
  radio.addEventListener("change", renderAppList);
});

function renderAppList() {
  appListElement.innerHTML = "";

  const searchTerm = searchInputElement.value.toLowerCase();
  const typeFilter = getSelectedRadioValue("category");

  const filteredApps = apps.filter((app) => {
    return (
      app.name.toLowerCase().includes(searchTerm) &&
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
      let osIcon = '<i class="fab fa-apple"></i> iOS';

      let type;
      if (app.type === "Tweak") {
        type = '<i class="fa-solid fa-cube"></i> Tweak';
      } else if (app.type === "iPA") {
        type = '<i class="fa-brands fa-app-store-ios"></i> iPA';
      } else {
        type = '<i class="fa-solid fa-question"></i>';
      }

      let version;
      if (app.version === undefined) {
        version = '<i class="fa-solid fa-question"></i>';
      } else {
        version = '<i class="fa-solid fa-wrench"></i> ' + app.version;
      }

      let size = app.size === undefined ? 'N/A' : app.size;

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
          <div class="Category">${version}</div>
          <div class="Storage"><i class="fa-solid fa-database"></i> ${size}</div>
        </div>
      `;

      appListElement.appendChild(appElement);
    });
  }
}

function getSelectedRadioValue(name) {
  const selectedRadio = document.querySelector('input[name="' + name + '"]:checked');
  return selectedRadio ? selectedRadio.value : "";
}


var isContentHidden = false;

function toggleContent() {
  var Container = document.querySelector('.Container');
  isContentHidden = !isContentHidden;

  if (isContentHidden) {
    Container.classList.add('Hidden');
  } else {
    Container.classList.remove('Hidden');
  }
}



var isVideoHidden = false;

function toggleVideo() {
  var VideoBG = document.querySelector('.VideoBG');
  isVideoHidden = !isVideoHidden;

  if (isVideoHidden) {
    VideoBG.classList.add('Hidden');
  } else {
    VideoBG.classList.remove('Hidden');
  }
}





function updateDateTime() {
  var TimeNow = new Date();
  var daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  var dayIndex = TimeNow.getDay();
  var dayOfMonth = TimeNow.getDate();
  var monthIndex = TimeNow.getMonth() + 1;

  var result = daysOfWeek[dayIndex] + ', ' + dayOfMonth + ' Tháng ' + monthIndex;
  var divTimeNow = document.getElementById("TimeNow");
  divTimeNow.innerText = result;
}

updateDateTime();
setInterval(updateDateTime, 1000);
