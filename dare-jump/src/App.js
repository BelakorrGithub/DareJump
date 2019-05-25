import React, { useState, useEffect, useRef } from 'react'
import styles from './App.module.css'

const PLAYER_WIDTH = 32
const STEP = 10
const JUMP_HEIGHT = 40
const FLOOR_LEVEL = 40

function App() {
  const [posX, setPosX] = useState(50)
  const [posY, setPosY] = useState(40)
  const containerRef = useRef(null)
  useEffect(() => {
    const eventListener = event => {
      const screenWidth = containerRef.current.clientWidth
      // Moves right only if didn't reach the end of the screen
      if (event.key === 'ArrowRight' && posX < screenWidth - PLAYER_WIDTH) {
        setPosX(Math.min(posX + STEP, screenWidth - PLAYER_WIDTH))
        // Moves left only if didn't reach the end of the screen
      } else if (event.key === 'ArrowLeft' && posX > 0) {
        setPosX(Math.max(posX - STEP, 0))
        // Jump when pressing space or up arrow key
      } else if (event.key === ' ' || event.key === 'ArrowUp') {
        setPosY(posY + JUMP_HEIGHT)
        // This is definitely not the best way of falling back to the ground
        // I was thinking perhaps we should create the movement by looping pixel by pixel until reaching the step/jump amount.
        // This way we would have way more control over collisions and transitions time.
        // Also we need gravity-effect
        setTimeout(() => {
          setPosY(FLOOR_LEVEL)
        }, 200) // This amount is matching the transiton time on CSS creating the illusion of a smoother movement
      }
    }
    document.addEventListener('keydown', eventListener)
    return () => {
      document.removeEventListener('keydown', eventListener)
    }
  }, [posX, posY, containerRef])
  return (
    <div className="App">
      <div className={styles.PlaygroundWrapper}>
        <div className={styles.Playground} ref={containerRef}>
          <div className={styles.Player} style={{ left: posX, bottom: posY }} />
        </div>
      </div>
    </div>
  )
}

export default App
