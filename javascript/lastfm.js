// Last.fm Status checker logic
// by @lucmsilva651 w/ some improvements by @GiovaniFZ and @ihatenodejs
// 2024 Lucas Gabriel (lucmsilva) - BSD-3-Clause

console.log("reading from localStorage...");
const apiKey = localStorage.getItem("apiKey") || sessionStorage.getItem("apiKey");

const lastViewedUser = localStorage.getItem("lastViewedUser") || "";
const lastUsers = document.querySelectorAll('.last-user');
const lastNoApi = document.getElementById('lastNoApi');
const lastStatus = document.getElementById('lastStatus');
const lastFirstUi = document.getElementById('lastFirstUi');
const userInput = document.getElementById("userInput");
const apiKeyInput = document.getElementById("apiKeyInput");
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
  let username = userInput.value || lastViewedUser;

  if (!username) {
    console.error("No username provided");
    return;
  }

  localStorage.setItem("lastViewedUser", username);

  console.log("Making Last.fm API request...");

  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username).replace("%20", "+")}&api_key=${encodeURIComponent(apiKey).replace("%20", "+")}&format=json`);
    const data = await response.json();
    console.log(data);

    const recentTracks = data.recenttracks.track;

    if (!recentTracks || recentTracks.length === 0) {
      console.error('No recent tracks found.');
      return;
    }

    const track = recentTracks[0];
    console.log(track);

    if (data.error) {
      throw new Error(data.message);
    }

    initialSteps(data);

    const isPlaying = track["@attr"] && track["@attr"].nowplaying;

    if (isPlaying) {
      trackNames.forEach(trackName => {
        console.log(`Updating track name: ${track.name}`);
        trackName.innerText = track.name;
      });

      lastUsers.forEach(lastUser => {
        console.log(`Updating last user: ${username}`);
        lastUser.innerText = username;
        lastUser.href = `https://www.last.fm/user/${encodeURIComponent(username).replace("%20", "+")}`;
        lastUser.classList.add("red-text");
      });

      if (track.artist["#text"]) {
        artistNames.forEach(artistName => {
          console.log(`Updating artist name: ${track.artist["#text"]}`);
          artistName.innerText = track.artist["#text"];
        });

        artistLink.innerText = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"]).replace("%20", "+")}`;
        artistLink.classList.add("red-text");
        artistLink.href = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"]).replace("%20", "+")}`;
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
          console.log(`Updating album name: ${track.album["#text"]}`);
          albumName.innerText = track.album["#text"];
        });

        albumLink.innerText = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"]).replace("%20", "+")}/${encodeURIComponent(track.album["#text"]).replace("%20", "+")}`;
        albumLink.classList.add("red-text");
        albumLink.href = `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"]).replace("%20", "+")}/${encodeURIComponent(track.album["#text"]).replace("%20", "+")}`;
      } else {
        albumNames.forEach(albumName => {
          albumName.innerText = "Unknown (N/A)";
        });
      }

      if (track.image && track.image[3] && track.image[3]["#text"]) {
        let imageUrl = track.image[3]["#text"];

        if (track.mbid) {
          try {
            const response = await fetch(`https://coverartarchive.org/release/${track.mbid}`);
            if (response.ok) {
              const coverArtData = await response.json();
              const highResImage = coverArtData.images[0]?.thumbnails?.['1200'] || coverArtData.images[0]?.image;
              if (highResImage) {
                imageUrl = highResImage;
              }
            }
          } catch (e) {
            console.warn("error fetching album art from mb, using fallback:", e);
          }
        }

        const img = new Image();
        img.src = imageUrl;
        img.onload = function () {
          albumArtDesc.innerText = `Download album art (${this.width}x${this.height})`;
        };

        albumArt.src = imageUrl;
        albumArtDesc.href = imageUrl;
        albumArtDesc.download = "AlbumArt.jpg";
      } else {
        albumArtDesc.innerText = "No album art available";
        albumArtDesc.removeAttribute("href");
        albumArt.src = "https://lastfm.freetls.fastly.net/i/u/4128a6eb29f94943c9d206c08e625904.jpg"; // Placeholder padrão.
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
  }
}

async function fetchNowPlaying() {
  try {
    lastFirstUi.style.display = "none";
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
    const apiKey = apiKeyInput.value;
    if (!apiKey) {
      throw new Error("API key is required");
    }

    localStorage.setItem("apiKey", apiKey);
    sessionStorage.removeItem("apiKey");

    location.reload();
  } catch (error) {
    console.error("Error saving API key:", error);
  }
}

function initialSteps(data) {
  lastStatus.style.display = "block";

  lastUsers.forEach(lastUser => {
    lastUser.innerText = userInput.value;
    lastUser.href = `https://www.last.fm/user/${encodeURIComponent(userInput.value).replace("%20", "+")}`;
    lastUser.classList.add("red-text");
  });

  userLink.innerText = `https://www.last.fm/user/${encodeURIComponent(userInput.value).replace("%20", "+")}`;
  userLink.href = `https://www.last.fm/user/${encodeURIComponent(userInput.value).replace("%20", "+")}`;
  userLink.classList.add("red-text");

  if (data.recenttracks["@attr"] && data.recenttracks["@attr"].total) {
    userScrobbles.innerText = data.recenttracks["@attr"].total;
  } else {
    userScrobbles.innerText = "0";
  }
}

function resetToFirstState() {
  console.log("Checking if the API key is inserted");

  lastNoApi.style.display = "none";
  lastStatus.style.display = "none";
  lastFirstUi.style.display = "none";

  if (apiKey) {
    console.log("API key found");
    lastFirstUi.style.display = "block";

    if (lastViewedUser) {
      userInput.value = lastViewedUser;
    }
  } else {
    lastNoApi.style.display = "block";
  }
}

resetToFirstState();