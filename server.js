require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🎬 Welcome to CartoonVerse AI V2!\n\nUse:\n/story Football Hero"
  );
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Commands:\n\n/story\n/movie\n/image\n/video"
  );
});

app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI Bot Running");
});
bot.onText(/\/story (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "⏳ Generating story...");

  await bot.sendMessage(
    chatId,
    `⚽ Story Topic: ${topic}\n\n✅ Test successful!\nGemini AI will be connected in the next step.`
  );
});
app.listen(PORT, () => {
  console.log("🚀 Server Started");
});
