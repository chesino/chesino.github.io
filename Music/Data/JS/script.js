const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = new Audio();
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const albumButtons = $$(".album-btn");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  songs: [],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  loadSongs: function (songs) {
    this.songs = songs;
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
        if (song.image === '/Music/IMG/Logo.png') {
            linkimg =  'https://hunqdxswbun.github.io/' +song.image
        } else {
            linkimg = song.image;
        }
      return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
          <div class="thumb" style="background-image: url('${linkimg}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option" >
            <a onclick="alert('Bạn không thể tải [${song.name}] vì đây là phiên bản trải nghiệm.')" >
            <i class="fa-regular fa-circle-down"></i>
            </a>
          </div>
        </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  handleEvents: function () {
    const _this = this;

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;
      }
    };

    progress.onchange = function (e) {
      liveOFF();
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
      
    };

    nextBtn.onclick = function () {
      liveOFF();
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    prevBtn.onclick = function () {
      liveOFF();
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
          audio.play();
          liveOFF();
        }
      }
    };

    albumButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const albumName = this.dataset.album;
        _this.changeAlbum(albumName);
      });
    });
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('https://hunqdxswbun.github.io/Music/IMG/Logo.png')`;
    audio.src = 'https://hunqdxswbun.github.io/'+this.currentSong.path;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentSong.name,
        artist: this.currentSong.singer,
        album: 'HunqDSwBun',
        artwork: [
          { src: 'https://hunqdxswbun.github.io/Music/IMG/Logo.png', sizes: '96x96', type: 'image/png' },
          { src: 'https://hunqdxswbun.github.io/Music/IMG/Logo.png', sizes: '128x128', type: 'image/png' },
          { src: 'https://hunqdxswbun.github.io/Music/IMG/Logo.png' , sizes: '192x192', type: 'image/png' },
          { src: 'https://hunqdxswbun.github.io/Music/IMG/Logo.png', sizes: '256x256', type: 'image/png' },
          { src: 'https://hunqdxswbun.github.io/Music/IMG/Logo.png', sizes: '384x384', type: 'image/png' },
          { src: 'https://hunqdxswbun.github.io/Music/IMG/Logo.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    };  

  },


  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  changeAlbum: function (albumName) {
    albumButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.album === albumName) {
        button.classList.add("active");
      }
    });

    fetch(`https://hunqdxswbun.github.io/Music/${albumName}.json`)
      .then((response) => response.json())
      .then((data) => {
        liveOFF();
        this.loadSongs(data);
        this.currentIndex = 0;
        this.loadCurrentSong();
        this.render();
        audio.play();
      })
      .catch((error) => {
        console.log("An error occurred while fetching the JSON file:", error);
      });
  },

  start: function () {
    const _this = this;

    this.config = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {};
    this.currentIndex = this.config.currentIndex || 0;
    this.isRandom = this.config.isRandom || false;
    this.isRepeat = this.config.isRepeat || false;

    albumButtons.forEach((button) => {
      const albumName = button.dataset.album;
      if (albumName === this.config.currentAlbum) {
        button.classList.add("active");
      }
    });

    fetch(`https://hunqdxswbun.github.io/Music/${this.config.currentAlbum || "HOT"}.json`)
      .then((response) => response.json())
      .then((data) => {
        _this.loadSongs(data);
        _this.loadConfig();
        _this.defineProperties();
        _this.handleEvents();
        _this.loadCurrentSong();
        _this.render();
      })
      .catch((error) => {
        console.log("An error occurred while fetching the JSON file:", error);
      });
  }
};

app.start();



function liveAUDIO() {
  var timeAudio = audio.duration;
  var hours = Math.floor(timeAudio / 3600);
  var minutes = Math.floor((timeAudio % 3600) / 60);

  var currentDate = new Date();
  // Lấy phút hiện tại
  var currentMinute = currentDate.getMinutes();
  // Lấy giây hiện tại
  var currentSecond = currentDate.getSeconds();

  var button = document.querySelector(".LiveBTN");
  var isActive = button.classList.contains("active");
  var LiveNoti = document.querySelector("#LiveNoti");

  if (hours >= 1 || minutes >= 59) {
    audio.currentTime = (currentMinute * 60) + currentSecond;
    LiveNoti.innerHTML = '<i class="fa-solid fa-circle"></i> Đang phát trực tiếp';
    if (isActive) {
      button.classList.remove("active");
      audio.currentTime = 0;
      LiveNoti.innerHTML = '<i class="fa-solid fa-circle"></i> Trực tiếp';
    } else {
      button.classList.add("active");
    }
  } else {
    LiveNoti.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Không thể phát trực tiếp' ;
  }

}


function liveOFF(){
  var button = document.querySelector(".LiveBTN");
  var LiveNoti = document.querySelector("#LiveNoti");

  button.classList.remove("active");
  LiveNoti.innerHTML = '<i class="fa-solid fa-circle"></i> Trực tiếp' ;
}


function handlePlayTrack() {
  playBtn.onclick();
}
function handlePauseTrack() {
  playBtn.onclick();
}

function handleBackward() {
  audio.currentTime -= 10
}
function handleForward() {
  audio.currentTime += 10
}

function handlePreTrack() {
  prevBtn.onclick();
}
function handleNextTrack() {
  nextBtn.onclick();
}
navigator.mediaSession.setActionHandler('play', handlePlayTrack);
navigator.mediaSession.setActionHandler('pause', handlePauseTrack);
navigator.mediaSession.setActionHandler('previoustrack', handlePreTrack);
navigator.mediaSession.setActionHandler('nexttrack', handleNextTrack);





