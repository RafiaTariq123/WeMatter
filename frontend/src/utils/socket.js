import { io } from "socket.io-client";

let socket;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

const setupSocketListeners = (onOnlineUsersUpdate, onNewMessage) => {
  if (!socket) return;

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected. Reason:", reason);
    if (reason === 'io server disconnect' || reason === 'transport close') {
      // The server explicitly closed the connection, attempt to reconnect
      setTimeout(attemptReconnect, 1000);
    }
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      setTimeout(attemptReconnect, delay);
      reconnectAttempts++;
    } else {
      console.error("Max reconnection attempts reached. Please check your connection.");
    }
  });

  // Add other event listeners
  if (typeof onOnlineUsersUpdate === "function") {
    socket.off("get-online-users"); // Remove existing listener to avoid duplicates
    socket.on("get-online-users", onOnlineUsersUpdate);
  }

  if (typeof onNewMessage === "function") {
    socket.off("newMessage"); // Remove existing listener to avoid duplicates
    socket.on("newMessage", onNewMessage);
  }
};

const attemptReconnect = () => {
  if (socket && !socket.connected) {
    console.log("Attempting to reconnect socket...");
    socket.connect();
  }
};

export const connectSocket = (userId, onOnlineUsersUpdate, onNewMessage) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      query: { userId },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      upgrade: true
    });

    setupSocketListeners(onOnlineUsersUpdate, onNewMessage);
  } else if (!socket.connected) {
    // If socket exists but not connected, try to reconnect
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    // Remove all listeners
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("get-online-users");
    socket.off("newMessage");

    // Only disconnect if we're actually connected
    if (socket.connected) {
      socket.disconnect();
    }
    socket = null;
    console.log("Socket disconnected and cleaned up.");
  }
};

export const getSocket = () => socket;