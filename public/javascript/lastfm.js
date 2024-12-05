// Last.fm Status checker logic
// by @lucmsilva651 w/ some improvements by @GiovaniFZ and @ihatenodejs
// 2024 Lucas Gabriel (lucmsilva) - BSD-3-Clause

console.log("reading from localStorage...");
const apiKey = sessionStorage.getItem("apiKey") || localStorage.getItem("apiKey");

const loadingIndicator = document.getElementById('loadingIndicator');
const lastViewedUser = localStorage.getItem("lastViewedUser") || "";
const lastUsers = document.querySelectorAll('.last-user');
const userLink = document.getElementById('userLink');
const userScrobbles = document.getElementById('userScrobbles');
const listeningTo = document.getElementById('listeningTo');
const downloadIcn = document.getElementById('downloadIcn');
const trackNames = document.querySelectorAll('.track-name');
const artistNames = document.querySelectorAll('.artist-name');
const albumNames = document.querySelectorAll('.album-name');
const trackMbid = document.getElementById('trackMbid');
const trackLink = document.getElementById('trackLink');
const artistLink = document.getElementById('artistLink');
const albumLink = document.getElementById('albumLink');
const artistMbid = document.getElementById('artistMbid');
const albumMbid = document.getElementById('albumMbid');
const albumArtDesc = document.getElementById('albumArtDesc');
const albumArt = document.getElementById('albumArt');

async function fetchPlayData() {
  let username = document.getElementById("userInput").value || lastViewedUser;
  if (!username) {
    console.error("No username provided");
    return;
  }
  localStorage.setItem("lastViewedUser", username);
  loadingIndicator.style.display = 'block';

  console.log("Making Last.fm API request...");
  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}&format=json`);
    const data = await response.json();
    console.log(data);

    loadingIndicator.style.display = 'none';

    if (data.error) {
      throw new Error(data.message);
    }

    initialSteps(data);

    const isPlaying = track["@attr"] && track["@attr"].nowplaying;

    if (isPlaying) {
      trackNames.forEach(trackName => {
        trackName.innerText = track.name;
      });
      lastUsers.forEach(lastUser => {
        lastUser.innerText = username;
        lastUser.href = `https://www.last.fm/user/${encodeURIComponent(username)}`;
        lastUser.classList.add("red-text");
      });
      if (track.artist["#text"]) {
        artistNames.forEach(artistName => {
          artistName.innerText = `${track.artist["#text"]}`;
        });
        artistLink.innerText = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"])}`;
        artistLink.classList.add("red-text");
        artistLink.href = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"])}`;
      } else {
        artistNames.forEach(artistName => {
          artistName.innerText = "Unknown (N/A)";
        });
      }
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
      if (track.url) {
        trackLink.innerText = `${track.url}`;
        trackLink.href = `${track.url}`;
        trackLink.classList.add("red-text");
      } else {
        trackLink.innerText = "Unknown (N/A)";
      }
      if (track.album["#text"]) {
        albumNames.forEach(albumName => {
          albumName.innerText = `${track.album["#text"]}`;
        });
        albumLink.innerText = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"])}/${encodeURIComponent(track.album["#text"])}`;
        albumLink.classList.add("red-text");
        albumLink.href = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"])}/${encodeURIComponent(track.album["#text"])}`;
      } else {
        albumNames.forEach(albumName => {
          albumName.innerText = "Unknown (N/A)";
        });
      }
      if (track.image[3]["#text"]) {
        const img = new Image();
        img.src = track.image[3]["#text"];
        img.onload = function () {
          albumArtDesc.innerText = `Download album art (${this.width + 'x' + this.height})`;
        }
        albumArt.src = track.image[3]["#text"];
        albumArtDesc.href = track.image[3]["#text"];
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
      trackNames.forEach(trackName => {
        trackName.innerText = "None";
      });
      artistNames.forEach(artistName => {
        artistName.innerText = "None";
      });
      albumNames.forEach(albumName => {
        albumName.innerText = "None";
      });
      trackLink.innerText = "None";
      albumLink.innerText = "None";
      artistLink.innerText = "None";
      listeningTo.innerText = "Nothing is playing";
      downloadIcn.style.display = "none";
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
  } catch (error) {
    console.error('Error fetching data:', error);
    loadingIndicator.style.display = 'none';
  }
}

async function fetchNowPlaying() {
  try {
    await fetchPlayData();
  } catch (error) {
    console.error('Error when searching data from last.fm:', error);
  }
}

async function clearStorage() {
  try {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}

async function saveToStorage() {
  try {
    const apiKey = document.getElementById("apiKeyInput").value;
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    sessionStorage.setItem("apiKey", apiKey);
    localStorage.removeItem("apiKey");
    
    location.reload();
  } catch (error) {
    console.error("Error saving API key:", error);
  }
}

function initialSteps(data) {
  document.getElementById('lastStatus').style.display = "";
  document.getElementById('lastFirstUi').style.display = "none";
  
  lastUsers.forEach(lastUser => {
    lastUser.innerText = document.getElementById("userInput").value;
    lastUser.href = `https://www.last.fm/user/${encodeURIComponent(document.getElementById("userInput").value)}`;
    lastUser.classList.add("red-text");
  });

  userLink.innerText = `https://www.last.fm/user/${encodeURIComponent(document.getElementById("userInput").value)}`;
  userLink.href = `https://www.last.fm/user/${encodeURIComponent(document.getElementById("userInput").value)}`;
  userLink.classList.add("red-text");
  
  if (data.recenttracks["@attr"] && data.recenttracks["@attr"].total) {
    userScrobbles.innerText = data.recenttracks["@attr"].total;
  } else {
    userScrobbles.innerText = "0";
  }
}

function resetToFirstState() {
  console.log("Checking if the API key is inserted");
  const hasKey = sessionStorage.getItem("apiKey") || localStorage.getItem("apiKey");

  document.getElementById('lastNoApi').style.display = "none";
  document.getElementById('lastStatus').style.display = "none";
  document.getElementById('lastFirstUi').style.display = "none";
  document.getElementById('userPicker').style.display = "none";

  if (hasKey) {
    document.getElementById('userPicker').style.display = "";
    if (lastViewedUser) {
      document.getElementById("userInput").value = lastViewedUser;
      fetchNowPlaying();
    }
  } else {
    document.getElementById('lastNoApi').style.display = "";
  }
}

resetToFirstState();