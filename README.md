🍔 ZESTIFY

(IFY - Items For You)

"What you see is exactly what you eat."

Zestify is a food discovery platform built to end the decision fatigue of scrolling through fake studio photos and meaningless ratings. It replaces static menus with real-person vlogs and kitchen behind-the-scenes, so your next meal is a visual certainty, not a gamble.

⚡ Quick Highlights

⏱️ Decide what to eat in under 60 seconds

❌ No fake studio photos

🎯 IFY (Items For You) personalization engine

🗺️ The Zestify Flow

To help users decide faster, Zestify follows a high-speed discovery logic:

graph LR
    A[Open App] --> B{IFY Engine}
    B --> C[Vlog Feed]
    C --> D[Watch Kitchen BTS]
    D --> E[Real Person Review]
    E --> F[Decision < 60s]
    F --> G[Order Placed]
    
    style B fill:#f96,stroke:#333,stroke-width:2px
    style F fill:#00ff00,stroke:#333,stroke-width:2px


🧠 Philosophy

🎥 Real over polished

Watch actual people eat, review, and react — not actors or edited photos.

🍳 Kitchen transparency

See the real cooking process — the sizzle, spice, and plating.

🎯 Expectation = Reality

What you see on screen is what you get on your plate.

🚀 Features

🎥 Vlog-first feed: Vertical scrolling of real food vlogs and reviews.

⚡ Decide in under 60s: Immersive UI designed for fast decision-making.

🎯 IFY personalization: A discovery engine that learns your taste and shows relevant food.

🔐 Just-in-time auth: Browse freely, login only when you're ready to engage.

🏗️ System Architecture

graph TD
    User((User)) <--> FE[React + Vite Frontend]
    FE <--> FB_Auth[Firebase Auth]
    FE <--> FB_DB[(Firestore / Realtime DB)]
    FE <--> V_CDN[Vercel / Cloudinary Video CDN]
    
    subgraph "Backend Logic"
    FB_DB --- IFY[IFY Recommendation Logic]
    end


🛠️ Tech Stack

Frontend: React.js + Vite

Styling: Tailwind CSS

Authentication: Firebase Auth

State Management: React Hooks

Deployment: Vercel

⚙️ Setup & Installation

1. Clone & Install

# Clone the repository
git clone [https://github.com/shrootee/ZESTIFY.git](https://github.com/shrootee/ZESTIFY.git)

# Go into the folder
cd ZESTIFY

# Install dependencies
npm install


2. Configure Environment

# Add environment variables
cp .env.example .env


3. Run the App

# Start dev server
npm run dev


💡 Vision

Ordering food shouldn’t feel like a chore — or a gamble. Zestify combines vlog-based transparency and personalized recommendations to make every food decision fast, confident, and real.

✨ Author

Shruti Gujrathi
CSE Student • Full-Stack • Product Enthusiast
