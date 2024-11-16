import React from 'react';
import { Container, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';

const TILE_SIZE = 50;
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

export const World: React.FC = () => {
  const drawWorld = (g: PIXI.Graphics) => {
    // Draw grass background
    g.beginFill(0x2d3436);
    g.drawRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    g.endFill();

    // Draw grid pattern
    g.lineStyle(1, 0x34495e, 0.3);
    for (let x = 0; x <= MAP_WIDTH; x += TILE_SIZE) {
      g.moveTo(x, 0);
      g.lineTo(x, MAP_HEIGHT);
    }
    for (let y = 0; y <= MAP_HEIGHT; y += TILE_SIZE) {
      g.moveTo(0, y);
      g.lineTo(MAP_WIDTH, y);
    }

    // Add decorative elements
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * MAP_WIDTH;
      const y = Math.random() * MAP_HEIGHT;
      const size = Math.random() * 4 + 2;
      
      g.beginFill(0x95a5a6, 0.3);
      g.drawCircle(x, y, size);
      g.endFill();
    }
  };

  return (
    <Container>
      <Graphics draw={drawWorld} />
    </Container>
  );
};