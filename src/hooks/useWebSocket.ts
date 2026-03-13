import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_URL } from '../config';

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useWebSocket({
  onMessage,
  onError,
  onOpen,
  onClose,
}: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttemptsRef.current = 0;
        setIsConnected(true);
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        onClose?.();

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log(
              `Attempting to reconnect... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`
            );
            connect();
          }, RECONNECT_DELAY);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }, [onMessage, onError, onOpen, onClose]);

  const subscribe = useCallback(
    (channels: Array<{ name: string; symbols: string[] }>) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          type: 'subscribe',
          payload: { channels },
        });
        wsRef.current.send(message);
        console.log('Subscribed to:', channels);
      } else {
        console.warn('WebSocket not open, queueing subscription');
      }
    },
    []
  );

  const unsubscribe = useCallback(
    (channels: Array<{ name: string; symbols: string[] }>) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
          type: 'unsubscribe',
          payload: { channels },
        });
        wsRef.current.send(message);
        console.log('Unsubscribed from:', channels);
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    subscribe,
    unsubscribe,
    disconnect,
    isConnected,
    ws: wsRef.current,
  };
}

