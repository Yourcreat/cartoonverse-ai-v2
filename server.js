require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================
// TELEGRAM BOT
// =========================

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// =========================
// GEMINI AI
// =========================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =========================
// SEND LONG MESSAGE
// =========================

async function sendLongMessage(chatId, text) {

  const MAX_LENGTH = 4000;

  for (let i = 0; i < text.length; i += MAX_LENGTH) {

    await bot.sendMessage(
      chatId,
      text.substring(i, i + MAX_LENGTH)
    );

  }

}

// =========================
// START
// =========================

bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`🎬 CartoonVerse AI V5

Available Commands

/story Topic
/movie Topic
/image Topic
/video Topic
/create Topic
/title Topic
/thumbnail Topic
/help`
  );

});

// =========================
// HELP
// =========================

bot.onText(/\/help/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`📖 CartoonVerse AI Commands

/story Football Hero

/movie Football Hero

/image Football Hero

/video Football Hero

/create Football Hero

/title Football Hero

/thumbnail Football Hero`
  );

});
