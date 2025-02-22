import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import type { Player, CatanColor, GamePlayer } from '../types';

interface GameCreatorProps {
  players: Player[];
  onCreateGame: (players: GamePlayer[]) => void;
}

const CATAN_COLORS: CatanColor[] = ['red', 'blue', 'white', 'orange', 'brown', 'green'];

export function GameCreator({ players, onCreateGame }: GameCreatorProps) {
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [selectedPlayers, setSelectedPlayers] = useState<GamePlayer[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handlePlayerSelect = (playerId: string, color: CatanColor) => {
    setSelectedPlayers(prev => {
      const existing = prev.find(p => p.playerId === playerId);
      if (existing) {
        return prev.map(p => p.playerId === playerId ? { ...p, color } : p);
      }
      if (prev.length < playerCount) {
        return [...prev, { playerId, color }];
      }
      return prev;
    });
  };

  const handleCreateGame = () => {
    if (selectedPlayers.length === playerCount) {
      onCreateGame(selectedPlayers);
      setSelectedPlayers([]);
      setIsSelecting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">New Game</h2>
      
      {!isSelecting ? (
        <div className="flex gap-4 items-center">
          <select
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
            <option value={5}>5 Players</option>
            <option value={6}>6 Players</option>
          </select>
          
          <button
            onClick={() => setIsSelecting(true)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Trophy size={20} /> Start Game
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold">Select Players and Colors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: playerCount }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <select
                  value={selectedPlayers[index]?.playerId || ''}
                  onChange={(e) => handlePlayerSelect(e.target.value, selectedPlayers[index]?.color || CATAN_COLORS[index])}
                  className="w-full px-3 py-2 border rounded-md mb-2"
                >
                  <option value="">Select Player</option>
                  {players.map(player => (
                    <option
                      key={player.id}
                      value={player.id}
                      disabled={selectedPlayers.some(p => p.playerId === player.id && p.playerId !== selectedPlayers[index]?.playerId)}
                    >
                      {player.username}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedPlayers[index]?.color || CATAN_COLORS[index]}
                  onChange={(e) => handlePlayerSelect(selectedPlayers[index]?.playerId || '', e.target.value as CatanColor)}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!selectedPlayers[index]}
                >
                  {CATAN_COLORS.map(color => (
                    <option
                      key={color}
                      value={color}
                      disabled={selectedPlayers.some(p => p.color === color && p.playerId !== selectedPlayers[index]?.playerId)}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsSelecting(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGame}
              disabled={selectedPlayers.length !== playerCount}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}