import React, { useState } from 'react';
import { Clock, Trophy, Edit2, User, X, Search } from 'lucide-react';
import type { Game, Player } from '../types';

interface GameListProps {
  games: Game[];
  players: Player[];
  onFinishGame: (gameId: string, winnerId: string) => void;
  onEditWinner: (gameId: string, winnerId: string) => void;
}

export function GameList({ games, players, onFinishGame, onEditWinner }: GameListProps) {
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player?.username || 'Unknown Player';
  };

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

  // Filter and sort games
  const filteredGames = games
    .filter(game => {
      // Status filter
      if (filterStatus === 'completed' && !game.isFinished) return false;
      if (filterStatus === 'in-progress' && game.isFinished) return false;

      // Search filter
      if (searchQuery) {
        const playerNames = game.players.map(p => getPlayerName(p.playerId).toLowerCase());
        const searchLower = searchQuery.toLowerCase();
        return playerNames.some(name => name.includes(searchLower));
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Game History</h2>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{games.length} Total Games</span>
          <span>{games.filter(g => g.isFinished).length} Completed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          className="text-sm border rounded-lg px-3 py-1.5"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Games</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
        </select>
        <input 
          type="search" 
          placeholder="Search games..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm border rounded-lg px-3 py-1.5 flex-1"
        />
      </div>
      
      {/* Games List */}
      <div className="space-y-4">
        {filteredGames.map((game, index) => (
          <div 
            key={game.id}
            className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full text-sm">
                  Game {filteredGames.length - index}
                </div>
                <span className="text-gray-500">
                  {new Date(game.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              {game.endTime && (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock size={14} />
                  <span className="text-sm">{getGameDuration(game)}</span>
                </div>
              )}
            </div>

            {/* Winner Section */}
            {game.isFinished ? (
              <div className="bg-gradient-to-r from-amber-50 via-amber-50 to-transparent p-3 rounded-xl border border-amber-100 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {getPlayerName(game.winnerId!)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Winner
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingGameId(game.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500 opacity-20 animate-pulse" />
                  </div>
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <select
                  className="w-full text-sm border rounded-lg p-2 bg-white"
                  onChange={(e) => onFinishGame(game.id, e.target.value)}
                  value=""
                >
                  <option value="">Select winner...</option>
                  {game.players.map(p => (
                    <option key={p.playerId} value={p.playerId}>
                      {getPlayerName(p.playerId)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Edit Winner Modal */}
            {editingGameId === game.id && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Select New Winner</span>
                  <button
                    onClick={() => setEditingGameId(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                  >
                    <X size={14} />
                  </button>
                </div>
                <select
                  className="w-full text-sm border rounded-lg p-2 bg-white"
                  onChange={(e) => {
                    onEditWinner(game.id, e.target.value);
                    setEditingGameId(null);
                  }}
                  value={game.winnerId || ''}
                >
                  {game.players.map(p => (
                    <option key={p.playerId} value={p.playerId}>
                      {getPlayerName(p.playerId)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Player List */}
            <div className="grid grid-cols-2 gap-3">
              {game.players.map(gamePlayer => (
                <div 
                  key={gamePlayer.playerId}
                  className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors ${
                    game.winnerId === gamePlayer.playerId 
                      ? 'bg-amber-50 border border-amber-100' 
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: gamePlayer.color }}
                  >
                    <User size={14} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {getPlayerName(gamePlayer.playerId)}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {gamePlayer.color}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredGames.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            {searchQuery 
              ? 'No games found matching your search'
              : 'No games yet'}
          </div>
        )}
      </div>
    </div>
  );
}