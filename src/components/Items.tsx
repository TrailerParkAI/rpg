import React from 'react';
import { Container, Graphics } from '@pixi/react';
import { Item } from '../types/game';

interface Props {
  items: Item[];
}

export const Items: React.FC<Props> = ({ items }) => {
  return (
    <Container>
      {items.map((item) => (
        item.position && (
          <Graphics
            key={item.id}
            x={item.position.x}
            y={item.position.y}
            draw={(g) => {
              g.clear();
              
              // Draw shadow
              g.beginFill(0x000000, 0.2);
              g.drawCircle(2, 2, 12);
              g.endFill();
              
              // Draw item
              const itemColor = item.type === 'weapon' ? 0xf1c40f : 
                              item.type === 'armor' ? 0x3498db : 0xe74c3c;
              
              g.lineStyle(2, 0x2c3e50);
              g.beginFill(itemColor);
              g.drawCircle(0, 0, 10);
              g.endFill();
              
              // Add shine effect
              g.beginFill(0xffffff, 0.5);
              g.drawCircle(-3, -3, 3);
              g.endFill();
            }}
          />
        )
      ))}
    </Container>
  );
};