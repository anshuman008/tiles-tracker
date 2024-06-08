import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function Tile({ letter, isCorrect, column, len, time }) {
  return (
    <motion.div
      className={`w-24 rounded-lg ${isCorrect ? 'bg-green-500' : 'bg-gray-800'} text-white flex items-center justify-center text-2xl uppercase font-bold`}
      style={{ position: 'absolute', left: `${column * 7.5}%`, height: `${len}px` }}
      initial={{ y: -len }}
      animate={{ y: 600 - len }}
      transition={{ duration: 8, ease: "linear" }}
      exit={{ opacity: 0 }}
    >
      <div className='flex flex-col justify-center items-center gap-y-3'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
        <span>{letter}</span>
      </div>
    </motion.div>
  );
}

function Game({ startGame, setIsGameStarted }) {
  const [tiles, setTiles] = useState([]);
  const [timeRange, setTimeRange] = useState(0);

  const tilseMap = [
    { col: '0', val: '60' },
    { col: '1', val: '61' },
    { col: '2', val: '62' },
    { col: '3', val: '63' },
    { col: '4', val: '64' },
    { col: '5', val: '65' },
    { col: '6', val: '66' },
    { col: '7', val: '67' },
    { col: '8', val: '68' },
    { col: '9', val: '69' },
    { col: '10', val: '70' },
    { col: '11', val: '71' },
    { col: '12', val: '72' },
  ];

  const inputArray = [
    { val: '60', ti: '1000', len: '100' },
    { val: '62', ti: '1000', len: '200' },
    { val: '63', ti: '5000', len: '100' },
    { val: '64', ti: '5000', len: '200' },
    { val: '65', ti: '6000', len: '100' }
  ];

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        setTimeRange(prev => prev + 100);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [startGame]);

  useEffect(() => {
    if (startGame) {
      const matchingTiles = inputArray.filter(tile => Number(tile.ti) === timeRange);
      if (matchingTiles.length > 0) {
        matchingTiles.forEach(tile => {
          const { col, val } = tilseMap.find(mp => mp.val === tile.val);
          setTiles(prevTiles => [...prevTiles, { letter: val, column: col, id: Math.random(), isCorrect: false, len: tile.len, time: tile.ti }]);
        });
      }
    }
  }, [timeRange, startGame]);

  useEffect(() => {
    function handleMIDISuccess(midiAccess) {
      console.log('MIDI Access Object', midiAccess);
      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
      }
    }

    function handleMIDIMessage(message) {
      const [status, data1, data2] = message.data;
      if (status === 144) { // Note On message
        console.log(`MIDI Note On: ${data1}, Velocity: ${data2}`);
        setTiles(prevTiles =>
          prevTiles.map(tile => {
            if (tile.letter === data1.toString()) {
              return { ...tile, isCorrect: true };
            }
            return tile;
          })
        );
      }
    }

    function handleMIDIFailure() {
      console.error('Could not access MIDI devices.');
    }

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(handleMIDISuccess, handleMIDIFailure);
    } else {
      console.warn('Web MIDI API is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    const correctTileRemover = setInterval(() => {
      setTiles(prevTiles => prevTiles.filter(tile => !tile.isCorrect));
    }, 1000);

    return () => clearInterval(correctTileRemover);
  }, []);

  return (
    <div className="flex justify-center items-start h-screen bg-gray-900 overflow-hidden relative">
      <AnimatePresence>
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            letter={tile.letter}
            isCorrect={tile.isCorrect}
            column={tile.column}
            len={tile.len}
            time={tile.time}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Game;
