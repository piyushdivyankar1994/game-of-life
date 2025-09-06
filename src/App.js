import logo from './logo.svg';
import './App.css';
import { useCallback, useState, useRef, useEffect } from 'react';

const numRows = 25
const numCols = 25

const neighbours = [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]]

function generateRandomBoard() {
  return Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => Math.floor(Math.random() * 2))
  );
}

function App() {
  const [grid, setGrid] = useState(() => generateRandomBoard());
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;



  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(g => {
      return g.map((row, i) =>
        row.map((cell, j) => {
          let neighborsCount = 0;
          neighbours.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighborsCount += g[newI][newJ];
            }
          });

          if (cell === 1) {
            return neighborsCount === 2 || neighborsCount === 3 ? 1 : 0;
          } else {
            return neighborsCount === 3 ? 1 : 0;
          }
        })
      )
    })
    setTimeout(runSimulation, 300);
  }, [])

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, runSimulation]);

  return (
    <div className="App gameoflife-app">
      <header className="App-header gameoflife-header">
        <h1 className='gameoflife-title'>Conway's Game of Life</h1>
        <div className='gameoflife-ui-grid'>
          <div className="gameoflife-controls">
            <button className="gameoflife-btn" onClick={() => setRunning(!running)}>
              {running ? "Stop" : "Start"}
            </button>
            <button className="gameoflife-btn randomize" onClick={() => setGrid(generateRandomBoard())}>
              Randomize
            </button>
          </div>
          <div
            className="gameoflife-grid"
            style={{
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
              gridTemplateRows: `repeat(${numRows}, 20px)`,
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`gameoflife-cell ${cell === 1 ? "alive" : ""}`}
                />
              ))
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
