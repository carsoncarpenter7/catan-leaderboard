import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Player {
  name: string;
  color: string;
}

interface Game {
  id: string;
  date: string;
  players: Player[];
  status: "in_progress" | "completed";
}

export function GameView() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const games = JSON.parse(localStorage.getItem('games') || '[]');
    const currentGame = games.find((g: Game) => g.id === id);
    setGame(currentGame || null);
  }, [id]);

  if (!game) {
    return <div className="p-4">Game not found</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Game in Progress</h2>
      <div className="space-y-2">
        {game.players.map((player) => (
          <div 
            key={player.name}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: player.color }}
            />
            <span>{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 