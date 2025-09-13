import TelegramBot from "node-telegram-bot-api";
import { searchers } from "./searchers.js";
import { parsers } from "./parsers.js";

import dotenv from "dotenv";
dotenv.config();

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/^lookup(.*)/i, async (msg, match) => {
  const [deezer, yt] = await Promise.all([
    searchers.deezer(match[1]),
    searchers.ytmusic(match[1]),
  ]);

  let message = "";

  if (deezer) {
    message += `Deezer: ${deezer}\n`;
  }

  if (yt) {
    message += `YouTube Music: ${yt}`;
  }

  if (message) {
    bot.sendMessage(msg.chat.id, message);
  }
});

bot.onText(/https:\/\/www\.deezer.*/i, async (msg, match) => {
  const text = match[0];

  const deezer = await parsers.deezer(text);

  let message = "";

  if (deezer) {
    const title = `${deezer.track} ${deezer.artist}`;
    message += `Found on Deezer: ${title}\n`;

    const yt = await searchers.ytmusic(title);
    if (yt) {
      message += `Here is a YouTube Music link: ${yt}\n`;
    }
  }

  if (deezer) {
    bot.sendMessage(msg.chat.id, message);
  }
});

// https://open.spotify.com/track/62hzJcOwMg68h6wBimZALA
bot.onText(/https:\/\/open\.spotify.*/i, async (msg, match) => {
  const text = match[0];

  const spotify = await parsers.spotify(text);

  let message = "";

  if (spotify) {
    const title = `${spotify.track} ${spotify.artist}`;
    message += `Found on spotify: ${title}\n`;

    const yt = await searchers.ytmusic(title);
    if (yt) {
      message += `Here is a YouTube Music link: ${yt}\n`;
    }
  }

  if (spotify) {
    bot.sendMessage(msg.chat.id, message);
  }
});
