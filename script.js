
let songs;
let currentSong = new Audio();
let currFolder;
async function getSongs(album) {
    currFolder = album;
    let a = await fetch(`http://127.0.0.1:3000/${album}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            let songName = element.href.split(`${album}`)[1].split(".mp3")[0]
            songs.push(decodeURIComponent(songName))
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
 <img class="invert" width="14" src="/logos/music.png" alt="music logo">
 <div class="info">
 <div>${song.replaceAll("%20", " ")}</div>
 </div>
 <div class="playnow">
 <span>Play Now</span>
 <img class="invert" width="14" src="/logos/play.png" alt="">
 </div>
 </li>`
    }

    //attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    return songs

}

const playMusic = (track, pause = false) => {
    if (!pause) {
        let audio = new Audio(`${currFolder}` + track + ".mp3")
        currentSong.src = `${currFolder}` + track + ".mp3"
        currentSong.play()
        document.querySelector(".songinfo").innerHTML = track
        document.querySelector(".songtime").innerHTML = "00:00/00:00"
    }

}

async function main() {

    //this will get the list of songs
    await getSongs(`songs/arijit/`)
    playMusic(songs[0])
    //play the first song
    var audio = new Audio(`${currFolder}` + songs[0]);
    audio.play();

    play.addEventListener("click", element => {
        if (currentSong.paused == true) {
            currentSong.play()
            play.src = "./logos/pause.png"
        } else {
            currentSong.pause()
            play.src = "./logos/play-button.png"
        }
    })

    previous.addEventListener("click", element => {

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", "")))
        if (index == 0) {
            playMusic(songs[songs.length - 1])
        }
        else {
            playMusic(songs[index - 1])
        }

    })
    next.addEventListener("click", element => {

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop().replace(".mp3", "")))
        if (index == songs.length - 1) {
            playMusic(songs[0])
        } else {
            playMusic(songs[index + 1])
        }
    })

    //time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToTimeFormat(currentSong.currentTime)}/${convertSecondsToTimeFormat(currentSong.duration)}`
        document.querySelector(".seek-circle").style.left = `${100 * (currentSong.currentTime / currentSong.duration)}%`
        document.querySelector(".progress").style.width = `${100 * (currentSong.currentTime / currentSong.duration)}%`;
    })

    function convertSecondsToTimeFormat(seconds) {
        // Ensure seconds is an integer (removes any decimal)
        seconds = Math.floor(seconds);

        // Calculate minutes and seconds
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Pad seconds with leading zero if less than 10
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

        // Return the formatted time
        return `${minutes}:${formattedSeconds}`;
    }

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (Math.floor((e.offsetX / e.target.getBoundingClientRect().width) * 100))
        document.querySelector(".seek-circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;

    })

    document.querySelector(".hamburger").addEventListener("click", e => {
        if ((document.querySelector(".left").style.left) !== "0%") {
            document.querySelector(".left").style.left = "0%";
            document.querySelector(".hamburger").src = "./logos/close.png"
        }
        else {
            document.querySelector(".left").style.left = "-100%";
            document.querySelector(".hamburger").src = "./logos/more.png"
        }
    })
    // Add this in your main() function or a separate setup function
    const volumeSlider = document.querySelector(".volume-slider");

    // Set initial volume (50%)
    currentSong.volume = 0.5;

    // Update volume on slider input
    volumeSlider.addEventListener("input", (e) => {
        const volumeValue = e.target.value / 100; // Convert slider value (0-100) to 0-1
        currentSong.volume = volumeValue;
        // console.log("Volume set to:", volumeValue);
    });

    //load the playlist whenever the .pics are clicked
    Array.from(document.getElementsByClassName("pics")).forEach(e => {
        if (e.undefined == true) {
            return
        }
        else {
            e.addEventListener("click", async item => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`)
                playMusic(songs[0])
            })
        }
    })
}
main();
