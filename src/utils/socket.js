import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
// Strip /api suffix if present, keep only the origin for Socket.io
const SOCKET_URL = (() => {
  try {
    const url = new URL(API_BASE_URL.replace(/\/api\/?$/, ''));
    // If running in browser and the socket URL hostname is local, dynamically map it to the current webpage hostname
    if (typeof window !== 'undefined' && 
        (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) {
      url.hostname = window.location.hostname;
    }
    return url.origin; // e.g. "http://localhost:5001"
  } catch {
    return 'http://localhost:5001';
  }
})();

let socket;
let currentUserId = null;
const joinedZones = new Set();

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ['polling', 'websocket'], // start with polling, upgrade to ws
      upgrade: true,
      reconnectionAttempts: 5,       // stop after 5 failed attempts
      reconnectionDelay: 3000,       // wait 3s between retries
      reconnectionDelayMax: 10000,   // cap at 10s
      timeout: 10000,
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

    let lastErrorMsg = null;
    socket.on('connect_error', (error) => {
      // Deduplicate — only log when the error message changes
      if (error.message !== lastErrorMsg) {
        console.warn('[Socket.io] Connection error:', error.message);
        lastErrorMsg = error.message;
      }
    });

    socket.on('reconnect_failed', () => {
      console.warn('[Socket.io] Max reconnection attempts reached. Real-time updates disabled.');
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
