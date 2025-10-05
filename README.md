# ⚡ Storma — Build AI Teams That Think With You

Welcome to **Storma**, the hackathon-born app where you spin up your idea and I make your *AI dream team* go to work.  
You can brief your **CEO agent**, who then orchestrates specialized AI teammates in **Finance**, **Sales/Marketing**, and **Tech** to refine, plan, and accelerate your startup concepts.

I am inspired by the 3rd project idea you gave me and turned it into a entrepreneur-helper-web-app-with-AI-agents kinda thing :D

---

## 🧠 The Concept

Here is how it works:
You type your business idea.  
The **Core (CEO)** agent breaks it down, generates prompts for three different specialized agents(not very specialized since I had limited time fine-tuning - only with system prompts lol):
- 💰 **Finance Agent** – Behvaes like a friendly CFO and evaluates the idea as a finance stakeholder 
- 📈 **Sales Agent** – Forecasts some sales shit and suggests a marketing strategy
- 💻 **Tech Agent** – Helps you think about the MVP and stack 

They all chat independently but sync through the CEO’s orchestration loop.  
It’s like a whole early-stage startup team inside the browser.

---

## 🚀 Tech Stack

- **Next.js 14 (App Router)**  
- **React + TypeScript**  
- **TailwindCSS** for styling  
- **Lucide Icons** for the slick minimal icons  
- **React Markdown + Remark GFM** for formatted AI replies  
- **Edge runtime** for lightning-fast API responses  
- **LocalStorage** for offline persistence  
- **OpenAI API (custom wrapper)** for agent communication  

---

## 🧪 Known Issues (but hey, it was a 24-hour sprint)

- Some agents occasionally forget who they are.  
- The CEO sometimes UNDER-explains because he just thinks he is always right.
- Chat history sync might have its “Elephant” moments.  
- Toast notifications are sometimes shy.  

---


PLEASE USE THESE CREDENTIALS:
acta@ozan.com
12345

## ⚙️ Setup

```bash
# Clone it
git clone https://github.com/yourname/storma.git
cd storma

# Install dependencies
npm install

# Run locally
npm run dev
