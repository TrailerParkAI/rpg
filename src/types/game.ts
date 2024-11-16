export interface Position {
  x: number;
  y: number;
}

export interface Character {
  position: Position;
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  inventory: Item[];
  damage: number;
  defense: number;
  isAttacking?: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable';
  value: number;
  position?: Position;
}

export interface GameState {
  player: Character;
  enemies: Character[];
  items: Item[];
  gameTime: number;
}