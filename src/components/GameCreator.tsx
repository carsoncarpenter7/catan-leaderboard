import React, { useState } from 'react';
import { User, X, Plus } from 'lucide-react';
import type { Player } from '../types';

interface GameCreatorProps {
  players: Player[];
  onCreateGame: (players: { playerId: string; color: string }[]) => void;
}

const CATAN_COLORS = ['red', 'blue', 'white', 'orange', 'brown', 'green'] as const;

export function GameCreator({ players, onCreateGame }: GameCreatorProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Array<{
    playerId: string;
    color: string;
  }>>([]);

  const availableColors = CATAN_COLORS.filter(
    color => !selectedPlayers.some(p => p.color === color)
  );

  const availablePlayers = players.filter(
    player => !selectedPlayers.some(p => p.playerId === player.id)
  );

  const handleAddPlayer = (playerId: string) => {
    setSelectedPlayers(prev => [...prev, { playerId, color: '' }]);
  };

  const handleColorSelect = (playerId: string, color: string) => {
    setSelectedPlayers(prev => prev.map(p => 
      p.playerId === playerId ? { ...p, color } : p
    ));
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p.playerId !== playerId));
  };

  const handleStartGame = () => {
    const allPlayersHaveColors = selectedPlayers.every(p => p.color);
    if (selectedPlayers.length >= 3 && allPlayersHaveColors) {
      onCreateGame(selectedPlayers);
      setSelectedPlayers([]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Start New Game</h2>
        {availablePlayers.length > 0 && (
          <div className="relative group">
            <select
              className="appearance-none text-sm pl-3 pr-9 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg 
                hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm 
                hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onChange={(e) => {
                if (e.target.value) {
                  handleAddPlayer(e.target.value);
                }
              }}
              value=""
            >
              <option value="" disabled>Add Player</option>
              {availablePlayers.map(player => (
                <option 
                  key={player.id} 
                  value={player.id}
                  className="text-gray-900 bg-white"
                >
                  {player.username}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white pointer-events-none">
              <Plus size={16} />
            </div>
          </div>
        )}
      </div>

      {/* Selected Players */}
      <div className="space-y-2 mb-6">
        {selectedPlayers.map(({ playerId, color }) => {
          const player = players.find(p => p.id === playerId);
          return (
            <div 
              key={playerId}
              className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: color || '#f3f4f6',
                    color: color ? 'white' : '#6b7280'
                  }}
                >
                  <User size={16} />
                </div>
                <span className="font-medium text-gray-900">{player?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={color}
                  onChange={(e) => handleColorSelect(playerId, e.target.value)}
                  className="text-sm p-1.5 rounded-md border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  style={{ 
                    borderColor: color || undefined,
                    backgroundColor: color ? `${color}10` : undefined 
                  }}
                >
                  <option value="">Select color...</option>
                  {CATAN_COLORS.filter(c => 
                    c === color || !selectedPlayers.some(p => p.color === c)
                  ).map(c => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemovePlayer(playerId)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Game Button */}
      <button
        onClick={handleStartGame}
        disabled={selectedPlayers.length < 3 || !selectedPlayers.every(p => p.color)}
        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors font-medium"
      >
        {selectedPlayers.length < 3
          ? 'Select at least 3 players'
          : !selectedPlayers.every(p => p.color)
          ? 'Select colors for all players'
          : `Start Game with ${selectedPlayers.length} Players`}
      </button>
    </div>
  );
}