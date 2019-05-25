import React, { useState, useEffect, useRef, useReducer } from 'react'

import styles from './App.module.css'

const PLAYER_WIDTH = 32
const STEP = 10
const JUMP_HEIGHT = 40
const FLOOR_LEVEL = 40
const ACCELERATION_FACTOR = 500
const FALLING_INTERVAL = 50
const FALLING_INTERVAL_SECONDS = FALLING_INTERVAL / 1000

/*
 * ACCELERATION_FACTOR = 10 pixels each second^2
 * This means, the velocity will increase in 10 pixels every second
 * Since the interval we have is FALLING_INTERVAL_SECONDS, we need to add
 * ACCELERATION_FACTOR * FALLING_INTERVAL_SECONDS every tick of the interval.
 */

function yAccelerationReducer(state, action) {
  switch (action.type) {
    case 'STOP':
      return {
        ...state,
        velY: 0,
      }
    case 'FALL':
      const newPosY = Math.max(state.posY - state.velY * FALLING_INTERVAL_SECONDS, 0)
      return {
        ...state,
        posY: newPosY,
        velY:
          newPosY !== 0
            ? Math.min(state.velY + ACCELERATION_FACTOR * FALLING_INTERVAL_SECONDS, 1000)
            : 0,
      }
    case 'JUMP':
      return {
        ...state,
        posY: state.posY + 100,
      }
    default:
      return state
  }
}

const initialPosYState = {
  velY: 0,
  posY: 500,
}

function App() {
  const [posX, setPosX] = useState(50)
  const [posYState, dispatchYState] = useReducer(yAccelerationReducer, initialPosYState)
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
      } else if (event.key === ' ' || event.key === 'ArrowUp') {
        if (posYState.posY === 0) {
          dispatchYState({ type: 'JUMP' })
        }
      }
    }
    document.addEventListener('keydown', eventListener)
    return () => {
      document.removeEventListener('keydown', eventListener)
    }
  }, [posX, posYState, containerRef])

  useEffect(() => {
    if (posYState.posY > 0) {
      const intervalId = setInterval(() => {
        if (posYState.posY > 0) {
          dispatchYState({ type: 'FALL' })
        } else {
          clearInterval(intervalId)
          dispatchYState({ type: 'STOP' })
        }
      }, FALLING_INTERVAL)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [posYState])

  return (
    <div className="App">
      <div className={styles.PlaygroundWrapper}>
        <div className={styles.Playground} ref={containerRef}>
          <div className={styles.Player} style={{ left: posX, bottom: posYState.posY }} />
        </div>
      </div>
    </div>
  )
}

export default App
