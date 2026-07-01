import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

let socket;
let currentUserId = null;
const joinedZones = new Set();

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket'], // bypass polling to prevent xhr poll errors
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to server');
      // Auto-restore room subscriptions on connect/reconnect
      if (currentUserId) {
        socket.emit('join_user', currentUserId);
        console.log('[Socket.io] Re-sent join_user:', currentUserId);
      }
      joinedZones.forEach(zoneId => {
        socket.emit('join_zone', zoneId);
        console.log('[Socket.io] Re-sent join_zone:', zoneId);
      });
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket.io] Connection error:', error);
    });
  }
  return socket;
};

export const joinZone = (zoneId) => {
  joinedZones.add(zoneId);
  const s = getSocket();
  if (s) {
    s.emit('join_zone', zoneId);
  }
};

export const leaveZone = (zoneId) => {
  joinedZones.delete(zoneId);
  const s = getSocket();
  if (s) {
    s.emit('leave_zone', zoneId);
  }
};

export const joinUser = (userId) => {
  currentUserId = userId;
  const s = getSocket();
  if (s) {
    s.emit('join_user', userId);
  }
};

export const leaveUser = (userId) => {
  if (currentUserId === userId) {
    currentUserId = null;
  }
  const s = getSocket();
  if (s) {
    s.emit('leave_user', userId);
  }
};
