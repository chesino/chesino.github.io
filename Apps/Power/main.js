// script.js
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const videos = ['/Video/Video1.mp4', 'video2.mp4', 'video3.mp4'];
let currentVideoIndex = 0;

playPauseBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.textContent = 'Dừng';
    } else {
        videoPlayer.pause();
        playPauseBtn.textContent = 'Phát';
    }
});

prevBtn.addEventListener('click', () => {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        loadVideo(currentVideoIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentVideoIndex < videos.length - 1) {
        currentVideoIndex++;
        loadVideo(currentVideoIndex);
    }
});

videoPlayer.addEventListener('ended', () => {
    if (currentVideoIndex < videos.length - 1) {
        currentVideoIndex++;
        loadVideo(currentVideoIndex);
    }
});

function loadVideo(index) {
    videoPlayer.src = videos[index];
    videoPlayer.play();
    playPauseBtn.textContent = 'Dừng';
}

// Load the first video initially
loadVideo(currentVideoIndex);
