import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Player, Game } from '../types';

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  onClose: () => void;
}

export function PlayerStats({ player, games, onClose }: PlayerStatsProps) {
  const playerGames = games.filter(game => 
    game.players.some(p => p.playerId === player.id)
  );

  const recentGames = playerGames.slice(-10).map(game => ({
    date: game.date,
    won: game.winnerId === player.id ? 1 : 0
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{player.username}'s Stats</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-sm text-blue-600 mb-2">Games Played</h3>
            <p className="text-3xl font-bold text-blue-900">{player.gamesPlayed}</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-sm text-green-600 mb-2">Games Won</h3>
            <p className="text-3xl font-bold text-green-900">{player.gamesWon}</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-sm text-purple-600 mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-purple-900">
              {player.gamesPlayed ? ((player.gamesWon / player.gamesPlayed) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentGames}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 1]} ticks={[0, 1]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="won"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Games</h3>
          {playerGames.slice(-5).reverse().map(game => (
            <div
              key={game.id}
              className={`p-4 rounded-lg ${
                game.winnerId === player.id ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{game.date}</span>
                <span className={game.winnerId === player.id ? 'text-green-600' : 'text-gray-600'}>
                  {game.winnerId === player.id ? 'Won' : 'Lost'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}