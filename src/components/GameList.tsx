import React from 'react';
import { Trophy } from 'lucide-react';
import type { Game, Player } from '../types';

interface GameListProps {
  games: Game[];
  players: Player[];
  onFinishGame: (gameId: string, winnerId: string) => void;
}

export function GameList({ games, players, onFinishGame }: GameListProps) {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.username || 'Unknown Player';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Games</h2>
      
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">{game.date}</span>
              {game.isFinished && (
                <div className="flex items-center gap-2 text-green-600">
                  <Trophy size={20} />
                  <span>{getPlayerName(game.winnerId!)}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {game.players.map((gamePlayer) => (
                <div
                  key={gamePlayer.playerId}
                  className={`p-2 rounded-lg text-center ${
                    game.winnerId === gamePlayer.playerId ? 'bg-green-100' : 'bg-gray-50'
                  }`}
                  style={{ borderLeft: `4px solid ${gamePlayer.color}` }}
                >
                  {getPlayerName(gamePlayer.playerId)}
                </div>
              ))}
            </div>
            
            {!game.isFinished && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Winner
                </label>
                <select
                  onChange={(e) => onFinishGame(game.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue=""
                >
                  <option value="" disabled>Choose winner...</option>
                  {game.players.map((gamePlayer) => (
                    <option key={gamePlayer.playerId} value={gamePlayer.playerId}>
                      {getPlayerName(gamePlayer.playerId)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}