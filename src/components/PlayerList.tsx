import React, { useState } from 'react';
import { Star, Plus, User } from 'lucide-react';
import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onSelectPlayer: (player: Player) => void;
  onToggleFavorite: (playerId: string) => void;
}

export function PlayerList({ players, onAddPlayer, onSelectPlayer, onToggleFavorite }: PlayerListProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
      setIsAdding(false);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) {
      return a.username.localeCompare(b.username);
    }
    return a.isFavorite ? -1 : 1;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Player Stats</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} />
          Add Player
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Player name"
              className="flex-1 rounded-lg border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewPlayerName('');
              }}
              className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {sortedPlayers.map(player => (
          <div 
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <User size={16} />
              </div>
              <span className="font-medium text-gray-900">{player.username}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(player.id);
              }}
              className={`p-1 rounded-md transition-colors ${
                player.isFavorite 
                  ? 'text-amber-400 hover:bg-amber-50' 
                  : 'text-gray-400 hover:bg-gray-100 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Star size={16} fill={player.isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}