import React, { useState, useEffect } from 'react';
import { PlayerList } from './components/PlayerList';
import { GameCreator } from './components/GameCreator';
import { GameList } from './components/GameList';
import { Leaderboard } from './components/Leaderboard';
import { PlayerStats } from './components/PlayerStats';
import StreaksAndWinners from './components/StreaksAndWinners';
import type { Player, Game } from './types';

function App() {
  const [showGameCreator, setShowGameCreator] = useState(false);
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('players');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('games');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('games', JSON.stringify(games));
  }, [players, games]);

  const handleAddPlayer = (username: string) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      username,
      gamesPlayed: 0,
      gamesWon: 0,
      isFavorite: false,
      currentWinStreak: 0,
      longestWinStreak: 0
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleCreateGame = (selectedPlayers: { playerId: string; color: string }[]) => {
    const newGame: Game = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      players: selectedPlayers,
      winnerId: null,
      isFinished: false,
      startTime: new Date().toISOString(),
      endTime: null
    };
    setGames(prev => [...prev, newGame]);
  };

  const handleFinishGame = (gameId: string, winnerId: string) => {
    setGames(prev => prev.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          winnerId,
          isFinished: true,
          endTime: new Date().toISOString()
        };
      }
      return game;
    }));

    // Update player stats
    setPlayers(prev => prev.map(player => {
      if (player.id === winnerId) {
        return {
          ...player,
          gamesWon: player.gamesWon + 1,
          gamesPlayed: player.gamesPlayed + 1,
          currentWinStreak: player.currentWinStreak + 1,
          longestWinStreak: Math.max(player.longestWinStreak, player.currentWinStreak + 1)
        };
      }
      const playedThisGame = games
        .find(g => g.id === gameId)
        ?.players.some(p => p.playerId === player.id);
      if (playedThisGame) {
        return {
          ...player,
          gamesPlayed: player.gamesPlayed + 1,
          currentWinStreak: 0
        };
      }
      return player;
    }));
  };

  const handleEditWinner = (gameId: string, newWinnerId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    const oldWinnerId = game.winnerId;

    // Update game winner
    setGames(prev => prev.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          winnerId: newWinnerId
        };
      }
      return game;
    }));

    // Update player stats
    setPlayers(prev => prev.map(player => {
      if (player.id === oldWinnerId) {
        // Decrement previous winner's stats
        return {
          ...player,
          gamesWon: Math.max(0, player.gamesWon - 1),
          currentWinStreak: 0
        };
      }
      if (player.id === newWinnerId) {
        // Increment new winner's stats
        return {
          ...player,
          gamesWon: player.gamesWon + 1,
          currentWinStreak: player.currentWinStreak + 1
        };
      }
      return player;
    }));
  };

  const handleToggleFavorite = (playerId: string) => {
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        return { ...player, isFavorite: !player.isFavorite };
      }
      return player;
    }));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Catan Leaderboard</h1>
        <button
          onClick={() => setShowGameCreator(true)}
          className="text-sm pl-3 pr-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg 
            hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm 
            hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Start New Game
        </button>
      </div>

      {/* Game Creator Modal */}
      {showGameCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-lg w-full mx-4">
            <div className="relative">
              <button
                onClick={() => setShowGameCreator(false)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
              <GameCreator
                players={players}
                onCreateGame={(selectedPlayers) => {
                  handleCreateGame(selectedPlayers);
                  setShowGameCreator(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Players Leaderboard at the top of all columns */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 mb-6">
          <Leaderboard players={players} />
        </div>

        {/* Combined Streaks and Winners Column */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 mb-6">
          <StreaksAndWinners games={games} players={players} />
        </div>

        {/* Left Column */}
        <div className="space-y-6">
          <PlayerList
            players={players}
            onAddPlayer={handleAddPlayer}
            onSelectPlayer={setSelectedPlayer}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col items-end">
          <div className="mb-4">
            {selectedPlayer && (
              <PlayerStats
                player={selectedPlayer}
                games={games}
                players={players}
                onClose={() => setSelectedPlayer(null)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Game History at the bottom */}
      <div className="mt-8">
        <GameList
          games={games}
          players={players}
          onFinishGame={handleFinishGame}
          onEditWinner={handleEditWinner}
        />
      </div>
    </div>
  );
}

export default App;