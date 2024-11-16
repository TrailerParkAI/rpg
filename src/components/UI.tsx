import React from 'react';
import { useGameStore } from '../store/gameStore';

export const UI: React.FC = () => {
  const { player, useItem } = useGameStore();

  return (
    <div className="absolute top-0 left-0 p-4 text-white font-pixel">
      <div className="space-y-2">
        <div className="bg-gray-800/80 p-3 rounded-lg backdrop-blur">
          <div className="mb-1">HP: {player.health}/{player.maxHealth}</div>
          <div className="w-full h-2 bg-gray-700 rounded">
            <div 
              className="h-full bg-red-500 rounded" 
              style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-800/80 p-3 rounded-lg backdrop-blur">
          <div>Level: {player.level}</div>
          <div>XP: {player.experience}/{player.level * 100}</div>
          <div>DMG: {player.damage}</div>
          <div>DEF: {player.defense}</div>
        </div>

        {player.inventory.length > 0 && (
          <div className="bg-gray-800/80 p-3 rounded-lg backdrop-blur">
            <h3 className="mb-2">Inventory:</h3>
            <div className="space-y-1">
              {player.inventory.map((item) => (
                <div 
                  key={item.id}
                  className="text-sm flex justify-between items-center"
                  onClick={() => useItem(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{item.name}</span>
                  <span className="text-xs opacity-75">
                    {item.type === 'consumable' ? '(Use)' : `(+${item.value})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 left-4 bg-gray-800/80 p-3 rounded-lg backdrop-blur">
        <div className="text-sm">
          Controls:
          <br />
          ↑↓←→: Move
          <br />
          Space: Attack
          <br />
          E: Pickup Items
        </div>
      </div>
    </div>
  );
};