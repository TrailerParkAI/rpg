import React, { useEffect } from 'react';
import { Stage, Container } from '@pixi/react';
import { useGameStore } from '../store/gameStore';
import { World } from './World';
import { Character } from './Character';
import { Items } from './Items';

export const Game: React.FC = () => {
  const { player, enemies, items, movePlayer, attack, updateGame, pickupItem } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const speed = 5;
      const { x, y } = player.position;

      switch (e.key) {
        case 'ArrowUp':
          movePlayer(x, y - speed);
          break;
        case 'ArrowDown':
          movePlayer(x, y + speed);
          break;
        case 'ArrowLeft':
          movePlayer(x - speed, y);
          break;
        case 'ArrowRight':
          movePlayer(x + speed, y);
          break;
        case ' ':
          attack();
          break;
        case 'e':
          items.forEach(item => {
            if (item.position) pickupItem(item.id);
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player.position, movePlayer, attack, items, pickupItem]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      updateGame();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [updateGame]);

  return (
    <Stage width={800} height={600} options={{ backgroundColor: 0x2c2c2c }}>
      <Container>
        <World />
        <Items items={items} />
        <Character character={player} />
        {enemies.map((enemy, index) => (
          enemy.health > 0 && <Character key={index} character={enemy} color={0xff6b6b} />
        ))}
      </Container>
    </Stage>
  );
};