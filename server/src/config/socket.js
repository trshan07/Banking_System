// frontend/src/socket.js (if you have one)
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(SOCKET_URL, {
    transports: ['polling', 'websocket'], // Start with polling, upgrade to websocket
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000
  });
  
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};