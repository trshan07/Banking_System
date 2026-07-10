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
    if (!isAuthenticated || !user) {
      setSocket(null)
      setOnline(false)
      return undefined
    }

    const token = localStorage.getItem('token')
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_ORIGIN || 'http://localhost:5001'

    if (isAuthenticated && user) {
      const socketInstance = io(socketUrl, {
        auth: {
          token
        },
        transports: ['polling', 'websocket'],
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

    return undefined
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

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback)
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
