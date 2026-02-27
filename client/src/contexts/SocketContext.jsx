import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [online, setOnline] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Only try to connect if backend is available
    // For now, we'll just set a dummy socket to prevent errors
    const dummySocket = {
      on: (event, callback) => {
        console.log(`Socket event ${event} registered (dummy mode)`)
        return dummySocket
      },
      off: (event) => {
        console.log(`Socket event ${event} unregistered (dummy mode)`)
        return dummySocket
      },
      emit: (event, data) => {
        console.log(`Socket emit ${event}:`, data, '(dummy mode)')
        return dummySocket
      },
      disconnect: () => {
        console.log('Socket disconnected (dummy mode)')
      }
    }
    
    setSocket(dummySocket)
    setOnline(false) // Set to false since no real connection

    // Uncomment this when your backend is ready
    /*
    if (isAuthenticated && user) {
      const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socketInstance.on('connect', () => {
        console.log('Socket connected')
        setOnline(true)
      })

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected')
        setOnline(false)
      })

      socketInstance.on('connect_error', (error) => {
        console.log('Socket connection error:', error)
        setOnline(false)
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
      }
    }
    */
  }, [isAuthenticated, user])

  const emit = (event, data) => {
    if (socket && online) {
      socket.emit(event, data)
    } else {
      console.log(`Socket emit ${event} (offline):`, data)
    }
  }

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback)
    }
  }

  const off = (event) => {
    if (socket) {
      socket.off(event)
    }
  }

  const value = {
    socket,
    online,
    emit,
    on,
    off,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}