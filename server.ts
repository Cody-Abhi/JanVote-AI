import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/scan-epic", async (req, res) => {
    try {
      const { imageData } = req.body;
      const apiKey = process.env.VISION_API_KEY || process.env.GCP_API_KEY;

      if (!apiKey) {
        console.error("VISION_API_KEY is missing from environment variables.");
        return res.status(400).json({ error: "VISION_API_KEY environment variable is not set correctly." });
      }

      console.log(`Processing EPIC scan request. API Key length: ${apiKey.length}`);

      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageData },
              features: [{ type: "TEXT_DETECTION" }]
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("GCP Vision API Error:", data);
        return res.status(response.status).json({ error: data.error?.message || "OCR failed" });
      }

      const fullText = data.responses?.[0]?.fullTextAnnotation?.text || "";
      if (!fullText) {
        return res.status(422).json({ 
          error: "CRITICAL_READ_FAILURE",
          message: "Could not detect any text on the card. Please ensure the card is well-lit, flat, and centered in the frame." 
        });
      }

      // Parsing heuristics for Indian EPIC Cards
      const lines = fullText.split("\n").map((l: string) => l.trim()).filter(Boolean);
      
      let epicNumber = "";
      let name = "";
      let fatherName = "";
      let addressParts: string[] = [];
      let constituency = "";

      // 1. Extract EPIC Number (e.g., ABC1234567)
      const epicRegex = /[A-Z]{3}[0-9]{7}|[A-Z]{1,2}\/[0-9]{2}\/[0-9]{3}\/[0-9]{6}/i;
      const epicMatch = fullText.match(epicRegex);
      if (epicMatch) epicNumber = epicMatch[0].toUpperCase();

      // 2. Extract Name and other fields by identifying keywords
      lines.forEach((line: string, index: number) => {
        const lowerLine = line.toLowerCase();
        
        // Name
        if ((lowerLine.includes("name") || lowerLine.includes("naam")) && !lowerLine.includes("father") && !name) {
          name = line.replace(/.*[:\-]/, "").trim();
          if (!name && lines[index + 1]) name = lines[index + 1].trim();
        }

        // Constituency
        if (lowerLine.includes("constituency") || lowerLine.includes("assembly")) {
          constituency = line.replace(/.*[:\-]/, "").trim();
          if (!constituency && lines[index+1]) constituency = lines[index+1].trim();
        }

        // Address (Heuristic: Lines that look like addresses or follow Address keyword)
        if (lowerLine.includes("address") || lowerLine.includes("pata")) {
          const nextLines = lines.slice(index, index + 4);
          addressParts = nextLines.map(l => l.replace(/.*[:\-]/, "").trim()).filter(Boolean);
        }
      });

      // Refine Name if it's too short or contains common card noise
      name = name.replace(/ELECTION COMMISSION|IDENTITY CARD|INDIA/gi, "").trim();

      res.json({
        name: name || "Not detected",
        epicNumber: epicNumber || "Not detected",
        address: addressParts.join(", ") || "Not detected",
        constituency: constituency || "Not detected",
        confidence: data.responses[0].textAnnotations?.[0]?.confidence || 0.85
      });

    } catch (error) {
      console.error("Error scanning EPIC card:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });

  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audioData } = req.body;
      const apiKey = process.env.SPEECH_API_KEY || process.env.GCP_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ error: "SPEECH_API_KEY environment variable is not set." });
      }

      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: {
            languageCode: "en-IN",
            alternativeLanguageCodes: ["hi-IN", "en-US"]
          },
          audio: {
            content: audioData
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("GCP Speech API Error:", data);
        return res.status(response.status).json({ error: data.error?.message || "Transcription failed" });
      }

      if (data.results && data.results.length > 0) {
        const transcript = data.results.map((r: any) => r.alternatives[0].transcript).join(' ');
        res.json({ transcript });
      } else {
        res.json({ transcript: "" });
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
