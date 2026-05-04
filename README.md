<div align="center">

<img width="100%" alt="JanVote AI Banner" src="https://capsule-render.vercel.app/api?type=waving&color=FF6500&height=200&section=header&text=JanVote%20AI&fontSize=72&fontColor=ffffff&fontAlignY=35&desc=Empowering%20India's%20Voters%20with%20Artificial%20Intelligence&descAlignY=55&descSize=18&animation=fadeIn" />

<br/>

<!-- Badges Row 1 -->
<a href="https://ai.studio/apps/2e666e88-92d3-4e41-9e4f-adb2524fb49c">
  <img src="https://img.shields.io/badge/🏆%20Google%20PromptWar-Submission-FF6500?style=for-the-badge&labelColor=0B0F2E" alt="Google PromptWar" />
</a>
&nbsp;
<img src="https://img.shields.io/badge/Gemini%202.5%20Flash-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white&labelColor=0B0F2E" alt="Gemini 2.5 Flash" />
&nbsp;
<img src="https://img.shields.io/badge/React%2019-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0B0F2E" alt="React TypeScript" />

<br/><br/>

<!-- Badges Row 2 -->
<img src="https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black&labelColor=0B0F2E" alt="Firebase" />
&nbsp;
<img src="https://img.shields.io/badge/Google%20Maps-Booth%20Locator-34A853?style=for-the-badge&logo=googlemaps&logoColor=white&labelColor=0B0F2E" />
&nbsp;
<img src="https://img.shields.io/badge/i18n-8%20Languages-FF6500?style=for-the-badge&logoColor=white&labelColor=0B0F2E" />
&nbsp;
<img src="https://img.shields.io/badge/License-MIT-00796B?style=for-the-badge&labelColor=0B0F2E" />

<br/><br/>

```
🇮🇳  जनमत · जनशक्ति · जनतंत्र  🇮🇳
The People's Voice · The People's Power · The People's Democracy
```

</div>

---

## 🗳️ What is JanVote AI?

**JanVote AI** is a comprehensive, AI-powered civic education platform built specifically for Indian voters. Submitted as an entry for **Google's PromptWar**, it transforms the overwhelming complexity of India's democratic machinery into an engaging, accessible, and intelligent experience for every citizen — from first-time voters in rural Uttar Pradesh to seasoned political observers in metro cities.

> *"The strength of democracy lies in an informed electorate."*  
> JanVote AI was built on that single conviction.

At its core, JanVote AI fuses **Google's Gemini 2.5 Flash** with real-time data infrastructure, interactive civic tools, and deep localization to serve India's 969 million registered voters in their own language, on their own terms.

---

## ✨ Feature Showcase

<table>
<tr>
<td width="50%" valign="top">

### 🤖 AI Chat Assistant
Conversational AI powered by **Gemini 2.5 Flash** with live Google Search grounding. Speaks in English, Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, and Kannada — auto-detecting your language in real time. Supports voice input (Speech Recognition API) and voice output (Web Speech Synthesis), making it accessible even for users with low literacy. Persists full conversation history via Firebase for seamless cross-session continuity.

</td>
<td width="50%" valign="top">

### 🗺️ Smart Booth Locator
GPS-powered polling booth discovery using **Google Maps API** + **Leaflet** with real-time turn-by-turn directions, accessibility flags (wheelchair ramps, visual impairment support), wait time estimates, and full Leaflet map integration. Features an **EPIC Card Scanner** (Google Vision API) that auto-reads your Voter ID to instantly populate your search.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📜 Interactive Election Timeline
A richly animated chronological journey through **75+ years** of Indian electoral history — from the first General Election of 1951–52 to the 2024 Lok Sabha polls. Each milestone is interactive, searchable, and contextualized with socio-political commentary powered by Gemini.

</td>
<td width="50%" valign="top">

