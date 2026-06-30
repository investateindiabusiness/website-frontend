import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected from server');
    });
  }
  return socket;
};

export const joinZone = (zoneId) => {
  const s = getSocket();
  if (s) {
    s.emit('join_zone', zoneId);
  }
};

export const leaveZone = (zoneId) => {
  const s = getSocket();
  if (s) {
    s.emit('leave_zone', zoneId);
  }
};
