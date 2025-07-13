import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  url?: string;
  options?: any;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export const useSocket = ({
  url = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000',
  options = {},
  autoConnect = true,
}: UseSocketOptions = {}): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<Map<string, ((data: any) => void)[]>>(new Map());

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(url, {
      ...options,
      autoConnect: false,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', error => {
      console.error('Socket connection error:', error);
    });

    // 저장된 콜백들을 다시 등록
    callbacksRef.current.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        socketRef.current?.on(event, callback);
      });
    });

    socketRef.current.connect();
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket is not connected. Cannot emit event:', event);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    // 콜백을 저장
    if (!callbacksRef.current.has(event)) {
      callbacksRef.current.set(event, []);
    }
    callbacksRef.current.get(event)?.push(callback);

    // 소켓이 연결되어 있으면 바로 등록
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    // 콜백 저장소에서 제거
    if (callback) {
      const callbacks = callbacksRef.current.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      callbacksRef.current.delete(event);
    }

    // 소켓에서 제거
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};
