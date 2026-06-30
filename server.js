require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Long Message Function
async function sendLongMessage(chatId, text) {
  const MAX_LENGTH = 4000;

  for (let i = 0; i < text.length; i += MAX_LENGTH) {
    await bot.sendMessage(chatId, text.substring(i, i + MAX_LENGTH));
  }
}

// START
bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`🎬 CartoonVerse AI

Commands

/story Football Hero
/movie Football Hero
/help`
  );

});

// HELP
bot.onText(/\/help/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`📖 Commands

/story Topic
/movie Topic

Example:

/story Football Hero
/movie Football Hero`
  );

});

// STORY
bot.onText(/\/story (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "⏳ Creating Story...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Write a professional cinematic story.

Topic:
${topic}

Requirements:

- Powerful Title
- Hook
- Story
- Ending
- Moral

Length: 800-1000 words.
Language: English.
`
    });

    const story = response.text;

    await sendLongMessage(chatId, story);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Story Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});
