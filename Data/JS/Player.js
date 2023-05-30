// Playlist array
var files = [
    "/Data/Music/Making_My_Way_Remix.mp3",
    "/Data/Music/8Letters.mp3",
    "/Data/Music/IllWait.mp3",
    "/Data/Music/DuskTillDawn.mp3",
    "/Data/Music/InMyMind.mp3",
    "/Data/Music/Nightlight.mp3",
    "/Data/Music/Downtown.mp3",
    "/Data/Music/LoveMeNow.mp3",
    "/Data/Music/Rain.mp3",
    "/Data/Music/AllMyDays.mp3",
    "/Data/Music/Lullaby.mp3",
    "/Data/Music/StereoHearts.mp3",
    "/Data/Music/IsItJustMe.mp3",
    "/Data/Music/RhythmOfTheNight.mp3",
    "/Data/Music/LIFE.mp3",
    "/Data/Music/SadMusic1.mp3",
    "/Data/Music/SadnessandSorrow.mp3"
  ];
  
  // Current index of the files array
  var i = 0;
  
  var btnBack = document.getElementById("btnBack");
  var Control = document.getElementById("Control");
  var NameSong = document.getElementById("NameSong");
  var MusicBG = document.getElementById("musicBG");
  
  
  // Get the audio element
  var music_player = document.querySelector("#music_list audio");
  // function for moving to next audio file
  CheckMusic();
  function CheckMusic() {
    var cvName = files[i];
    var NameSong2 = cvName.replace('/Data/Music/', '');
    var NameSong3 = NameSong2.replace('.mp3', ' ');
    NameSong.innerText = NameSong3;
  
    if (i == 0) {
      btnBack.style.display = "none";
      Control.style.gridTemplateColumns = "40px 40px 40px auto";
    } else {
      btnBack.style.display = "flex";
      Control.style.gridTemplateColumns = "40px 40px 40px 40px auto";
    }
  }
  
  function MuteMusic() {
    var CheckMute = document.getElementById("musicBG");
    var Volume = document.getElementById("Volume");
  
    
  
    if (CheckMute.muted == true) {
      disableMute();
      Volume.className = "fa-solid fa-volume-high";
    } else {
      enableMute();
      Volume.className = "fa-solid fa-volume-xmark";
    }
  }
  
  
  function enableMute() { 
    MusicBG.muted = true;
  } 
  
  function disableMute() { 
    MusicBG.muted = false;
  }
  
  
  
  
  
  function WhatNext(){
    var cvNameb = files[i+1];
    var NameSong2b = cvNameb.replace('/Data/Music/', '');
    var NameSong3b = NameSong2b.replace('.mp3', ' Là Bài Hát Tiếp Theo');
    alert(NameSong3b);
  }
  
  
  function PreFn() {
  
    Pre();
    PlayMusicBG();
    setTimeout(PlayMusicBG, 500);
    CheckMusic();
  }
  
  function NextFn() {
    next();
    PlayMusicBG();
    setTimeout(PlayMusicBG, 500);
    CheckMusic();
  }
  
  function Pre() {
    i--;
    music_player.src = files[i];
  }
  
  
  function next() {
    // Check for last audio file in the playlist
    if (i === files.length - 1) {
      i = 0;
    } else {
      i++;
    }
    music_player.src = files[i];
  }
  
  if (music_player === null) {
    throw "Playlist Player does not exists ...";
  } else {
    // Start the player
    music_player.src = files[i];
  
    // Listen for the music ended event, to play the next audio file
    music_player.addEventListener('ended', next, false)
  }
  
  var MusicBG = document.getElementById("musicBG");
  var iMusicBG = document.getElementById("btnPlay");
  
  function PlayMusicBG() {
    if (iMusicBG.className == 'fa-solid fa-play') {
      iMusicBG.className = "fa-solid fa-pause";
      MusicBG.play();
    } else {
      MusicBG.pause();
      iMusicBG.className = 'fa-solid fa-play';
    }
  
  }
  
  // Youtube 
  var OpenYoutube = document.getElementById('OpenYoutube');
  var inYoutube = document.getElementById('inYoutube');
  var Youtube = document.getElementById('Youtube');
  var IDVideo = document.getElementById('IDVideo');
  var iCopyVideo = document.getElementById('iCopyVideo');
  var iSearch = document.getElementById('iSearch');
  
  
  function SetYoutube() {
  
    MusicBG.pause();
    iMusicBG.className = 'fa-solid fa-play';
  
    var CvYoutube = inYoutube.value;
    var CvLink = CvYoutube;
    const string = CvLink;
    const substring = "https://youtu.be/";
    var CheckYoutube = string.includes(substring);
  
    
    if (CheckYoutube == true) {
      var ToYoutube = CvLink.replace('https://youtu.be/', '');
      Youtube.src = 'https://www.youtube.com/embed/' + ToYoutube;
      RunYoutube();
      IDVideo.innerText = ToYoutube;
    } else {
      inYoutube.value = 'Sai đường dẫn! Vui lòng thử lại';
      StopYoutube();
    }
  
  }
  
  function RunYoutube() {
    OpenYoutube.style.display = 'block';
    Youtube.style.display = 'block';
    iSearch.className = "fa-solid fa-repeat";
  }
  function StopYoutube() {
    OpenYoutube.style.display = 'none';
    Youtube.style.display = 'none';
    iSearch.className = "fa-solid fa-magnifying-glass";
  }
  
  function CopyIDVideo() {
    navigator.clipboard.writeText(IDVideo.textContent);
    iCopyVideo.className = "fa-regular fa-circle-check";
    setTimeout(CopyDone, 1500)
  }
  function CopyDone() {
    iCopyVideo.className = "fa-solid fa-copy";
  }