import React from 'react';
import { Game } from './components/Game';
import { UI } from './components/UI';

function App() {
  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center">
      <div className="game-container">
        <Game />
        <UI />
      </div>
    </div>
  );
}

export default App;