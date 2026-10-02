# 🌿 FloraScape — AI Dream Garden Designer & Horticultural Studio

<div align="center">

![FloraScape Banner](https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1600&auto=format&fit=crop)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini_3.8_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Lyria Music](https://img.shields.io/badge/Lyria_Music_AI-10B981?style=for-the-badge&logo=soundcharts&logoColor=white)](https://ai.google.dev/)

**Turn any backyard, courtyard, or rooftop into a living botanical masterpiece with interactive 2D spatial layouts, photorealistic Gemini visualization renders, companion planting intelligence, and ambient AI music soundscapes.**

[🚀 Explore Features](#-key-features) • [🗺️ 2D Interactive Blueprint](#-interactive-spatial-blueprint) • [🎨 Gemini Visual Studio](#-gemini-visual-studio) • [🎵 Lyria Music AI](#-lyria-music-soundscape-studio) • [🔥 Firebase Integration](#-firebase--firestore-cloud-persistence) • [🛠️ Getting Started](#-getting-started)

</div>

---

## 🌟 Highlights & Overview

FloraScape is a full-stack horticultural design platform that bridges the gap between landscape architecture and botanical intelligence. Users can specify land dimensions, sunlight exposure, USDA hardiness zones, aesthetic style, and budget to generate:

1. **Interactive 2D Spatial Blueprints**: Scaled, clickable vector layouts with zoning overlays, botanical specimen markers, and sun path indicators.
2. **Photorealistic Image Generation & Editing**: Render perspective views using **`gemini-3.1-flash-image-preview`** and apply natural-language modifications (*"Add stone path"*, *"Replace grass with flowering lavender"*).
3. **Ambient Musical Soundscapes**: Compose tranquil garden audio with **`lyria-3-clip-preview`** and **`lyria-3-pro-preview`**, with an option to generate music inspired by your garden images!
4. **Cloud Persistence & Google Auth**: Secure login via **Firebase Authentication** with real-time bidirectional syncing to **Cloud Firestore**.

---

## ⚡ Key Features

| Feature | Powered By | Description |
| :--- | :--- | :--- |
| **Architectural Layout Synthesis** | `gemini-3.8-flash` | Generates dimension-accurate 2D blueprints with spatial coordinate mapping (`xPercent`, `yPercent`, radius). |
| **Interactive Blueprint Canvas** | React SVG + HTML5 | Pan, zoom, inspect botanical markers, toggle sun angle simulation, and view companion planting relationships. |
| **Visual Studio** | `gemini-3.1-flash-image-preview` | Multi-perspective landscape renders with aspect-ratio selection (`16:9`, `4:3`, `1:1`, `3:4`). |
| **Natural Language Inpainting / Edits** | Gemini Image Preview | Edit existing garden renders iteratively with conversational text instructions. |
| **Horticultural Catalog** | Curated Database | Comprehensive botanical database with care routines, sunlight, bloom schedules, and companion planting tables. |
| **Procurement & Shopping Guide** | Dynamic Budget Engine | Cost estimation by category (Trees, Shrubs, Perennials, Hardscape, Irrigation). |
| **Atmospheric Garden Music** | `lyria-3-clip-preview` & `lyria-3-pro-preview` | Generates custom WAV tracks matching garden mood and scenery (e.g. Zen bamboo flute, English cottage strings). |
| **Google Sign-In & Sync** | Firebase Auth & Firestore | Single-click Google login and automatic cloud persistence across devices. |

---

## 🗺️ Interactive Spatial Blueprint

<details open>
<summary><b>Click to expand Blueprint Engine details</b></summary>
<br>

The blueprint system provides an architectural top-down projection that maps:
- **Zoning Overlays**: Social entertaining terraces, meditation corners, culinary herb spirals, and wildlife ponds.
- **Botanical Specimen Pins**: Color-coded by plant type (canopy trees, flowering shrubs, perennials, groundcover).
- **Sun Path Simulator**: Interactive slider showing sunlight trajectories (Morning, Noon, Afternoon, Twilight) across your garden's exact dimensions.
- **Microclimate Indicators**: Visual warnings for plants that conflict with local shade or moisture zones.

</details>

---

## 🎨 Gemini Visual Studio

<details>
<summary><b>Click to view Visual Studio Capabilities</b></summary>
<br>

FloraScape allows you to visualize your garden from multiple perspectives before picking up a shovel:
- **Main Landscape Panorama** (`16:9`)
- **Pergola & Social Dining Perspective** (`4:3`)
- **Water Feature & Reflection Pond View** (`1:1`)
- **Vertical Trellis & Green Wall** (`9:16`)

### Conversational Image Editing
Don't like a detail in your render? Select the image and type instructions like:
- *"Add a rustic stone pathway winding toward the wooden pergola."*
- *"Shift time of day to golden hour twilight with fairy lights in the trees."*
- *"Add blooming pink Japanese cherry blossoms and a small koi pond."*

</details>

---

## 🎵 Lyria Music Soundscape Studio

<details>
<summary><b>Click to view Lyria AI Music Features</b></summary>
<br>

FloraScape is the first garden designer with native ambient soundscape composition:

```
                          ┌────────────────────────┐
                          │  Garden Visual / Mood  │
                          └───────────┬────────────┘
                                      │
                                      ▼
                      ┌────────────────────────────────┐
                      │    Lyria Music Generation      │
                      │  • lyria-3-clip-preview (30s)  │
                      │  • lyria-3-pro-preview (Track) │
                      └───────────────┬────────────────┘
                                      │
                                      ▼
                      ┌────────────────────────────────┐
                      │      Playable Audio & WAV      │
                      │   (Embedded in Garden Plan)    │
                      └────────────────────────────────┘
```

- **Presets**:
  - 🎋 *Zen Bamboo & Water Flute* (Japanese shakuhachi, koto harp, water droplets)
  - 🎻 *English Cottage Morning Strings* (Warm acoustic guitar, violin, birdsong)
  - 🎸 *Mediterranean Sunlit Guitar* (Flamenco nylon strings, summer breeze, cicadas)
  - 🌧️ *Raindrops on Lush Foliage* (Gentle rain, soothing cello chords, ambient chimes)
  - 🧚 *Twilight Garden Lanterns* (Ethereal piano, ambient pads, fireflies mood)
- **Image-to-Music**: Pass any generated garden visual as visual inspiration for the music model!

</details>

---

## 🔥 Firebase & Firestore Cloud Persistence

<details>
<summary><b>Click to view Firebase Architecture & Security Rules</b></summary>
<br>

FloraScape incorporates enterprise-grade Firestore security with Zero-Trust access control:

- **Authentication**: Google Sign-In via Firebase Auth.
- **Collections**:
  - `/users/{userId}`: User profile documents with identity validation.
  - `/gardens/{gardenId}`: Custom garden plans strictly restricted to document owner (`incoming().userId == request.auth.uid`).
- **Security Rules**: Enforced via hardened `firestore.rules` deployed directly through the Firebase management API.

```javascript
// Sample Firestore Security Rule from firestore.rules
match /gardens/{gardenId} {
  allow get, list: if isSignedIn() && resource.data.userId == request.auth.uid;
  allow create: if isSignedIn() && isValidGarden(incoming()) && incoming().userId == request.auth.uid;
  allow update: if isSignedIn() && isValidGarden(incoming()) && existing().userId == request.auth.uid;
  allow delete: if isSignedIn() && existing().userId == request.auth.uid;
}
```

</details>

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))
- Firebase Project credentials (configured in `firebase-applet-config.json`)

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/MKSanalytIQ/florascape.git
cd florascape

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and add your GEMINI_API_KEY

