import { useState } from 'react'

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  const transition = (newMode, replace) => {
    (replace) ? setHistory([...history.slice(0,-1), newMode])
              : setHistory([...history, newMode]) 
    
    setMode(newMode)
  }

  const back = () => {
    if (history.length < 2) {
      return;
    }
    setMode(history[history.length - 2])
    setHistory(history.slice(0,-1))
  };
  
  return { mode, transition, back };
};