document.addEventListener('DOMContentLoaded', function () {
    const mic = document.getElementById('mic');
    const infoDiv = document.getElementById('info');

    // Check if the browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function () {
            mic.textContent = 'Listening...';
        };

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            infoDiv.textContent = 'You said: ' + transcript;
        };

        recognition.onend = function () {
            mic.textContent = 'Start Voice Search';
        };

        recognition.onerror = function (event) {
            infoDiv.textContent = 'Error occurred: ' + event.error;
            mic.textContent = 'Start Voice Search';
        };

        mic.addEventListener('click', function () {
            recognition.start();
        });
    } else {
        infoDiv.textContent = 'Sorry, your browser does not support the Web Speech API.';
    }
});


const videoCardContainer = document.querySelector('.video-container');

let api_key = "AIzaSyDA0BUeiKtCi-oiBIo8_KznGXcFFwxbZYU";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 50,
    regionCode: 'NG'
}))
.then(res => res.json())
.then(data => {
    // console.log(data);
    data.items.forEach(item => {
        getChannelIcon(item);
    })
})

.catch(err => console.log(err))

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    })
}

const makeVideoCard = (data) => {
    videoCardContainer.innerHTML += `
    <div class="video" onClick="location.href = 'https://youtube.com/watch?v=${data.id}'">
        <img class="thumbnail" src="${data.snippet.thumbnails.high.url}" alt="">
        <div class="content">
            <img class="channel-icon" src="${data.channelThumbnail}" alt="">
            <div id="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>
    `;
}

// search bar

const searchInput = document.querySelector('#search-bar');
const searchBtn = document.querySelector('#search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener('click', () => {
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value;
    }
})





