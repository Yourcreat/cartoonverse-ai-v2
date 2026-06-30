require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

// Check environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing");
  process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Send long Telegram messages
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
`🎬 Welcome to CartoonVerse AI V2

Commands:

/story Football Hero
/help`
  );
});

// HELP
bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
`📖 Commands

/story Football Hero`
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
Write a cinematic football story.

Topic: ${topic}

Requirements:
- Title
- Hook
- Story
- Ending
- Moral

Length: 800 words.
Language: English.
`
    });

    const story = response.text;

    if (!story) {
      return bot.sendMessage(chatId, "❌ Gemini returned an empty response.");
    }

    await sendLongMessage(chatId, story);

  } catch (err) {

    console.error("Gemini Error:", err);

    await bot.sendMessage(
      chatId,
      "❌ Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});

// Home
app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI V2 Running");
});

// Start Server
app.listen(PORT, () => {
  console.log("🚀 Server Started on Port " + PORT);
});
