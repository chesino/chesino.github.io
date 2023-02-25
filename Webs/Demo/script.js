// Lấy phần tử DOM
var field = document.querySelector(".field");
var timeBar = document.querySelector(".time-bar");
var fruit = document.querySelector("#fruit");

// Đặt thời gian trồng cây và thu hoạch cây
var growTime = 10; // Thời gian trồng cây (giây)
var harvestTime = 5; // Thời gian thu hoạch cây (giây)

// Tạo đối tượng cây
var Plant = function(type, growTime, harvestTime) {
  this.type = type;
  this.growTime = growTime;
  this.harvestTime = harvestTime;
  this.status = "unplanted";
  this.timer = null;
  this.element = document.createElement("div");
  this.element.classList.add("plant");
  this.element.classList.add(type);
};

// Phương thức trồng cây
Plant.prototype.plant = function() {
  if (this.status !== "unplanted") return;
  this.status = "growing";
  var progress = document.createElement("div");
  progress.classList.add("progress");
  this.element.appendChild(progress);
  var self = this;
  this.timer = setInterval(function() {
    var timeLeft = self.growTime;
    var progressBar = self.element.querySelector(".progress");
    var interval = setInterval(function() {
      if (timeLeft <= 0) {
        clearInterval(interval);
        self.harvest();
        return;
      }
      progressBar.style.width = (100 - (timeLeft / self.growTime) * 100) + "%";
      timeLeft--;
    }, 1000);
  }, 10000);
  field.appendChild(this.element);
};

// Phương thức thu hoạch cây
Plant.prototype.harvest = function() {
  if (this.status !== "growing") return;
  this.status = "harvested";
  clearInterval(this.timer);
  var progressBar = this.element.querySelector(".progress");
  this.element.removeChild(progressBar);
  this.element.classList.add("harvested");
  var self = this;
  setTimeout(function() {
    field.removeChild(self.element);
  }, 5000);
};

// Tạo các cây
var appleTree = new Plant("apple", 10, 5);
var bananaTree = new Plant("banana", 8, 4);
var orangeTree = new Plant("orange", 12, 6);
var strawberryPlant = new Plant("strawberry", 5, 3);

//
