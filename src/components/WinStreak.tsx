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

  const getLongestStreak = (playerId: string): number => {
    const finishedGames = [...games]
      .filter(game => game.isFinished)
      .reverse();
    
    let longestStreak = 0;
    let currentStreak = 0;

    for (const game of finishedGames) {
      if (game.winnerId === playerId) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
    }
    return Math.max(longestStreak, currentStreak);
  };

  const currentStreakHolder = players.map(player => ({
    player,
    streak: getCurrentStreak(player.id)
  })).find(ps => ps.streak >= 2);

  const longestStreakHolder = players.map(player => ({
    player,
    streak: getLongestStreak(player.id)
  })).sort((a, b) => b.streak - a.streak)[0];

  return (
    <div className="flex justify-between space-x-4">
      {currentStreakHolder && (
        <div className="bg-white shadow-md rounded-lg p-4 flex-1">
          <h2 className="text-lg font-semibold">Current Win Streak</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame size={24} className="text-amber-500 animate-pulse" />
              <span className="ml-2">{currentStreakHolder.player.username} is on fire!</span>
            </div>
            <div className="text-2xl font-bold">{currentStreakHolder.streak}</div>
          </div>
        </div>
      )}
      {longestStreakHolder && longestStreakHolder.streak >= 2 && (
        <div className="bg-white shadow-md rounded-lg p-4 flex-1">
          <h2 className="text-lg font-semibold">Longest Win Streak</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown size={24} className="text-amber-500 animate-bounce" />
              <span className="ml-2">{longestStreakHolder.player.username} has the longest streak!</span>
            </div>
            <div className="text-2xl font-bold">{longestStreakHolder.streak}</div>
          </div>
        </div>
      )}
    </div>
  );
}