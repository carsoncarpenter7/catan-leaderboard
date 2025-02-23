# 🎲 Catan Leaderboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)

(https://stackblitz.com/~/github.com/carsoncarpenter7/catan-leaderboard)


git add .
git commit -m "Describe your changes here"
git push origin main 

## 📋 Project Overview

Catan Leaderboard is a modern web application designed to track and manage player statistics, game results, and rankings for Settlers of Catan games. Whether you're organizing regular game nights or running tournaments, this application helps you maintain a comprehensive record of player performances and competitive standings.

![Catan Leaderboard Dashboard](https://gyazo.com/6baf37e3b573e5ee894e1d652504575f)


## ✨ Features

- **Player Management**
  - Create and manage player profiles
  - Track individual player statistics
  - View player history and performance trends
 
  ![Player Stats](https://gyazo.com/0c2e02dc800ef59ce0a50e93018d6b9b) 

- **Game Tracking**
  - Record game results and outcomes
  - Track victory points, longest road, and largest army achievements
  - Log resource collection and trading statistics
 
  ![Recent Games](https://gyazo.com/387c201735d7e5cac1a8016c408aede8)

- **Leaderboard System**
  - Real-time rankings based on player performance
  - Multiple ranking criteria (wins, VP ratio, etc.)
  - Historical ranking trends

- **Analytics Dashboard**
  - Visual statistics and charts
  - Player performance comparisons
  - Game duration and outcome analysis
 
![Game History]([https://gyazo.com/387c201735d7e5cac1a8016c408aede8)

## 🛠 Technologies Used

- **Frontend**
  - React 18.3
  - TypeScript 5.5
  - Vite 5.4
  - TailwindCSS
  - Lucide React (for icons)

- **Backend**
  - Node.js
  - Supabase (Database & Authentication)
  - RESTful API

- **Testing & Quality**
  - Vitest
  - ESLint
  - TypeScript strict mode

## 📥 Installation Guide

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/catan-leaderboard.git
   cd catan-leaderboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in the `.env` file.

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎮 Usage Instructions

1. **Recording Games**
   - Click "New Game" to start recording a game session
   - Add players and their respective positions
   - Input game results and statistics
   - Submit to update leaderboard

2. **Viewing Statistics**
   - Navigate to the Dashboard for overall statistics
   - Visit player profiles for individual performance
   - Use filters to analyze specific time periods or game types
   - Extensive Game History to track all games and previous winers and losers.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

