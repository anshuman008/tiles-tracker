import React, { useState } from 'react';
import Game from './Tiles';
import Timer from './Timer';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStart = () => {
    setIsGameStarted(true);
  };

  return (
    <div className= {`bg-gray-900 text-white text-center ${isGameStarted?'':'h-screen'}`} >
      <h1>Tiles</h1>
      {!isGameStarted ? (
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
        >
          Start
        </button>
      ) : (
        <>
          <Timer start={isGameStarted} />
          <Game startGame={isGameStarted} setIsGameStarted ={()=> setIsGameStarted(false)} />
        </>
      )}
    </div>
  );
}

export default App;
