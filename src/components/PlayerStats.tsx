import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';
import type { Player, Game } from '../types';

interface PlayerStatsProps {
  player: Player;
  games: Game[];
  players: Player[];
  onClose: () => void;
}

export function PlayerStats({ player, games, players, onClose }: PlayerStatsProps) {
  const playerGames = games.filter(game => 
    game.players.some(p => p.playerId === player.id)
  );

  const formatDuration = (durationMinutes: number) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getGameDurationMinutes = (game: Game): number => {
    if (!game.endTime || !game.startTime) return 0;
    const start = new Date(game.startTime).getTime();
    const end = new Date(game.endTime).getTime();
    return Math.round((end - start) / (1000 * 60));
  };

  const getGameDurationStats = () => {
    const wonGames = playerGames.filter(game => 
      game.isFinished && 
      game.winnerId === player.id && 
      game.endTime &&
      game.startTime
    );

    if (wonGames.length === 0) {
      return {
        shortest: null,
        longest: null,
        average: null
      };
    }

    const durations = wonGames.map(getGameDurationMinutes).filter(duration => duration > 0);
    
    if (durations.length === 0) {
      return {
        shortest: null,
        longest: null,
        average: null
      };
    }

    const shortest = Math.min(...durations);
    const longest = Math.max(...durations);
    const average = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);

    return {
      shortest,
      longest,
      average
    };
  };

  const getLongestWinStreak = () => {
    const finishedGames = games
      .filter(game => game.isFinished && game.players.some(p => p.playerId === player.id))
      .map(game => game.winnerId === player.id);
    
    let currentStreak = 0;
    let maxStreak = 0;
    
    finishedGames.forEach(isWin => {
      if (isWin) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  const getWinsByColor = () => {
    const wins = playerGames
      .filter(game => game.winnerId === player.id)
      .reduce((acc, game) => {
        const playerColor = game.players.find(p => p.playerId === player.id)?.color;
        if (playerColor) {
          acc[playerColor] = (acc[playerColor] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(wins).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  };

  const getFavoriteColor = () => {
    if (playerGames.length === 0) return null;

    const colorCounts = playerGames.reduce((acc, game) => {
      const playerColor = game.players.find(p => p.playerId === player.id)?.color;
      if (playerColor) {
        acc[playerColor] = (acc[playerColor] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(colorCounts).length === 0) return null;

    const [favoriteColor, count] = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      color: favoriteColor,
      count,
      percentage: Math.round((count / playerGames.length) * 100)
    };
  };

  const recentGames = playerGames.slice(-10).map(game => ({
    date: new Date(game.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    won: game.winnerId === player.id ? 1 : 0
  }));

  const durationStats = getGameDurationStats();
  const [bestColor, bestColorWins] = getWinsByColor();
  const favoriteColorStats = getFavoriteColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{player.username}</h2>
            <p className="text-gray-500">Player Statistics</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-blue-600 mb-2 font-medium">Games Played</h3>
            <p className="text-3xl font-bold text-blue-900">{player.gamesPlayed}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-green-600 mb-2 font-medium">Games Won</h3>
            <p className="text-3xl font-bold text-green-900">{player.gamesWon}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-orange-600 mb-2 font-medium">Longest Win Streak</h3>
            <p className="text-3xl font-bold text-orange-900">{getLongestWinStreak()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-purple-600 mb-2 font-medium">Win Rate</h3>
            <p className="text-3xl font-bold text-purple-900">
              {player.gamesPlayed ? ((player.gamesWon / player.gamesPlayed) * 100).toFixed(1) : 0}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-indigo-600 mb-2 font-medium">Fastest Win</h3>
            <p className="text-3xl font-bold text-indigo-900">
              {durationStats.shortest ? formatDuration(durationStats.shortest) : '-'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-rose-600 mb-2 font-medium">Longest Win</h3>
            <p className="text-3xl font-bold text-rose-900">
              {durationStats.longest ? formatDuration(durationStats.longest) : '-'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-emerald-600 mb-2 font-medium">Average Game Duration</h3>
            <p className="text-3xl font-bold text-emerald-900">
              {durationStats.average ? formatDuration(durationStats.average) : '-'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-fuchsia-600 mb-2 font-medium">Best Color</h3>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: bestColor || 'gray' }}
              />
              <p className="text-3xl font-bold text-fuchsia-900">
                {bestColorWins} wins
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-cyan-600 mb-2 font-medium">Favorite Color</h3>
            {favoriteColorStats && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: favoriteColorStats.color }}
                />
                <p className="text-3xl font-bold text-cyan-900">
                  {favoriteColorStats.percentage}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentGames} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[0, 1]} 
                  ticks={[0, 1]} 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value === 1 ? 'Won' : 'Lost'}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                  formatter={(value: number) => [value === 1 ? 'Won' : 'Lost', 'Result']}
                  labelStyle={{ color: '#4B5563' }}
                />
                <Line
                  type="monotone"
                  dataKey="won"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  fill="url(#colorWon)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Games</h3>
          {playerGames.slice(-5).reverse().map(game => (
            <div
              key={game.id}
              className={`p-4 rounded-lg ${
                game.winnerId === player.id 
                  ? 'bg-gradient-to-br from-green-50 to-green-100' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100'
              } shadow-sm`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{game.date}</span>
                <div className="flex items-center gap-3">
                  {game.endTime && (
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      {formatDuration(getGameDurationMinutes(game))}
                    </span>
                  )}
                  <span className={
                    game.winnerId === player.id 
                      ? 'text-green-600 font-medium' 
                      : 'text-gray-600'
                  }>
                    {game.winnerId === player.id ? 'Won' : 'Lost'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {game.players.map(gamePlayer => {
                  const gamePlayerDetails = players.find(p => p.id === gamePlayer.playerId);
                  return (
                    <div 
                      key={gamePlayer.playerId}
                      className="flex items-center gap-1.5 text-sm text-gray-600"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: gamePlayer.color }}
                      />
                      <span>{gamePlayerDetails?.username}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}