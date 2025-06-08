const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();
    res.json({ text: reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ text: "Error: Gemini API failed." });
  }
});

app.get("/suggestions", async (req, res) => {
  try {
    const prompt = req.query.prompt;
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt + ". कृपया 3 follow-up सवाल दो।");
    const suggestions = result.response.text().split("\n").filter(s => s.trim() !== '').slice(0, 3);
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ suggestions: [] });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));