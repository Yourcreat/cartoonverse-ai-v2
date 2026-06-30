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
// IMAGE
bot.onText(/\/image (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];
  console.log("IMAGE COMMAND RECEIVED");
await bot.sendMessage(chatId, "✅ Image command detected");

  await bot.sendMessage(chatId, "🎨 Creating Image Prompts...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a complete Pixar-style character and image package.

Topic:
${topic}

Return exactly in this format:

# Main Character

# Character Sheet

Age:
Hair:
Face:
Eyes:
Body:
Clothes:
Shoes:

# Scene 1 Image Prompt

# Scene 2 Image Prompt

# Scene 3 Image Prompt

# Scene 4 Image Prompt

# Scene 5 Image Prompt

# Scene 6 Image Prompt

# Scene 7 Image Prompt

# Scene 8 Image Prompt

# Scene 9 Image Prompt

# Scene 10 Image Prompt

Every prompt must be cinematic, Pixar 3D, ultra detailed, consistent character design.
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Image Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});
// VIDEO
bot.onText(/\/video (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];
  console.log("VIDEO COMMAND RECEIVED");
await bot.sendMessage(chatId, "✅ Video command detected");

  await bot.sendMessage(chatId, "🎥 Creating Video Prompts...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create 10 cinematic AI video prompts.

Topic:
${topic}

Requirements:

- Scene 1 to Scene 10
- Pixar 3D style
- Cinematic camera
- Character consistency
- Lighting
- Environment
- Motion
- 8-second prompt for each scene
- Ready for Veo AI, LTX Studio and Hailuo AI

Return only the prompts.
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Video Error:\n" + (err.message || JSON.stringify(err))
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
