import { parse } from "node-html-parser";

const parseDeezer = async (link) => {
  const response = await fetch(link);
  const data = await response.text();

  const root = parse(data);

  const title = root.querySelector("title").innerText;

  if (!title) {
    return null;
  }

  const [track, artist] = title.replace(" | Deezer", "").split(" - ");

  return {
    track,
    artist,
  };
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

  return {
    track,
    artist: parsedArtist[1].trim(),
  };
};

export const parsers = {
  deezer: parseDeezer,
  spotify: parseSpotify,
};
