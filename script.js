const audio = document.getElementById("audio");
const playPauseButton = document.getElementById("play-pause");
const volumeIcon = document.getElementById("volume-icon");
const volumeSlider = document.getElementById("volume");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.querySelector(".progress-container");
const timeBefore = document.querySelector(".time-before");
const timeAfter = document.querySelector(".time-after");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const categories=document.getElementById("categories");
const musicTitle= document.getElementById("music-title");
const melodyMix= document.getElementById("melody-mix");
const hipHop= document.getElementById("hip-hop");
const classical= document.getElementById("classical");
const moodymix= document.getElementById("moody-mix");

const songName = document.querySelector(".song-name");

let isPlaying = false;
var currentVolume=volumeSlider.value;
let currentTrack = 0;

let metadataLoaded = false;

playPauseButton.addEventListener("click", togglePlayPause);
volumeIcon.addEventListener("click", toggleVolume);
volumeSlider.addEventListener("input", setVolume);
audio.addEventListener("timeupdate", updateProgressBar);
progressBar.addEventListener("click", seek);
progressContainer.addEventListener("click", seek);
prevButton.addEventListener("click", prevTrack);
nextButton.addEventListener("click", nextTrack);

window.onload=function(){
    loadTrack();
}

melodyMix.addEventListener("click",()=>{
    musicTitle.innerHTML="MelodyMix";
    SetActiveTab(melodyMix);
    currentPlayList=melodylist.slice();
    loadTrack();
});
hipHop.addEventListener("click",()=>{
    musicTitle.innerHTML="Hip-Hop";
    SetActiveTab(hipHop);
    currentPlayList=hiphoplist.slice();
    loadTrack();
});
classical.addEventListener("click",()=>{
    musicTitle.innerHTML="Classical";
    SetActiveTab(classical);
    currentPlayList=classicallist.slice();
    loadTrack();
});
moodymix.addEventListener("click",()=>{
    musicTitle.innerHTML="MoodyMix";
    SetActiveTab(moodymix);
    currentPlayList=moodylist.slice();
    loadTrack();
});


function loadTrack() {
    if(currentTrack>(currentPlayList.length-1)){
        currentTrack=0;
    }
    audio.src = currentPlayList[currentTrack];
    audio.load();
    timeAfter.textContent = "0:00";
    updateSongName();
    playTrack();
}

function updateSongName() {
    // Get the filename without the extension
    const filename = currentPlayList[currentTrack].split(".")[0];
    songName.innerHTML = filename;
}

audio.addEventListener("loadedmetadata", () => {
        metadataLoaded=true;
        const duration = audio.duration;
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        timeAfter.textContent = `${durationMinutes}:${durationSeconds < 10 ? "0" : ""}${durationSeconds}`;
});


function playTrack() {
    audio.play().then(() => {
        playPauseButton.classList.remove("fa-circle-play");
        playPauseButton.classList.add("fa-circle-pause");
        isPlaying = true;
    }).catch(error => {
        console.error("Play error:", error);
    });
}

function pauseTrack() {
    audio.pause();
    playPauseButton.classList.remove("fa-circle-pause");
    playPauseButton.classList.add("fa-circle-play");
    isPlaying = false;
}

function togglePlayPause() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % currentPlayList.length;
    loadTrack();
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + currentPlayList.length) % currentPlayList.length;
    loadTrack();
}


function setVolume() {
    audio.volume = volumeSlider.value;
    const isActive= volumeIcon.classList.contains("fa-volume-high");
    
    if(audio.volume==0 && isActive){
        volumeIcon.classList.remove("fa-volume-high");
        volumeIcon.classList.add("fa-volume-xmark");
    }
     else if(currentVolume!=audio.volume){
        volumeIcon.classList.remove("fa-volume-xmark");
        volumeIcon.classList.add("fa-volume-high"); 
     }
    currentVolume=audio.volume;
}
function toggleVolume() {
    if(volumeSlider.value!=0){
        volumeSlider.value=0;
    } else{
        volumeSlider.value=currentVolume;
    }
    const isActive= volumeIcon.classList.contains("fa-volume-high");
    if(isActive && volumeSlider.value==0){
        volumeIcon.classList.remove("fa-volume-high");
        volumeIcon.classList.add("fa-volume-xmark");
    } else{
        volumeIcon.classList.remove("fa-volume-xmark");
        volumeIcon.classList.add("fa-volume-high");
    }
    audio.volume = volumeSlider.value;
}



function updateProgressBar() {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    if (metadataLoaded) { // Check the flag
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        timeBefore.textContent = `${currentMinutes}:${currentSeconds < 10 ? "0" : ""}${currentSeconds}`;
    } else {
        timeBefore.textContent = "00:00"; // Set to "00:00" if metadata hasn't loaded yet
    }

    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
}


function seek(event) {
    const progressBarRect = progressContainer.getBoundingClientRect();
    const clickX = event.clientX - progressBarRect.left;
    const progressBarWidth = progressBarRect.width;
    const seekTime = (clickX / progressBarWidth) * audio.duration;
    audio.currentTime = seekTime;
}


audio.addEventListener("ended", () => {
    playPauseButton.classList.remove("fa-circle-pause");
    playPauseButton.classList.add("fa-circle-play");
    isPlaying = false;
    currentTrack = (currentTrack + 1) % currentPlayList.length;
    loadTrack();
});


// Define an array of audio file URLs
const melodylist = [
    "Undipova.mp3",
    "Jamurathiri.mp3",
    "Zindabad.mp3",
    // Add more audio files here
];
const moodylist=[
    "Selavanuko.mp3",
    "Choododhe.mp3",
    "Nammaka Tappani.mp3",
];

const hiphoplist=[
    "Private Party.mp3",
    "Swing Zara.mp3",
];
const classicallist=[
    "Oke Oka Lokam.mp3",
    "Poolane.mp3",
];
var currentPlayList=melodylist.slice();



 function SetActiveTab(tab) {

        // Remove "active" class from all tabs
        const allTabs = document.getElementsByClassName("category")[0].children;
        for (let i = 0; i < allTabs.length; i++) {
            allTabs[i].classList.remove("active");
        }

        // Add "active" class to the clicked tab
        tab.classList.add("active");
}


const toggleButton = document.getElementById('toggle-mode');
const body = document.body;

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const is=toggleButton.classList.contains("fa-toggle-off");
    if(is){
        toggleButton.classList.remove("fa-toggle-off");
        toggleButton.classList.add("fa-toggle-on");
    }else{
        toggleButton.classList.remove("fa-toggle-on");
        toggleButton.classList.add("fa-toggle-off");
    }
});
