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
    if (isAuthenticated && user) {
      const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token')
        },
        transports: ['websocket']
      })

      socketInstance.on('connect', () => {
        console.log('Socket connected')
        setOnline(true)
      })

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected')
        setOnline(false)
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [isAuthenticated, user])

  const emit = (event, data) => {
    if (socket && online) {
      socket.emit(event, data)
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