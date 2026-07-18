import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client securely server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API: AI Matching & Gig Suitability Evaluation
app.post("/api/ai/match", async (req, res) => {
  const { student, opportunity } = req.body;
  if (!student || !opportunity) {
    return res.status(400).json({ error: "Missing student or opportunity details" });
  }

  try {
    const prompt = `You are the ultimate Web3 Recruitment AI Counselor for "Skill Chain India" (a premium digital talent marketplace).
Analyze how well this student fits this gig opportunity, and generate a customized high-end premium evaluation report.

Student Profile:
- Name: ${student.name}
- Headline: ${student.title}
- Skills: ${student.skills?.join(', ') || 'None listed'}
- Reputation Points: ${student.reputation || 0}
- Completed Projects: ${student.completedProjectsCount || 0}
- Rating: ${student.rating || 'No ratings yet'}
- Achievements: ${JSON.stringify(student.achievements || [])}

Opportunity Details:
- Title: ${opportunity.title}
- Company: ${opportunity.companyName}
- Description: ${opportunity.description}
- Category: ${opportunity.category}
- Budget: ${opportunity.budget}
- Payment Method: ${opportunity.paymentMethod}

Provide the response in structured JSON with the following schema:
{
  "compatibilityScore": 85,
  "verdict": "Highly Recommended" | "Recommended" | "Potential Match" | "Needs Upskilling",
  "suitabilityAnalysis": "A 2-3 sentence gorgeous analysis of why they are or aren't a great fit.",
  "smartTips": [
    "Highlight specific experience related to X.",
    "Mention completed polygon projects."
  ],
  "draftProposal": "An elegant, highly persuasive and professional proposal or cover letter tailored to this specific gig and utilizing the student's actual accomplishments."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    res.json(JSON.parse(responseText.trim()));
  } catch (err: any) {
    console.error("Gemini Matcher Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate evaluation" });
  }
});

// API: AI Smart Agreement & On-Chain Escrow Clause Generator
app.post("/api/ai/generate-agreement", async (req, res) => {
  const { studentName, companyName, projectTitle, budget, description } = req.body;

  try {
    const prompt = `Draft a premium, elegant Web3 micro-project agreement for:
- Freelancer/Student: ${studentName}
- Recruiter/Company: ${companyName}
- Project: ${projectTitle}
- Budget: ${budget}
- Details: ${description}

Include Web3-style escrow payment clauses, milestones, and dispute resolution guidelines.
Provide structured JSON with the following schema:
{
  "agreementTitle": "Web3 Escrow Smart Agreement",
  "clauses": [
    "Escrow Setup: Full funds must be locked in a smart contract prior to work.",
    "Milestone Releases: Standard checks and on-chain verification steps."
  ],
  "suggestedMilestones": [
    { "name": "Milestone 1", "percentage": 50, "deliverable": "Draft & proof of concept" },
    { "name": "Milestone 2", "percentage": 50, "deliverable": "Verification & final handoff" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (err: any) {
    console.error("Agreement Generator Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate agreement" });
  }
});

// Vite middleware setup for assets and SPA router
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
