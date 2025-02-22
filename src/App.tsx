import React, { useState, useEffect } from 'react';
import { PlayerList } from './components/PlayerList';
import { GameCreator } from './components/GameCreator';
import { GameList } from './components/GameList';
import { Leaderboard } from './components/Leaderboard';
import { PlayerStats } from './components/PlayerStats';
import { RecentWinners } from './components/RecentWinners';
import type { Player, Game } from './types';

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

  const handleCreateGame = (gamePlayers: { playerId: string, color: string }[]) => {
    const newGame: Game = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      players: gamePlayers,
      winnerId: null,
      isFinished: false,
      startTime: new Date().toISOString(),
      endTime: null
    };
    
    setGames(prev => [...prev, newGame]);
    
    setPlayers(prev => prev.map(player => ({
      ...player,
      gamesPlayed: player.gamesPlayed + (gamePlayers.some(gp => gp.playerId === player.id) ? 1 : 0)
    })));
  };

  const handleFinishGame = (gameId: string, winnerId: string) => {
    setGames(prev => prev.map(game =>
      game.id === gameId 
        ? { 
            ...game, 
            winnerId, 
            isFinished: true,
            endTime: new Date().toISOString()
          } 
        : game
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
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Catan Leaderboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <PlayerList
            players={players}
            onAddPlayer={handleAddPlayer}
            onSelectPlayer={setSelectedPlayer}
            onToggleFavorite={handleToggleFavorite}
          />
          <GameCreator
            players={players}
            onCreateGame={handleCreateGame}
          />
        </div>

        <div className="space-y-6">
          <GameList
            games={games}
            players={players}
            onFinishGame={handleFinishGame}
          />
          <RecentWinners
            games={games}
            players={players}
          />
        </div>

        <div className="space-y-6">
          <Leaderboard players={players} />
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
  );
}

export default App;