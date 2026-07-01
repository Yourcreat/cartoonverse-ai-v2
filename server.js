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
// =========================
// STORY
// =========================

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

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Story Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});

// =========================
// MOVIE
// =========================

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

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Movie Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});
// =========================
// IMAGE
// =========================

bot.onText(/\/image (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

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

Name:
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

    await bot.sendMessage(chatId, "❌ Image Error:\n" + (err.message || JSON.stringify(err)));

  }

});

// =========================
// VIDEO
// =========================

bot.onText(/\/video (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

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
- Ready for Veo AI, LTX Studio and Hailuo AI

Return only the prompts.
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(chatId, "❌ Video Error:\n" + (err.message || JSON.stringify(err)));

  }

});
// =========================
// CREATE
// =========================

bot.onText(/\/create (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🚀 Creating Complete AI Package...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a complete YouTube cartoon package.

Topic:
${topic}

Include:

# STORY

# CHARACTER SHEET

# IMAGE PROMPTS (10)

# VIDEO PROMPTS (10)

# MOVIE SCRIPT (10 SCENES)
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(chatId, "❌ Create Error:\n" + (err.message || JSON.stringify(err)));

  }

});

// =========================
// TITLE
// =========================

bot.onText(/\/title (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🔥 Creating Viral Titles...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Generate 20 viral YouTube titles about:

${topic}

Only return numbered titles.
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(chatId, "❌ Title Error:\n" + (err.message || JSON.stringify(err)));

  }

});

// =========================
// THUMBNAIL
// =========================

bot.onText(/\/thumbnail (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🖼 Creating Thumbnail Prompt...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create one ultra cinematic Pixar style YouTube thumbnail prompt.

Topic:

${topic}

Return only the prompt.
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(chatId, "❌ Thumbnail Error:\n" + (err.message || JSON.stringify(err)));

  }

});

// =========================
// HOME PAGE
// =========================

app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI V5 Running");
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log("🚀 CartoonVerse AI Started Successfully");
});
