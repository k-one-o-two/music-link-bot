import { parse } from "node-html-parser";
import YTMusic from "ytmusic-api";

const parseDeezer = async (link) => {
  const response = await fetch(link);
  const data = await response.text();

  const root = parse(data);

  const title = root.querySelector("title").innerText;

  if (!title) {
    return null;
  }

  const [track, artist] = title.replace(" | Deezer", "").split(" - ");
};

const parseSpotify = async (link) => {
  const response = await fetch(link);
  const data = await response.text();

  const root = parse(data);

  const title = root.querySelector("title").innerText;

  if (!title) {
    return null;
  }

  const [track, artist] = title.replace(" | Spotify", "").split(" - ");
  const parsedArtist = artist.split("by");
  console.info(track, parsedArtist[1].trim());
};

const searchDeezer = async (query) => {
  const response = await fetch(`https://api.deezer.com/search?q=${query}`);
  const data = await response.json();

  if (!data.data.length) {
    return null;
  }

  return data.data[0].link;
};

const searchYTMusic = async (query) => {
  const ytmusic = new YTMusic();
  await ytmusic.initialize(/* Optional: Custom cookies */);
  // console.info(ytmusic);
  // const query = `${songTitle} ${artist}`;
  const results = await ytmusic.search(query, { filter: "songs" });
  if (!results) {
    return null;
  }

  const result = results[0];
  return `https://music.youtube.com/watch?v=${result.videoId}`;
};

const text = "Dying Sun Before The Dawn";

const [deezer, yt] = await Promise.all([
  searchDeezer(text),
  searchYTMusic(text),
]);

console.info(deezer, yt);
