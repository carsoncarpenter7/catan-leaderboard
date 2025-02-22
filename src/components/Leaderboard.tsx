import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import type { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    const aWinRate = a.gamesPlayed ? (a.gamesWon / a.gamesPlayed) : 0;
    const bWinRate = b.gamesPlayed ? (b.gamesWon / b.gamesPlayed) : 0;
    return bWinRate - aWinRate;
  });

  const top3 = sortedPlayers.slice(0, 3);
  const [second, first, third] = [top3[1], top3[0], top3[2]];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Top Players</h2>
      
      <div className="relative h-[300px] flex items-end justify-center gap-4">
        {/* Second Place */}
        {second && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center">
                <Medal size={40} className="text-white" />
              </div>
            </div>
            <div className="w-32 h-[160px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-lg flex flex-col items-center justify-end p-4">
              <span className="font-bold text-lg text-gray-800">{second.username}</span>
              <span className="text-sm text-gray-600">{(second.gamesWon / second.gamesPlayed * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="flex flex-col items-center -mt-12">
            <div className="w-32 h-32 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <Trophy size={48} className="text-white" />
              </div>
            </div>
            <div className="w-40 h-[200px] bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-t-lg flex flex-col items-center justify-end p-4">
              <span className="font-bold text-xl text-gray-800">{first.username}</span>
              <span className="text-sm text-gray-600">{(first.gamesWon / first.gamesPlayed * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                <Award size={40} className="text-white" />
              </div>
            </div>
            <div className="w-32 h-[120px] bg-gradient-to-b from-amber-50 to-amber-100 rounded-t-lg flex flex-col items-center justify-end p-4">
              <span className="font-bold text-lg text-gray-800">{third.username}</span>
              <span className="text-sm text-gray-600">{(third.gamesWon / third.gamesPlayed * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Base Platform */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-500 via-red-500 to-green-500 rounded-lg" />
      </div>
    </div>
  );
}