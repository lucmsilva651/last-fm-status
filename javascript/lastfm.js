// Last.fm Status checker logic
// by @lucmsilva651 w/ some improvements by @GiovaniFZ
// 2024 Lucas Gabriel (lucmsilva) - BSD-3-Clause

console.log("reading from localStorage...");
const apiKey = localStorage.getItem("apiKey");

const statsFor = document.getElementById('statsFor');
const artistName = document.getElementById('artistName');
const albumName = document.getElementById('albumName');
const trackTitle = document.getElementById('trackTitle');
const trackMbid = document.getElementById('trackMbid');
const trackLink = document.getElementById('trackLink');
const artistMbid = document.getElementById('artistMbid');
const albumMbid = document.getElementById('albumMbid');
const albumArtDesc = document.getElementById('albumArtDesc');
const albumArt = document.getElementById('albumArt');

async function fetchPlayData() {
  const username = document.getElementById("userInput").value;
  console.log("making last.fm api request...");
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`);
  const data = await response.json();
  const track = data.recenttracks.track[0];
  console.log("track object:", track);
  showStats();

  const isPlaying = track["@attr"] && track["@attr"].nowplaying;

  if (isPlaying) {
    trackTitle.innerText = track.name;
    statsFor.innerText = username;
    statsFor.href = `https://last.fm/user/${username}`;
    statsFor.classList.add("red-text");
    track.artist["#text"] ? artistName.innerText = `${track.artist["#text"]}` : artistName.innerText = "Unknown (N/A)";
    if (track.mbid) {
      trackMbid.innerText = `${track.mbid}`;
      trackMbid.href = `https://musicbrainz.org/recording/${track.mbid}`;
      trackMbid.classList.add("red-text");
    } else {
      trackMbid.innerText = "Unknown (N/A)";
    }
    if (track.url) {
      trackLink.innerText = `${track.url}`;
      trackLink.href = `${track.url}`;
      trackLink.classList.add("red-text");
    } else {
      trackLink.innerText = "Unknown (N/A)";
    }
    track.album["#text"] ? albumName.innerText = `${track.album["#text"]}` : albumName.innerText = "Unknown (N/A)";
    if (track.image[3]["#text"]) {
      const img = new Image();
      img.src = track.image[3]["#text"];
      img.onload = function () {
        albumArtDesc.innerText = `Download album art (${this.width + 'x' + this.height})`;
      }
      albumArt.src = track.image[3]["#text"];
      albumArtDesc.href = track.image[3]["#text"];
      albumArtDesc.classList.add("red-text");
      albumArtDesc.download = "AlbumArt.jpg";
    } else {
      albumArtDesc.innerText = "No album art available";
      albumArtDesc.removeAttribute("href");
      albumArt.src = "https://lastfm.freetls.fastly.net/i/u/4128a6eb29f94943c9d206c08e625904.jpg";
    }
    if (track.album.mbid) {
      albumMbid.innerText = `${track.album.mbid}`;
      albumMbid.href = `https://musicbrainz.org/release/${track.album.mbid}`;
      albumMbid.classList.add("red-text");
    } else {
      albumMbid.innerText = "Unknown (N/A)";
    }
    if (track.artist.mbid) {
      artistMbid.innerText = `${track.artist.mbid}`;
      artistMbid.href = `https://musicbrainz.org/artist/${track.artist.mbid}`;
      artistMbid.classList.add("red-text");
    } else {
      artistMbid.innerText = "Unknown (N/A)";
    }
  } else {
    trackTitle.innerText = "None";
    artistName.innerText = "None";
    albumName.innerText = "None";
    trackLink.innerText = "None";
    trackMbid.innerText = "None";
    artistMbid.innerText = "None";
    albumMbid.innerText = "None";
    albumArtDesc.innerText = "Nothing is playing";
    albumArtDesc.removeAttribute("href");
    trackLink.removeAttribute("href");
    trackMbid.removeAttribute("href");
    albumMbid.removeAttribute("href");
    artistMbid.removeAttribute("href");
    albumArt.src = "https://lastfm.freetls.fastly.net/i/u/4128a6eb29f94943c9d206c08e625904.jpg";
  }
}

async function fetchNowPlaying() {
  try {
    await fetchPlayData();
  } catch (error) {
    console.error('error when searching data from last.fm:', error);
  }
}

async function clearStorage() {
  localStorage.clear();
  location.reload();
}

async function saveToStorage() {
  localStorage.setItem("apiKey", document.getElementById("apiKeyInput").value);
  location.reload();
}

function showStats() {
  document.getElementById('lastStatus').style.display = "";
  document.getElementById('lastFirstUi').style.display = "none";
}

async function resetToFirstState() {
  console.log("checking if the api key is inserted");
  if (apiKey || apiKey != null) {
    document.getElementById('lastNoApi').style.display = "none";
    document.getElementById('lastStatus').style.display = "none";
    document.getElementById('lastFirstUi').style.display = "";
  } else {
    document.getElementById('lastStatus').style.display = "none";
    document.getElementById('lastFirstUi').style.display = "none";
    document.getElementById('lastNoApi').style.display = "";
  }
}

resetToFirstState();