### 🎮 Gamified Civic Quiz
Difficulty-tiered trivia (Easy / Medium / Hard) covering constitutional articles, ECI procedures, voter rights, and electoral history. Timed challenges, confetti celebrations, Firebase-backed scoring, and a **global Leaderboard** to fuel healthy democratic competition.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🏛️ EVM Voting Simulation
A pixel-perfect recreation of the Electronic Voting Machine experience — select your candidate, confirm your vote, hear the beep, feel the vibration (haptic feedback on mobile). Designed to eliminate first-timer anxiety at the booth.

</td>
<td width="50%" valign="top">

### ✅ Voter Readiness Check
AI-generated personalized readiness reports. Answer 5 questions, select your state, and receive a Gemini-crafted PDF-exportable action plan — prioritized as Urgent / Soon / Done — telling you exactly what steps remain before Election Day.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📊 Live Statistics Dashboard
Real-time voter turnout charts (2004–2024), gender distribution breakdowns, state-wise heatmaps, and a live feed of polling updates — all visualized with **Recharts** and synced through Firebase Firestore's `onSnapshot` listeners.

</td>
<td width="50%" valign="top">

### ⚖️ Electoral Laws Library
Comprehensive, tabbed reference for India's electoral legal framework: Constitutional Articles (324–329), key legislations (RPA 1951, PECA 1955), Model Code of Conduct breakdown, and curated links to official ECI portals — all in one place.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🚶 Voter Journey Simulator
Step-by-step walkthrough of the complete Indian voting process — from registration to EPIC card collection to casting your ballot. Visual progress stepper with contextual tips at each stage.

</td>
<td width="50%" valign="top">

### 🏆 Real-Time Leaderboard
Community engagement tracker showing top civic champions by quiz score. Firebase-powered live ranking, encouraging repeat engagement and turning civic education into a social experience.

</td>
</tr>
</table>

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite 6)                 │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  React Router│  │  Framer      │  │  Tailwind    │  │  i18next │ │
│  │  v7 (SPA)    │  │  Motion v12  │  │  CSS v4      │  │  8 langs │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Three.js    │  │  Recharts    │  │  React       │  │  Leaflet │ │
│  │  (Globe)     │  │  (Charts)    │  │  Leaflet     │  │  Maps    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Express Server   │
                    │   (tsx + ts)       │
                    └─────────┬──────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Google Gemini  │  │    Firebase     │  │  Google Cloud  │
│  2.5 Flash API  │  │  Firestore +    │  │  Vision API    │
│  + Google Search│  │  Auth (Google)  │  │  Speech API    │
│  Grounding      │  │  + Realtime DB  │  │  Maps API      │
└─────────────────┘  └─────────────────┘  └────────────────┘
```

### Core Technologies

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component architecture & type safety |
| **Build Tool** | Vite 6 | Lightning-fast HMR & optimized builds |
| **AI Engine** | `@google/genai` → Gemini 2.5 Flash | Chat, readiness reports, news intel |
| **Search Grounding** | Gemini + Google Search Tool | Real-time factual accuracy |
| **Backend** | Express 4 + tsx | API proxy & server-side rendering |
| **Database** | Firebase Firestore | Chat history, quiz scores, leaderboard |
| **Auth** | Firebase Auth (Google Sign-In) | Secure, frictionless user identity |
| **Maps** | Google Maps API + Leaflet + React-Leaflet | Booth location & navigation |
| **Vision** | Google Cloud Vision API | EPIC card OCR scanning |
| **Speech** | Web Speech API + Google Speech API | Voice input & multilingual TTS |
| **Animations** | Framer Motion (Motion v12) | Fluid page transitions & micro-interactions |
| **3D** | Three.js + React Three Fiber | Hero globe visualization |
| **Charts** | Recharts | Voter statistics visualization |
| **i18n** | i18next + react-i18next | 8 Indian language support |
| **Styling** | Tailwind CSS v4 | Utility-first responsive design |
| **PDF Export** | html2canvas | Voter readiness report download |
| **Confetti** | canvas-confetti | Celebration on quiz completion & voting |

---

## 🌍 Multilingual Support

JanVote AI speaks the languages of India:

| Flag | Language | Code |
|------|----------|------|
| 🇬🇧 | English | `en-IN` |
| 🇮🇳 | Hindi (हिन्दी) | `hi-IN` |
| 🌴 | Tamil (தமிழ்) | `ta-IN` |
| ⭐ | Telugu (తెలుగు) | `te-IN` |
| 🦁 | Marathi (मराठी) | `mr-IN` |
| 🐯 | Bengali (বাংলা) | `bn-IN` |
| 🦚 | Gujarati (ગુજરાતી) | `gu-IN` |
| 🐘 | Kannada (ಕನ್ನಡ) | `kn-IN` |

The AI Chat Assistant auto-detects and matches the user's language — no configuration required. Speak to it in Hindi, it replies in Hindi. Switch to Tamil mid-conversation — it switches too.

---

## 🚀 Getting Started

### Prerequisites

```bash
node --version   # v18+ required
npm --version    # v9+ recommended
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/JanVote-AI.git
cd JanVote-AI

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following keys:

