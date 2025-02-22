export interface Player {
  id: string;
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  isFavorite?: boolean;
}

export interface Game {
  id: string;
  date: string;
  players: GamePlayer[];
  winnerId: string | null;
  isFinished: boolean;
}

export interface GamePlayer {
  playerId: string;
  color: CatanColor;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  winRate: number;
  favoriteColor?: CatanColor;
  longestWinStreak: number;
  recentGames: Game[];
}

export type CatanColor = 'red' | 'blue' | 'white' | 'orange' | 'brown' | 'green';