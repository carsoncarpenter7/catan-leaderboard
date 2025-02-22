import React from 'react';
import type { Game, Player } from '../types';
import { Trophy, Star, Medal } from 'lucide-react';

interface LongestStreakProps {
  games: Game[];
  players: Player[];
}

export function LongestStreak({ games, players }: LongestStreakProps) {
  const getLongestStreak = () => {
    let longestStreak = {
      player: null as Player | null,
      streak: 0,
      endDate: null as Date | null
    };

    players.forEach(player => {
      let currentStreak = 0;
      let maxStreak = 0;
      let streakEndDate = null;
      
      const playerGames = [...games]
        .filter(game => game.isFinished)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      playerGames.forEach(game => {
        if (game.winnerId === player.id) {
          currentStreak++;
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
            streakEndDate = new Date(game.date);
          }
        } else {
          currentStreak = 0;
        }
      });

      if (maxStreak > longestStreak.streak) {
        longestStreak = {
          player,
          streak: maxStreak,
          endDate: streakEndDate
        };
      }
    });

    return longestStreak.player ? longestStreak : null;
  };

  const longestStreak = getLongestStreak();

  if (!longestStreak || longestStreak.streak < 2) return null;

  return (
    <div className="relative group max-w-2xl mx-auto">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-xl shadow-lg p-4 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/30 to-indigo-600/20 blur-xl animate-gradient"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              size={6}
              className="absolute text-indigo-200/30 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Trophy 
                size={28} 
                className="text-indigo-200 animate-pulse"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.5))',
                }}
              />
              <div className="absolute -top-1 -right-1">
                <Medal size={12} className="text-indigo-200/70 animate-bounce" />
              </div>
            </div>
            <div>
              <div className="text-white/90 font-bold text-sm">
                All-Time Longest Streak
              </div>
              <div className="flex items-center gap-2 text-indigo-100 font-medium text-base">
                {longestStreak.player.username}'s Record
              </div>
            </div>
          </div>
          <div className="flex items-center pl-4">
            <div 
              className="flex items-center gap-2 transition-all duration-300 group-hover:scale-110"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
            >
              <span className="text-2xl font-bold text-white leading-none">
                {longestStreak.streak}
              </span>
              <span className="text-lg font-medium text-indigo-100 leading-none">
                Consecutive Wins
              </span>
            </div>
          </div>
        </div>
        <div className="text-right text-[10px] text-indigo-200/80 mt-1">
          {longestStreak.endDate?.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
} 