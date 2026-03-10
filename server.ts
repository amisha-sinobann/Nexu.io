import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Initialize Gemini
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { agentName, agentRole, context, message, history } = req.body;
      
      const systemPrompt = `You are ${agentName}, a ${agentRole} in the NEXUS Command Center. 
      Your capabilities include: ${context}.
      
      Current system status:
      - CPU: ${Math.floor(Math.random() * 30) + 60}%
      - Active Agents: 38
      - Threat Level: LOW
      
      Respond to the user's command or query in character. 
      Keep responses concise, technical, and immersive. 
      Do not break character. 
      Use technical jargon appropriate for your role.
      If asked to perform an action, simulate the confirmation of that action.`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const chat = model.startChat({
        history: history || [],
        systemInstruction: systemPrompt,
      });

      const result = await chat.sendMessage(message);
      const response = result.response.text();
      
      res.json({ response });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to process agent response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files
    // Assuming 'dist' is the output directory
    // app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
