import React from 'react';
import type { Game, Player } from '../types';
import { Flame, Crown, Star } from 'lucide-react';

interface WinStreakProps {
  games: Game[];
  players: Player[];
}

export function WinStreak({ games, players }: WinStreakProps) {
  const getCurrentStreak = (playerId: string): number => {
    const finishedGames = [...games]
      .filter(game => game.isFinished)
      .reverse();
    
    let streak = 0;
    for (const game of finishedGames) {
      if (game.winnerId === playerId) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getStreakHolder = () => {
    const playerStreaks = players.map(player => ({
      player,
      streak: getCurrentStreak(player.id)
    }));

    const highestStreak = playerStreaks
      .filter(ps => ps.streak >= 2)
      .sort((a, b) => b.streak - a.streak)[0];

    return highestStreak;
  };

  const currentStreak = getStreakHolder();

  if (!currentStreak) return null;

  return (
    <div className="relative group max-w-2xl mx-auto">
      {/* Sparkle effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-xl shadow-lg p-4 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-amber-600/30 to-orange-600/20 blur-xl animate-gradient"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              size={6}
              className="absolute text-amber-200/30 animate-float"
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
              <Flame 
                size={28} 
                className="text-amber-200 animate-pulse"
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))',
                }}
              />
              {/* Decorative flames */}
              <div className="absolute -top-1 -right-1">
                <Flame size={12} className="text-amber-200/70 animate-bounce" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Flame size={10} className="text-amber-200/60 animate-bounce" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
            <div>
              <div className="text-white/90 font-bold text-sm">
                Current Win Streak
              </div>
              <div className="flex items-center gap-2 text-amber-100 font-medium text-base">
                {currentStreak.player.username} is on fire!
                <Crown 
                  size={14} 
                  className="text-amber-200 animate-bounce" 
                  style={{ animationDuration: '2s' }} 
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end pl-4">
            <div 
              className="text-4xl font-bold text-white transition-all duration-300 group-hover:scale-110"
              style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {currentStreak.streak}
              <span className="text-xs font-medium ml-2 text-amber-100">consecutive wins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}