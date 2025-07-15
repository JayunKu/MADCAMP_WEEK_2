import { useEffect, useCallback, useState } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from '../context/AuthContext';
import { useRoom } from '../context/RoomContext';
import { parseRoom } from '../types/game';

export interface GameSocket {
  isConnected: boolean;
  joinGame: (roomCode: string) => void;
}

export const useGameSocket = (): GameSocket => {
  const { player } = useAuth();
  const { setRoom } = useRoom();
  const { socket, isConnected, emit, on, off } = useSocket({
    url:
      `${process.env.REACT_APP_WEBSOCKET_URL}/games` ||
      'http://localhost:8000/ws/games',
    autoConnect: true,
  });

  const joinGame = useCallback(
    (roomCode: string) => {
      if (!player) {
        console.error('Player must be authenticated to join a game');
        return;
      }
      console.log('Joining game with code:', roomCode);
      emit('join_game', { roomCode });
    },
    [emit, player]
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleTurnChanged = (data: any) => {
      console.log('Turn changed event received:', data);
      const roomData = parseRoom(data);
      console.log('Parsed room data:', roomData);
      setRoom(roomData);
    };

    const handleGameFinished = (data: any) => {
      console.log('Game finished:', data);
    };

    // Register event listeners
    on('turn_changed', handleTurnChanged);
    on('game_finished', handleGameFinished);

    // Cleanup
    return () => {
      off('turn_changed', handleTurnChanged);
      off('game_finished', handleGameFinished);
    };
  }, [socket, on, off, player]);

  return {
    isConnected,
    joinGame,
  };
};
