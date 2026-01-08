import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a medical assistant. Give general health guidance only. Do not diagnose. Always suggest seeing a licensed doctor."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.4
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "AI service is currently unavailable." });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});
