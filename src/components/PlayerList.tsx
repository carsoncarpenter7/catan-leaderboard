import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onAddPlayer: (username: string) => void;
  onEditPlayer: (id: string, newUsername: string) => void;
  onDeletePlayer: (id: string) => void;
}

export function PlayerList({ players, onAddPlayer, onEditPlayer, onDeletePlayer }: PlayerListProps) {
  const [newUsername, setNewUsername] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      onAddPlayer(newUsername.trim());
      setNewUsername('');
    }
  };

  const handleEdit = (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setEditingId(id);
      setEditUsername(player.username);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (editUsername.trim()) {
      onEditPlayer(id, editUsername.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Enter player name"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} /> Add Player
        </button>
      </form>

      <div className="space-y-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            {editingId === player.id ? (
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                onBlur={() => handleSaveEdit(player.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(player.id)}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <div>
                <h3 className="font-semibold">{player.username}</h3>
                <p className="text-sm text-gray-600">
                  Games: {player.gamesPlayed} | Win Rate: {player.gamesPlayed ? ((player.gamesWon / player.gamesPlayed) * 100).toFixed(1) : 0}%
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(player.id)}
                className="p-2 text-gray-600 hover:text-blue-500"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => onDeletePlayer(player.id)}
                className="p-2 text-gray-600 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}