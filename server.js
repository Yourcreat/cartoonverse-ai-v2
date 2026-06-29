require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/story (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "⏳ Creating your story...");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a cinematic football story about "${topic}".
Make it engaging, emotional, and suitable for a 5–10 minute YouTube cartoon video.`,
    });

    await bot.sendMessage(chatId, response.text);

  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, "❌ Gemini AI Error.");
  }
});
