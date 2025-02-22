import React, { useEffect, useState } from 'react';
import type { Game, Player } from '../types';
import { Crown, Trophy, Clock } from 'lucide-react';

interface StreaksAndWinnersProps {
  games: Game[];
  players: Player[];
}

const StreaksAndWinners: React.FC<StreaksAndWinnersProps> = ({ games, players }) => {
  const [newWinner, setNewWinner] = useState<string | null>(null);

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

  const longestStreakHolder = players.map(player => ({
    player,
    streak: getLongestStreak(player.id)
  })).sort((a, b) => b.streak - a.streak)[0];

  const activeWinStreakHolder = players.map(player => ({
    player,
    streak: getCurrentStreak(player.id)
  })).find(ps => ps.streak >= 2);

  useEffect(() => {
    const latestGame = games[games.length - 1];
    if (latestGame && latestGame.isFinished) {
      const winner = players.find(player => player.id === latestGame.winnerId);
      if (winner) {
        setNewWinner(winner.username);
        const timer = setTimeout(() => setNewWinner(null), 3000); // Clear the new winner message after 3 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [games, players]);

  const calculateDuration = (startTime: string, endTime: string | null): string => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000); // Duration in seconds

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., "Jan 1"
  };

  return (
    <div className="space-y-4">
      {longestStreakHolder && longestStreakHolder.streak >= 2 && (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Crown size={24} className="text-amber-500 animate-bounce" />
            <span className="ml-2 font-semibold">{longestStreakHolder.player.username} has the longest win streak!</span>
          </div>
          <div className="text-2xl font-bold">{longestStreakHolder.streak}</div>
        </div>
      )}
      {activeWinStreakHolder && activeWinStreakHolder.streak >= 2 && (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Crown size={24} className="text-amber-500 animate-bounce" />
            <span className="ml-2 font-semibold">{activeWinStreakHolder.player.username} has an active win streak!</span>
          </div>
          <div className="text-2xl font-bold">{activeWinStreakHolder.streak}</div>
        </div>
      )}
      <div className="bg-gray-100 shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Winners</h2>
        {newWinner && (
          <div className="bg-green-100 text-green-800 p-2 rounded-lg mb-2 animate-pulse">
            🎉 New Winner: {newWinner}!
          </div>
        )}
        <ul className="space-y-2">
          {games.filter(game => game.isFinished).slice(-3).reverse().map(game => {
            const winner = players.find(player => player.id === game.winnerId);
            const duration = calculateDuration(game.startTime, game.endTime);
            return (
              <li key={game.id} className="flex justify-between items-center bg-white rounded-lg p-2 shadow-sm">
                <div className="flex items-center">
                  <Trophy size={20} className="text-yellow-500 mr-2" />
                  <span className="font-medium">{winner ? winner.username : 'Unknown Player'} - 
                    <span className="text-xs text-gray-500 flex items-center ml-2">
                      <Clock size={16} className="mr-1" />
                      {duration}
                    </span>
                  </span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(game.date)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StreaksAndWinners; 