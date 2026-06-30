require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());

// Function to send long messages
async function sendLongMessage(chatId, text) {
  const MAX = 4000;

  for (let i = 0; i < text.length; i += MAX) {
    await bot.sendMessage(chatId, text.substring(i, i + MAX));
  }
}

// Start
bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
`🎬 Welcome to CartoonVerse AI V2

Commands:

/story Football Hero
/help`
  );
});

// Help
bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
`📖 Available Commands

/story Football Hero

Coming Soon:
🎬 /movie
🖼 /image
🎥 /video`
  );
});

// Story
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

- Catchy Title
- Hook
- Full Story
- Emotional Ending
- Moral

Length: 1000 words.

Language: English.

Suitable for YouTube Cartoon Story.
`
    });

    const story = response.text;

    await sendLongMessage(chatId, story);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Gemini AI Error.\nPlease check Railway Logs."
    );

  }

});

// Home Page
app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI V2 Running");
});

// Start Server
app.listen(PORT, () => {
  console.log("🚀 Server Started");
});
