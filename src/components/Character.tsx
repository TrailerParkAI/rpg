import React from 'react';
import { Container, Graphics } from '@pixi/react';
import { Character as CharacterType } from '../types/game';

interface Props {
  character: CharacterType;
  color?: number;
}

export const Character: React.FC<Props> = ({ character, color = 0x4a90e2 }) => {
  return (
    <Container position={[character.position.x, character.position.y]}>
      <Graphics
        draw={(g) => {
          g.clear();
          
          // Shadow
          g.beginFill(0x000000, 0.2);
          g.drawCircle(2, 2, 20);
          g.endFill();
          
          // Character body
          g.beginFill(color);
          g.lineStyle(2, 0x000000, 0.5);
          g.drawCircle(0, 0, 20);
          g.endFill();
          
          // Attack indicator
          if (character.isAttacking) {
            g.lineStyle(2, 0xffff00, 0.8);
            g.drawCircle(0, 0, 25);
          }
          
          // Health bar background
          g.beginFill(0x000000, 0.5);
          g.lineStyle(1, 0x000000, 0.8);
          g.drawRect(-25, -35, 50, 6);
          g.endFill();
          
          // Health bar
          const healthPercentage = character.health / character.maxHealth;
          const healthColor = healthPercentage > 0.6 ? 0x00ff00 : 
                            healthPercentage > 0.3 ? 0xffff00 : 0xff0000;
          
          g.beginFill(healthColor);
          g.drawRect(-24, -34, 48 * healthPercentage, 4);
          g.endFill();
        }}
      />
    </Container>
  );
};