# ⚛️ Atomic Explorer

![Status](https://img.shields.io/badge/Status-Live-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Framework](https://img.shields.io/badge/Framework-React%20%7C%20Vite%20%7C%20Tailwind-cyan?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini%202.0-purple?style=for-the-badge)

> **An AI-powered, interactive chemistry platform designed to make the periodic table intuitive, visual, and engaging.**

**Atomic Explorer** is a production-grade web application that reimagines how chemistry is learned and explored. It combines **modern frontend engineering**, **real-time 3D visualization**, **generative AI**, and **gamification mechanics** to deliver an immersive, interview-ready showcase of full-stack and AI integration skills.

🔗 **Live Application:** [https://atomic-explorer.vercel.app](https://atomic-explorer.vercel.app)

---

## 🎯 Project Objective

The goal of Atomic Explorer is to demonstrate how complex scientific data can be transformed into a **user-centric, interactive learning experience** using modern web technologies. The project focuses on:

* Translating abstract chemistry concepts into visual and interactive components
* Integrating large language models responsibly for contextual learning
* Designing scalable, modular frontend architecture
* Delivering a polished, production-quality UI suitable for real-world deployment

---

## ✨ Core Features

### 🧪 Interactive Periodic Table

* Complete coverage of all **118 chemical elements**
* Categorized, responsive layout optimized for desktop and mobile
* Detailed element view including atomic structure, properties, and historical context
* **Real-time 3D atom rendering** using React Three Fiber

### 🔬 Virtual Chemistry Laboratory

* Drag-and-drop interface for simulating chemical reactions
* Hybrid reaction engine:

  * Deterministic logic for well-known reactions
  * AI-assisted reasoning for complex or exploratory combinations
* Visual feedback system for synthesis, combustion, and hazardous reactions

### 🤖 AI Chemist Assistant

* Embedded conversational AI interface
* Context-aware responses based on the currently selected element
* Powered by **Google Gemini 2.0** via OpenRouter
* Designed to support conceptual learning, not just factual lookup

### 🎮 Gamification & Learning Reinforcement

* Element Hunt: clue-based discovery to reinforce memorization
* Atomic War: strategy card game driven by atomic numbers
* Quiz modules to validate conceptual understanding

---

## 🧠 System Architecture (High-Level)

* **UI Layer:** Modular React components with Tailwind-based design system
* **Visualization Layer:** Three.js via React Three Fiber for atomic models
* **Logic Layer:** Hybrid rules + AI-driven reaction engine
* **AI Layer:** OpenRouter abstraction for LLM provider flexibility
* **Deployment Layer:** Optimized Vite build deployed on Vercel

---

## 🛠️ Technology Stack

| Category       | Tools & Technologies                        |
| -------------- | ------------------------------------------- |
| Frontend       | React 18, Vite                              |
| Styling        | Tailwind CSS (Custom Cyberpunk Theme)       |
| 3D Graphics    | React Three Fiber (Three.js)                |
| AI Integration | OpenRouter API (Google Gemini 2.0, Llama 3) |
| Icons          | Lucide React                                |
| Build & Deploy | Vercel                                      |

---

## 📂 Project Structure

```text
atomic-explorer/
├── src/
│   ├── assets/              # Images and sound effects
│   ├── components/
│   │   ├── 3D/              # Three.js atom visualizations
│   │   ├── Chat/            # AI assistant interface
│   │   ├── Gamification/    # Game logic and challenges
│   │   ├── Lab/             # Virtual lab modules
│   │   ├── Layout/          # Structural UI components
│   │   └── PeriodicTable/   # Periodic table views
│   ├── data/                # Static data and domain logic
│   ├── hooks/               # Custom React hooks
│   ├── services/            # External API integrations
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/MrCoss/atomic-explorer.git
cd atomic-explorer
```

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Run Locally

```bash
npm run dev
```

Access the app at **[http://localhost:5173](http://localhost:5173)**

---

## 🤝 Contributing

Contributions are welcome and encouraged.

* Fork the repository
* Create a feature branch
* Commit changes with clear messages
* Open a Pull Request for review

---

## 👤 Author

**Costas Pinto**
Full Stack Developer | AI & Frontend Engineering

* 🌐 Portfolio: [https://costas-portfolio-ai.vercel.app](https://costas-portfolio-ai.vercel.app)
* 🐙 GitHub: [https://github.com/MrCoss](https://github.com/MrCoss)
* 💼 LinkedIn: Costas Pinto

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