# 4. Start the full-stack development server
npm run dev
```

Visit `http://localhost:3000` to launch the application.

---

## 🚀 Deploying to Vercel

FloraScape is fully pre-configured for seamless zero-config deployment to [Vercel](https://vercel.com):

1. **Import Project**: In the Vercel Dashboard, click **Add New...** > **Project** and select `MKSanalytIQ/florascape`.
2. **Framework Preset**: Vercel will automatically detect `Vite` (defined in `vercel.json`).
3. **Environment Variables**: In the Vercel project deployment screen, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from [AI Studio](https://aistudio.google.com/).
4. **Deploy**: Click **Deploy**!
   - Frontend is compiled with `npm run build` and served at global edge.
   - Backend APIs (`/api/generate-garden`, `/api/generate-image`, `/api/edit-image`, `/api/generate-music`, `/api/health`) run as auto-scaling Vercel Serverless Functions via `/api/index.ts`.

---

## 📂 Project Structure

```
├── vercel.json                 # Vercel serverless functions & SPA routing configuration
├── api/
│   └── index.ts                # Vercel serverless function entry point
├── firebase-applet-config.json # Firebase connection credentials
├── firebase-blueprint.json     # Intermediate IR schema for Firestore
├── firestore.rules             # Hardened Zero-Trust Firestore ABAC rules
├── server.ts                   # Express server with Gemini & Lyria proxy endpoints
├── src/
│   ├── App.tsx                 # Main application controller & Firebase sync
│   ├── firebase.ts             # Firebase Auth & Firestore client setup
│   ├── components/
│   │   ├── BlueprintCanvas.tsx # Interactive 2D architectural SVG canvas
│   │   ├── VisualStudio.tsx    # Gemini image render & edit suite
│   │   ├── SoundtrackStudio.tsx# Lyria 3 music generator & audio player
│   │   ├── PlantCatalog.tsx    # Botanical specifications & companion pairs
│   │   ├── BloomTimeline.tsx   # 12-month flowering & harvesting schedule
│   │   ├── ShoppingChecklist.tsx# Material procurement & cost calculator
│   │   ├── GardenWizardModal.tsx# Multi-step dream garden design wizard
│   │   └── Header.tsx          # Brand, garden switcher & Google Auth badge
│   ├── data/presetGardens.ts   # Built-in architect designs (Cottage, Zen, etc.)
│   ├── services/
│   │   └── gardenFirestore.ts  # Firestore real-time CRUD subscriptions
│   └── types/garden.ts         # TypeScript botanical & architectural schemas
└── package.json
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Crafted with passion for nature, geometry, and generative AI.</sub>
</div>
