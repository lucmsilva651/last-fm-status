const apiKey = localStorage.getItem("apiKey");
console.log("reading from localStorage...");

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


async function fetchPlayData() {
  const username = document.getElementById("userInput").value;
  document.getElementById('lastStatus').style.display = "";
  document.getElementById('lastFirstUi').style.display = "none";
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`);
  const data = await response.json();
  const track = data.recenttracks.track[0];
  console.log("making last.fm api request...");
  console.log("track object:", track);
  const isPlaying = track["@attr"] && track["@attr"].nowplaying;

  const artistName = document.getElementById('artistName')
  const albumName = document.getElementById('albumName')
  const trackTitle = document.getElementById('trackTitle');
  const trackMbid = document.getElementById('trackMbid');
  const trackLink = document.getElementById('trackLink');
  const artistMbid = document.getElementById('artistMbid');
  const albumMbid = document.getElementById('albumMbid');
  const albumArtDesc = document.getElementById('albumArtDesc');
  const albumArt = document.getElementById('albumArt');

  if (isPlaying) {
    trackTitle.innerText = track.name;
    track.artist["#text"] ? artistName.innerText = `${track.artist["#text"]}` : artistName.innerText = "Unknown (N/A)";
    if (track.mbid) {
      trackMbid.innerText = `${track.mbid}`;
      trackMbid.href = `https://musicbrainz.org/recording/${track.mbid}`;
    } else {
      trackMbid.innerText = "Unknown (N/A)";
    }
    if (track.url) {
      trackLink.innerText = `${track.url}`;
      trackLink.href = `${track.url}`;
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
      albumArtDesc.download = "AlbumArt.jpg";
    } else {
      albumArtDesc.innerText = "No album art available";
      albumArtDesc.href = "";
      albumArt.src = "https://lastfm.freetls.fastly.net/i/u/4128a6eb29f94943c9d206c08e625904.jpg";
    }
    if (track.album.mbid) {
      albumMbid.innerText = `${track.album.mbid}`;
      albumMbid.href = `https://musicbrainz.org/release/${track.album.mbid}`;
    } else {
      albumMbid.innerText = "Unknown (N/A)";
    }
    if (track.artist.mbid) {
      artistMbid.innerText = `${track.artist.mbid}`;
      artistMbid.href = `https://musicbrainz.org/artist/${track.artist.mbid}`;
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

resetToFirstState();