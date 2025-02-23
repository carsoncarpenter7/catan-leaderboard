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

![Catan Leaderboard Dashboard](https://images.unsplash.com/photo-1637425141051-46aec2f7bc65?w=1200&h=600&fit=crop)

## ✨ Features

- **Player Management**
  - Create and manage player profiles
  - Track individual player statistics
  - View player history and performance trends

- **Game Tracking**
  - Record game results and outcomes
  - Track victory points, longest road, and largest army achievements
  - Log resource collection and trading statistics

- **Leaderboard System**
  - Real-time rankings based on player performance
  - Multiple ranking criteria (wins, VP ratio, etc.)
  - Historical ranking trends

- **Tournament Support**
  - Create and manage tournaments
  - Automatic bracket generation
  - Tournament-specific leaderboards

- **Analytics Dashboard**
  - Visual statistics and charts
  - Player performance comparisons
  - Game duration and outcome analysis

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

1. **User Registration/Login**
   - Create an account or log in using existing credentials
   - Complete your player profile

2. **Recording Games**
   - Click "New Game" to start recording a game session
   - Add players and their respective positions
   - Input game results and statistics
   - Submit to update leaderboard

3. **Viewing Statistics**
   - Navigate to the Dashboard for overall statistics
   - Visit player profiles for individual performance
   - Use filters to analyze specific time periods or game types

## 🔌 API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Player Endpoints

```typescript
GET /api/players
GET /api/players/:id
POST /api/players
PUT /api/players/:id
```

### Game Endpoints

```typescript
GET /api/games
POST /api/games
GET /api/games/:id
PUT /api/games/:id
```


## 🤝 Contributing Guidelines

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests
- Updates documentation as needed
- Describes the changes made

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact Informat
