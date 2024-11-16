import { create } from 'zustand';
import { GameState, Character, Item, Position } from '../types/game';

const initialPlayer: Character = {
  position: { x: 400, y: 300 },
  health: 100,
  maxHealth: 100,
  level: 1,
  experience: 0,
  damage: 20,
  defense: 10,
  inventory: [
    { id: '1', name: 'Wooden Sword', type: 'weapon', value: 5 },
    { id: '2', name: 'Health Potion', type: 'consumable', value: 20 },
  ],
};

const initialEnemies: Character[] = Array(5).fill(null).map((_, i) => ({
  position: {
    x: Math.random() * 700 + 50,
    y: Math.random() * 500 + 50
  },
  health: 50,
  maxHealth: 50,
  level: 1,
  experience: 0,
  damage: 10,
  defense: 5,
  inventory: [],
}));

const initialItems: Item[] = [
  {
    id: 'sword1',
    name: 'Steel Sword',
    type: 'weapon',
    value: 25,
    position: { x: 200, y: 200 }
  },
  {
    id: 'potion1',
    name: 'Health Potion',
    type: 'consumable',
    value: 50,
    position: { x: 600, y: 400 }
  }
];

interface GameStore extends GameState {
  movePlayer: (x: number, y: number) => void;
  addItemToInventory: (item: Item) => void;
  updateHealth: (amount: number) => void;
  gainExperience: (amount: number) => void;
  attack: () => void;
  updateGame: () => void;
  pickupItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
}

const ATTACK_RANGE = 50;

export const useGameStore = create<GameStore>((set, get) => ({
  player: initialPlayer,
  enemies: initialEnemies,
  items: initialItems,
  gameTime: 0,
  
  movePlayer: (x: number, y: number) => 
    set((state) => ({
      player: {
        ...state.player,
        position: { 
          x: Math.max(20, Math.min(780, x)),
          y: Math.max(20, Math.min(580, y)),
        },
      },
    })),

  addItemToInventory: (item: Item) =>
    set((state) => ({
      player: {
        ...state.player,
        inventory: [...state.player.inventory, item],
      },
    })),

  updateHealth: (amount: number) =>
    set((state) => ({
      player: {
        ...state.player,
        health: Math.min(
          state.player.maxHealth,
          Math.max(0, state.player.health + amount)
        ),
      },
    })),

  gainExperience: (amount: number) =>
    set((state) => {
      const newExperience = state.player.experience + amount;
      const experienceToLevel = state.player.level * 100;
      
      if (newExperience >= experienceToLevel) {
        return {
          player: {
            ...state.player,
            level: state.player.level + 1,
            experience: newExperience - experienceToLevel,
            maxHealth: state.player.maxHealth + 20,
            health: state.player.maxHealth + 20,
            damage: state.player.damage + 5,
            defense: state.player.defense + 3,
          },
        };
      }
      
      return {
        player: {
          ...state.player,
          experience: newExperience,
        },
      };
    }),

  attack: () => 
    set((state) => {
      const updatedEnemies = state.enemies.map(enemy => {
        const distance = Math.hypot(
          enemy.position.x - state.player.position.x,
          enemy.position.y - state.player.position.y
        );

        if (distance <= ATTACK_RANGE) {
          const damage = Math.max(0, state.player.damage - enemy.defense);
          return {
            ...enemy,
            health: Math.max(0, enemy.health - damage)
          };
        }
        return enemy;
      });

      return {
        enemies: updatedEnemies,
        player: { ...state.player, isAttacking: true }
      };
    }),

  updateGame: () => {
    const state = get();
    set((state) => {
      // Move enemies towards player
      const updatedEnemies = state.enemies
        .filter(enemy => enemy.health > 0)
        .map(enemy => {
          const dx = state.player.position.x - enemy.position.x;
          const dy = state.player.position.y - enemy.position.y;
          const distance = Math.hypot(dx, dy);
          
          if (distance < 200 && distance > 0) {
            const speed = 1;
            const vx = (dx / distance) * speed;
            const vy = (dy / distance) * speed;
            
            return {
              ...enemy,
              position: {
                x: enemy.position.x + vx,
                y: enemy.position.y + vy
              }
            };
          }
          return enemy;
        });

      // Check for enemy attacks
      let playerHealth = state.player.health;
      updatedEnemies.forEach(enemy => {
        const distance = Math.hypot(
          enemy.position.x - state.player.position.x,
          enemy.position.y - state.player.position.y
        );
        
        if (distance <= ATTACK_RANGE) {
          const damage = Math.max(0, enemy.damage - state.player.defense);
          playerHealth = Math.max(0, playerHealth - damage);
        }
      });

      return {
        enemies: updatedEnemies,
        player: { ...state.player, health: playerHealth, isAttacking: false },
        gameTime: state.gameTime + 1
      };
    });
  },

  pickupItem: (itemId: string) =>
    set((state) => {
      const item = state.items.find(i => i.id === itemId);
      if (!item) return state;

      const distance = Math.hypot(
        item.position!.x - state.player.position.x,
        item.position!.y - state.player.position.y
      );

      if (distance <= ATTACK_RANGE) {
        return {
          items: state.items.filter(i => i.id !== itemId),
          player: {
            ...state.player,
            inventory: [...state.player.inventory, item]
          }
        };
      }
      return state;
    }),

  useItem: (itemId: string) =>
    set((state) => {
      const itemIndex = state.player.inventory.findIndex(i => i.id === itemId);
      if (itemIndex === -1) return state;

      const item = state.player.inventory[itemIndex];
      const newInventory = [
        ...state.player.inventory.slice(0, itemIndex),
        ...state.player.inventory.slice(itemIndex + 1)
      ];

      if (item.type === 'consumable') {
        return {
          player: {
            ...state.player,
            inventory: newInventory,
            health: Math.min(
              state.player.maxHealth,
              state.player.health + item.value
            )
          }
        };
      }
      return state;
    })
}));