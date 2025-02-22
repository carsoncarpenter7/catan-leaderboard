import React, { useState, useEffect } from 'react';
import { PlayerList } from './components/PlayerList';
import { GameCreator } from './components/GameCreator';
import { GameList } from './components/GameList';
import { Leaderboard } from './components/Leaderboard';
import { PlayerSearch } from './components/PlayerSearch';
import { PlayerStats } from './components/PlayerStats';
import type { Player, Game, GamePlayer } from './types';

function App() {
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
    setPlayers(prev => [...prev, {
      id: crypto.randomUUID(),
      username,
      gamesPlayed: 0,
      gamesWon: 0,
      isFavorite: false
    }]);
  };

  const handleEditPlayer = (id: string, newUsername: string) => {
    setPlayers(prev => prev.map(player =>
      player.id === id ? { ...player, username: newUsername } : player
    ));
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };

  const handleCreateGame = (gamePlayers: GamePlayer[]) => {
    const newGame: Game = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString(),
      players: gamePlayers,
      winnerId: null,
      isFinished: false
    };
    
    setGames(prev => [...prev, newGame]);
    
    setPlayers(prev => prev.map(player => ({
      ...player,
      gamesPlayed: player.gamesPlayed + (gamePlayers.some(gp => gp.playerId === player.id) ? 1 : 0)
    })));
  };

  const handleFinishGame = (gameId: string, winnerId: string) => {
    setGames(prev => prev.map(game =>
      game.id === gameId ? { ...game, winnerId, isFinished: true } : game
    ));
    
    setPlayers(prev => prev.map(player => ({
      ...player,
      gamesWon: player.gamesWon + (player.id === winnerId ? 1 : 0)
    })));
  };

  const handleToggleFavorite = (playerId: string) => {
    setPlayers(prev => prev.map(player =>
      player.id === playerId ? { ...player, isFavorite: !player.isFavorite } : player
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Catan Leaderboard
        </h1>
        
        <Leaderboard players={players} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PlayerSearch
            players={players}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlayer={setSelectedPlayer}
            onAddPlayer={handleAddPlayer}
          />
          
          <GameCreator
            players={players}
            onCreateGame={handleCreateGame}
          />
        </div>
        
        <GameList
          games={games}
          players={players}
          onFinishGame={handleFinishGame}
        />

        {selectedPlayer && (
          <PlayerStats
            player={selectedPlayer}
            games={games}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;