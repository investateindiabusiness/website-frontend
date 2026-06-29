import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const INVESTATE_KNOWLEDGE = `
Investate India is a specialized NRI real estate investment and wealth protection platform.
It helps Non-Resident Indians securely invest, manage, and safeguard real estate assets in India.

Investor services:
- Verified real estate investment opportunities
- Pre-screened and compliant property projects
- Legal, taxation, documentation, and compliance support
- Asset protection services
- Rental management support
- Investment guidance
- Wealth preservation and succession planning

Builder services:
- Project listing for verified builders/developers
- Visibility among international NRI buyers
- High-quality investment lead generation
- Builder verification and credibility support
- Advertisement and membership/partnership opportunities
- Direct connection with potential NRI investors

Rules:
- First understand whether the user is an Investor or Builder.
- Give helpful but concise answers.
- Do not promise investment returns, profits, appreciation, or guaranteed legal outcomes.
- For legal, tax, payment, or investment decisions, provide general information only and suggest expert consultation.
- For serious inquiries, ask for lead details.
- Investor lead details: name, email, phone/WhatsApp, country, preferred city, budget, property type, timeline.
- Builder lead details: company name, contact person, email, phone/WhatsApp, project name, location, project type, RERA status.
`;

app.get("/", (req, res) => {
  res.send("Investate AI chatbot backend is running.");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, userType } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing in .env" });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: `
You are Investate AI Assistant for Investate India.

Use this business context:
${INVESTATE_KNOWLEDGE}

Current user type: ${userType || "unknown"}.

Answer professionally and briefly.
If the user is interested, ask for lead details.
Do not give final legal, tax, or investment advice.
            `
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: "Groq API error",
        details: data.error?.message || JSON.stringify(data)
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error("Groq chatbot error:", error);
    res.status(500).json({
      error: "AI chatbot failed",
      details: error.message
    });
  }
});

app.post("/api/lead", (req, res) => {
  const lead = {
    ...req.body,
    createdAt: new Date().toISOString()
  };

  console.log("New chatbot lead:", lead);

  res.json({
    success: true,
    message: "Lead captured successfully",
    lead
  });
});

app.listen(PORT, () => {
  console.log(`Investate AI chatbot backend running at http://localhost:${PORT}`);
});