import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";

const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

// 🔒 Global flag to prevent multiple WebSocket connections
let socketInitialized = false;

export const WebSocketProvider = ({ children }) => {
  const [wsData, setWsData] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const setupSocket = async () => {
    if (socketInitialized) {
      console.log("WebSocket already initialized, skipping setup.");
      return;
    }

    socketInitialized = true; // ✅ Mark as initialized

    const token = await SecureStore.getItemAsync("token");
    console.log("setupSocket called in WebSocketProvider");

    const socket = new WebSocket("ws://192.168.8.146:8080");

    socket.onopen = () => {
      console.log("WebSocket connected");
      clearTimeout(reconnectTimeoutRef.current);
      socket.send(JSON.stringify({ type: "mobile_client", token }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        setWsData(data);
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected. Reconnecting in 3s...");
      socketInitialized = false; // 🔄 Allow reconnect
      reconnectTimeoutRef.current = setTimeout(setupSocket, 3000);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err.message);
    };

    socketRef.current = socket;
  };

  useEffect(() => {
    setupSocket();

    return () => {
      console.log("Cleaning up WebSocket on unmount...");
      socketRef.current?.close();
      clearTimeout(reconnectTimeoutRef.current);
      socketInitialized = false; // Allow new connection next time
    };
  }, []);

  const sendMessage = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ wsData, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
