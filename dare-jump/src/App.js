import React, { useState, useEffect, createRef } from 'react'
import styles from './App.module.css'
import './App.css'

const PLAYER_WIDTH = 32
const STEP = 10

function App() {
  const [posX, setPosX] = useState(0)
  const containerRef = createRef(null)
  useEffect(() => {
    const eventListener = event => {
      const screenWidth = containerRef.current.clientWidth
      if (event.key === 'ArrowRight' && posX < screenWidth - PLAYER_WIDTH) {
        setPosX(posX + STEP)
      } else if (event.key === 'ArrowLeft' && posX > 0) {
        setPosX(posX - STEP)
      }
    }
    document.addEventListener('keydown', eventListener)
    return () => {
      document.removeEventListener('keydown', eventListener)
    }
  }, [posX, containerRef])
  return (
    <div className="App" ref={containerRef}>
      <div className={styles.Player} style={{ left: posX }} />
    </div>
  )
}

export default App