```env
# 🔑 Google Gemini (Required)
GEMINI_API_KEY="your_gemini_api_key"
VITE_GEMINI_API_KEY="your_gemini_api_key"

# 🗺️ Google Maps (Required for Booth Locator)
VITE_GOOGLE_MAPS_API_KEY="your_maps_api_key"

# 👁️ Google Cloud Vision (Required for EPIC Scanner)
VISION_API_KEY="your_vision_api_key"

# 🎙️ Google Cloud Speech (Required for Voice Input)
SPEECH_API_KEY="your_speech_api_key"

# ☁️ GCP Master Key
GCP_API_KEY="your_gcp_api_key"

# 🌐 App URL
APP_URL="http://localhost:3000"
```

> **Get API Keys:**
> - Gemini: [Google AI Studio](https://aistudio.google.com/app/apikey)
> - Maps, Vision, Speech: [Google Cloud Console](https://console.cloud.google.com)

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start exploring.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
JanVote-AI/
├── 📄 index.html                    # Root HTML shell
├── 🖥️ server.ts                     # Express backend (API proxy)
├── 🔥 firestore.rules               # Firestore security rules
├── ⚙️ firebase-blueprint.json       # Firebase project schema
│
├── 📂 public/
│   └── logos/                       # Party logos (BJP, INC, AAP, CPI)
│
└── 📂 src/
    ├── main.tsx                     # React entry point
    ├── App.tsx                      # Router, auth guards, layout
    ├── index.css                    # Global styles
    │
    ├── 📂 components/
    │   ├── AppHeader.tsx            # Top navigation bar
    │   ├── Sidebar.tsx              # Left navigation panel
    │   ├── EpicScanner.tsx          # Voter ID OCR component
    │   └── HeroGlobe.tsx            # Three.js 3D globe
    │
    ├── 📂 context/
    │   └── AuthContext.tsx          # Firebase auth state provider
    │
    ├── 📂 lib/
    │   ├── gemini.ts                # All Gemini AI integrations
    │   ├── firebase.ts              # Firebase config & helpers
    │   ├── i18n.ts                  # Internationalization config
    │   └── utils.ts                 # Shared utility functions
    │
    └── 📂 pages/
        ├── Home.tsx                 # Landing page + hero
        ├── ChatAssistant.tsx        # AI chat interface
        ├── BoothLocator.tsx         # GPS booth finder + maps
        ├── Timeline.tsx             # Election history timeline
        ├── Quiz.tsx                 # Gamified civic quiz
        ├── Simulation.tsx           # EVM voting simulator
        ├── VoterReadiness.tsx       # Readiness checker + PDF
        ├── VoterJourney.tsx         # Step-by-step voter guide
        ├── StatsDashboard.tsx       # Live charts & statistics
        ├── ElectoralLaws.tsx        # Legal framework library
        ├── Parties.tsx              # Political party explorer
        ├── RealTimeIntel.tsx        # AI-powered election news
        ├── Leaderboard.tsx          # Community quiz ranking
        └── Profile.tsx              # User profile & history
```

---

## 🔐 Security & Data Privacy

- **Firestore Rules** are strictly scoped — users can only read/write their own data
- **Google Sign-In** is the only authentication method — no passwords stored
- **No political bias** — The AI is explicitly instructed to never recommend candidates or take party positions
- **API keys** are server-proxied and never exposed to the client in production
- **Microphone & Camera** access is requested only when actively used (booth scanner, voice input)

---

## 🎯 PromptWar Challenge Context

This project was built for **Google's PromptWar** — a competitive AI app-building challenge powered by **Google AI Studio** and **Gemini**.

**The Challenge:** Build an impactful AI-powered application using Gemini's capabilities.

**Our Answer:** India has 969 million registered voters. Yet voter awareness, accessibility barriers, and language diversity remain persistent challenges. JanVote AI directly addresses this gap by making civic education conversational, personalized, and available in 8 Indian languages — powered by Gemini's multimodal, multilingual intelligence.

**Key Gemini features leveraged:**
- `gemini-2.5-flash` model for fast, accurate civic Q&A
- `googleSearch` tool for real-time election news grounding
- Streaming responses (`generateContentStream`) for a fluid chat UX
- Multilingual system instructions with dynamic language injection
- Structured output parsing for voter readiness reports and follow-up generation

---

## 📸 Screenshots

| Feature | Preview |
|---------|---------|
| 🏠 Hero Dashboard | *AI-Powered voter education landing page with animated globe* |
| 🤖 AI Chat | *Multilingual chat with voice support and follow-up suggestions* |
| 🗺️ Booth Locator | *GPS-based Leaflet map with EPIC scanner integration* |
| 📊 Stats Dashboard | *Recharts-powered turnout trends and voter demographics* |
| 🎮 Quiz | *Timed difficulty-tiered quiz with confetti celebrations* |
| 🏛️ Simulation | *EVM replica with haptic feedback and vote confirmation* |

---

## 🤝 Contributing

Contributions that expand JanVote AI's reach and accuracy are warmly welcomed.

```bash
# Fork → Clone → Branch
git checkout -b feature/your-feature-name

# Commit with clarity
git commit -m "feat: add [feature] for [reason]"

# Push & open a Pull Request
git push origin feature/your-feature-name
```

**Areas where contributions matter most:**
- Adding more Indian languages (Odia, Malayalam, Punjabi, Urdu)
- Integrating official ECI APIs for live voter roll lookup
- Accessibility improvements (screen reader support, high-contrast mode)
- State-specific electoral data & constituency maps

---

## 📜 License

```
MIT License — Free to use, modify, and distribute with attribution.
Built with ❤️ for India's democracy.
```

---

## 🙏 Acknowledgements

| Technology | Contribution |
|---|---|
| **Google Gemini 2.5 Flash** | The intelligence that powers every AI interaction |
| **Google AI Studio** | The platform that made PromptWar possible |
| **Google Maps Platform** | Booth location & navigation engine |
| **Firebase** | Real-time data, auth, and persistence backbone |
| **Election Commission of India** | The institution whose mission inspired this project |
| **969 million Indian voters** | The reason this exists |

---

<div align="center">

<img width="100%" alt="Footer" src="https://capsule-render.vercel.app/api?type=waving&color=FF6500&height=120&section=footer&animation=fadeIn" />

<br/>

**Built for Google PromptWar · Powered by Gemini 2.5 Flash**

<br/>

<img src="https://img.shields.io/badge/Made%20with%20❤️%20for-India-FF9933?style=for-the-badge&labelColor=0B0F2E" />
&nbsp;
<img src="https://img.shields.io/badge/🗳️%20Jai-Hind-138808?style=for-the-badge&labelColor=0B0F2E" />

<br/><br/>

*जनता जनार्दन — The People are God*

</div>
