# JanVote AI 🗳️

JanVote AI is a production-ready, highly intelligent election assistant designed for Indian voters. It provides real-time information on polling booths, election laws, party comparisons, and more, with full multi-language support.

## Features
- 🤖 **AI Assistant:** Powered by Gemini for factual election queries.
- 🪷 **Party Comparison:** Side-by-side analysis of major Indian political parties.
- 🗺️ **Booth Locator:** Interactive maps to find your polling station.
- 📄 **EPIC Scanner:** AI-powered OCR to extract voter ID details.
- 🗣️ **Multilingual:** Supports English, Hindi, Bengali, Telugu, Tamil, and Marathi.

## Deployment to Cloud Run

The project is already configured for Google Cloud Run with a `Dockerfile` and production-ready `server.ts`.

### Prerequisites
1. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed.
2. A GCP Project with billing enabled.

### Steps to Deploy

1. **Build and Deploy:**
   Run the following command from the project root:
   ```bash
   gcloud run deploy janvote-ai --source . --platform managed --region us-central1 --allow-unauthenticated
   ```

2. **Environment Variables:**
   After deployment, ensure you set the following environment variables in the Cloud Run console:
   - `GEMINI_API_KEY`
   - `VISION_API_KEY`
   - `SPEECH_API_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `GCP_API_KEY` (shared fallback)

## Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file based on `.env.example`.

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
