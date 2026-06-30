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
// MOVIE
bot.onText(/\/movie (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🎬 Creating Movie Package...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a professional YouTube cartoon movie package.

Topic:
${topic}

Return in this format:

# Movie Title

# Main Character

# Story Summary

# Scene 1
# Scene 2
# Scene 3
# Scene 4
# Scene 5
# Scene 6
# Scene 7
# Scene 8
# Scene 9
# Scene 10
`
    });

    const movie = response.text;

    await sendLongMessage(chatId, movie);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Movie Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});

// Home Page
app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI Running");
});

// Start Server
app.listen(PORT, () => {
  console.log("🚀 Server Started");
});
