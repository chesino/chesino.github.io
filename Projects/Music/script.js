// Lấy dữ liệu từ JSON
var playlists = {
    "playlists": [
        {
            "title": "Playlist A",
            "songs": [
                {
                    "title": "Là Anh Remix",
                    "artist": "Youtube",
                    "source": "./Music/Remix/LaAnh.mp3"
                },
                {
                    "title": "Chờ Đợi Có Đáng Sợ Remix",
                    "artist": "Youtube",
                    "source": "./Music/Remix/ChoDoiCoDangSo.mp3"
                },
                {
                    "title": "Fiction Remix",
                    "artist": "Youtube",
                    "source": "./Music/Remix/Fiction.mp3"
                },
                {
                    "title": "Remix Tóp Tóp",
                    "artist": "Youtube",
                    "source": "./Music/Remix/RemixTiktok.mp3"
                }
                
            ]
        },
        {
            "title": "Playlist B",
            "songs": [
                {
                    "title": "Song 4",
                    "artist": "Artist D",
                    "source": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
                },
                {
                    "title": "Song 5",
                    "artist": "Artist E",
                    "source": "./Music/LaAnh.mp3"
                }
            ]
        }
    ]
};
var currentPlaylistIndex = 0;
var currentSongIndex = 0;

function createSongClickHandler(index) {
    return function() {
        // Cập nhật thông tin trình chơi nhạc
        var titleEl = document.querySelector(".title");
        var artistEl = document.querySelector(".artist");
        var audioEl = document.querySelector("audio");
        titleEl.innerHTML = playlists.playlists[currentPlaylistIndex].songs[index].title;
        artistEl.innerHTML = playlists.playlists[currentPlaylistIndex].songs[index].artist;
        audioEl.src = playlists.playlists[currentPlaylistIndex].songs[index].source;
        audioEl.play();
        currentSongIndex = index;
    };
}


// Hiển thị danh sách phát
var playlistEl = document.querySelector(".playlist");
for (var i = 0; i < playlists.playlists.length; i++) {
    var playlist = playlists.playlists[i];

    // Tạo tiêu đề playlist
    var titleEl = document.createElement("div");
    titleEl.innerHTML = playlist.title;
    playlistEl.appendChild(titleEl);

    // Tạo danh sách bài hát trong playlist
    var songsEl = document.createElement("ul");
    for (var j = 0; j < playlist.songs.length; j++) {
        var song = playlist.songs[j];

        // Tạo một phần tử li cho mỗi bài hát và thêm vào danh sách bài hát
        var songEl = document.createElement("li");
        songEl.innerHTML = song.title + " - " + song.artist;
        songsEl.appendChild(songEl);

        // Thêm sự kiện nhấp chuột vào li để chọn bài hát
        songEl.addEventListener("click", createSongClickHandler(i, j));
    }
    playlistEl.appendChild(songsEl);
}
var audioEl = document.querySelector("audio");
audioEl.addEventListener("ended", function() {
    var playlist = playlists.playlists[currentPlaylistIndex];
    if (currentSongIndex < playlist.songs.length - 1) {
        currentSongIndex++;
        var nextSong = playlist.songs[currentSongIndex];
        var titleEl = document.querySelector(".title");
        var artistEl = document.querySelector(".artist");
        titleEl.innerHTML = nextSong.title;
        artistEl.innerHTML = nextSong.artist;
        audioEl.src = nextSong.source;
        audioEl.play();
    } else {
        audioEl.pause();
    }
});
