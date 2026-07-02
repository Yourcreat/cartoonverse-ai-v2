require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenAI } = require("@google/genai");
const { fal } = require("@fal-ai/client");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configure FAL
fal.config({
  credentials: process.env.FAL_KEY,
});

// Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Send Long Messages
async function sendLongMessage(chatId, text) {
  const MAX = 4000;

  for (let i = 0; i < text.length; i += MAX) {
    await bot.sendMessage(chatId, text.substring(i, i + MAX));
  }
}
// =======================
// PROJECT DATABASE
// =======================

const PROJECT_FOLDER = path.join(__dirname, "data", "projects");

if (!fs.existsSync(PROJECT_FOLDER)) {
  fs.mkdirSync(PROJECT_FOLDER, { recursive: true });
}

function saveProject(projectName, data) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function loadProject(projectName) {
  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  if (!fs.existsSync(file)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listProjects() {
  return fs.readdirSync(PROJECT_FOLDER)
    .filter(file => file.endsWith(".json"))
    .map(file => file.replace(".json", ""));
}
// =======================
// START
// =======================

bot.onText(/\/start/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`🎬 CartoonVerse AI V6

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

// =======================
// HELP
// =======================

bot.onText(/\/help/, async (msg) => {

  await bot.sendMessage(
    msg.chat.id,
`📖 Commands

/story Football Hero
/movie Football Hero
/image Football Hero
/video Football Hero
/create Football Hero
/title Football Hero
/thumbnail Football Hero`
  );

});
// =======================
// STORY
// =======================

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

Length: 800–1000 words.
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

// =======================
// MOVIE
// =======================

bot.onText(/\/movie (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🎬 Creating Movie Package...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a complete YouTube cartoon movie package.

Topic:
${topic}

Return exactly:

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
// =======================
// IMAGE
// =======================

bot.onText(/\/image (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🎨 Generating AI Image...");

  try {

    const result = await fal.subscribe("fal-ai/flux-1/schnell", {
      input: {
        prompt: `
${topic}

Pixar 3D style,
Ultra detailed,
Cinematic lighting,
Professional animation,
Highly detailed,
8K,
Vibrant colors
`,
        image_size: "landscape_16_9"
      }
    });

    await bot.sendPhoto(
      chatId,
      result.data.images[0].url,
      {
        caption: `✅ ${topic}`
      }
    );

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Image Error:\n" +
      (err.message || JSON.stringify(err))
    );

  }

});
// =======================
// VIDEO
// =======================

bot.onText(/\/video (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🎥 Creating Cinematic Video Prompts...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a complete cinematic animation package.

Topic:
${topic}

Return:

# Scene 1
8-second cinematic video prompt

# Scene 2
8-second cinematic video prompt

...

Continue until Scene 10.

Requirements:
- Pixar 3D
- Character consistency
- Cinematic camera
- Dynamic motion
- Professional lighting
- Ready for Veo, Seedance, Hailuo, Kling and LTX Studio.
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
// =======================
// PROJECT
// =======================

bot.onText(/\/project (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const topic = match[1];

  await bot.sendMessage(chatId, "🚀 Creating Project...");

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Create a complete YouTube cartoon project.

Topic:
${topic}

Return:

# STORY

# CHARACTER SHEET

# IMAGE PROMPTS

# VIDEO PROMPTS

# MOVIE SCRIPT
`
    });

    const projectData = {
      topic,
      createdAt: new Date().toISOString(),
      content: response.text
    };

    saveProject(topic, projectData);

    await bot.sendMessage(
      chatId,
      `✅ Project "${topic}" saved successfully!`
    );

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(
      chatId,
      "❌ Project Error:\n" + (err.message || JSON.stringify(err))
    );

  }

});
// =======================
// OPEN PROJECT
// =======================

bot.onText(/\/open (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const projectName = match[1];

  const project = loadProject(projectName);

  if (!project) {
    return bot.sendMessage(chatId, "❌ Project not found.");
  }

  await bot.sendMessage(chatId, `📂 Project: ${projectName}`);

  await sendLongMessage(chatId, project.content);

});
// =======================
// LIST PROJECTS
// =======================

bot.onText(/\/list/, async (msg) => {

  const chatId = msg.chat.id;

  const projects = listProjects();

  if (projects.length === 0) {
    return bot.sendMessage(chatId, "📂 No projects found.");
  }

  await bot.sendMessage(
    chatId,
    "📂 Saved Projects:\n\n" + projects.join("\n")
  );

});
// =======================
// DELETE PROJECT
// =======================

bot.onText(/\/delete (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const projectName = match[1];

  const file = path.join(PROJECT_FOLDER, `${projectName}.json`);

  if (!fs.existsSync(file)) {
    return bot.sendMessage(chatId, "❌ Project not found.");
  }

  fs.unlinkSync(file);

  await bot.sendMessage(chatId, `🗑 Project "${projectName}" deleted.`);

});
// =======================
// CREATE
// =======================

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

# YOUTUBE TITLE

# YOUTUBE DESCRIPTION

# TAGS
`
    });

    await sendLongMessage(chatId, response.text);

  } catch (err) {

    console.error(err);

    await bot.sendMessage(chatId, "❌ Create Error");
  }

});

// =======================
// TITLE
// =======================

bot.onText(/\/title (.+)/, async (msg, match) => {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate 20 viral YouTube titles about ${match[1]}`
  });

  await sendLongMessage(msg.chat.id, response.text);

});

// =======================
// THUMBNAIL
// =======================

bot.onText(/\/thumbnail (.+)/, async (msg, match) => {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create one ultra cinematic Pixar 3D thumbnail prompt for ${match[1]}`
  });

  await sendLongMessage(msg.chat.id, response.text);

});

// =======================
// HOME
// =======================

app.get("/", (req, res) => {
  res.send("✅ CartoonVerse AI V6 Running");
});

// =======================
// SERVER
// =======================

app.listen(PORT, () => {
  console.log("🚀 CartoonVerse AI V6 Started");
});
