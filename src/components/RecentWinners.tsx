import React from 'react';
import type { Game, Player } from '../types';
import { Trophy, Clock, Users } from 'lucide-react';

interface RecentWinnersProps {
  games: Game[];
  players: Player[];
}

export function RecentWinners({ games, players }: RecentWinnersProps) {
  const getGameDuration = (game: Game): string => {
    if (!game.startTime || !game.endTime) return '';
    const start = new Date(game.startTime).getTime();
    const end = new Date(game.endTime).getTime();
    const durationMinutes = Math.round((end - start) / (1000 * 60));
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  const finishedGames = games.filter(game => game.isFinished);
  const recentWinners = finishedGames.slice(-3).reverse();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Recent Winners</h2>
      
      {recentWinners.length > 0 ? (
        <div className="space-y-4">
          {recentWinners.map(game => {
            const winner = players.find(p => p.id === game.winnerId);
            if (!winner) return null;
            
            return (
              <div key={game.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-yellow-500" />
                  <span className="font-medium">{winner.username}</span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Users size={14} />
                    {game.players.length} players
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {game.endTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {getGameDuration(game)}
                    </span>
                  )}
                  <span>
                    {new Date(game.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No games completed yet
        </div>
      )}
    </div>
  );
}
