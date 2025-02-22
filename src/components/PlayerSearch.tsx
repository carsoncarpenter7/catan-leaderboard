import React, { useState } from 'react';
import { Search, Star, StarOff, UserPlus, X } from 'lucide-react';
import type { Player } from '../types';

interface PlayerSearchProps {
  players: Player[];
  onToggleFavorite: (playerId: string) => void;
  onSelectPlayer: (player: Player) => void;
  onAddPlayer: (username: string) => void;
}

export function PlayerSearch({ players, onToggleFavorite, onSelectPlayer, onAddPlayer }: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
      setIsAddingPlayer(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {isAddingPlayer ? (
          <form onSubmit={handleAddPlayer} className="relative">
            <input
              type="text"
              placeholder="Enter player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingPlayer(false);
                  setNewPlayerName('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              <button
                type="submit"
                disabled={!newPlayerName.trim()}
                className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingPlayer(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            <UserPlus size={20} />
            <span>Add New Player</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map(player => (
          <div
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            className="bg-gray-50 rounded-xl p-6 cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-800">{player.username}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(player.id);
                }}
                className="text-yellow-400 hover:text-yellow-500 transition-colors"
              >
                {player.isFavorite ? <Star size={20} fill="currentColor" /> : <StarOff size={20} />}
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Games Played</span>
                <span className="font-medium">{player.gamesPlayed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Win Rate</span>
                <span className="font-medium">
                  {player.gamesPlayed ? ((player.gamesWon / player.gamesPlayed) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}