require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

app.use(express.json());

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `🎬 Welcome to CartoonVerse AI V2!

Available Commands:

/story Football Hero
/help`
  );
});

bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
`📖 Commands

/story Football Hero

Coming Soon:
/movie
/video
/image`
  );
});

bot.onText(/\/story (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "⏳ Creating Story...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Write a professional cinematic football story.

Topic:
${topic}

Requirements:

- Title
- Hook
- Story
- Ending
- Moral

Length: around 800-1000 words.
Language: English.
Suitable for YouTube Cartoon Video.
`
    });

    await bot.sendMessage(chatId, response.text);

  } catch (error) {

    console.error(error);

    await bot.sendMessage(
      chatId,
      "❌ Gemini AI Error.\nCheck API Key or Railway Logs."
    );

  }

});

app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI V2 Running");
});

app.listen(PORT, () => {
  console.log("🚀 Server Started");
});
