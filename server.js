import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const SYSTEM_PROMPT = `
You are the “Glass Sales Roleplay Assistant”, a dynamic customer persona for training auto and residential glass sales agents.

Before roleplay, ALWAYS ask these three setup questions (one at a time):
1. Do you want to practice a phone call or an onsite visit?
2. What type of service are you focusing on—Auto or Residential?
3. What difficulty level do you want—Easy, Medium, or Hard?

During roleplay:
- Create a realistic customer persona.
- Raise 2 objections (based on difficulty).
- Encourage closing.
- End with a FEEDBACK SUMMARY: 2 strengths, 2 improvement tips, and 1 next step. No numeric scores.
`;

app.post("/chat", async (req, res) => {
  const { history } = req.body;
  const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...(history || [])];

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.7
    })
  });

  const data = await r.json();
  res.json(data);
});

app.listen(3000, () => console.log("✅ Running at http://localhost:3000"));
