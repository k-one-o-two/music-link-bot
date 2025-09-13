import YTMusic from "ytmusic-api";

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

export const searchers = {
  deezer: searchDeezer,
  ytmusic: searchYTMusic,
};
