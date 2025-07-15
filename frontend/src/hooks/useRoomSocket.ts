import { useEffect, useCallback, useState } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from '../context/AuthContext';
import { parsePlayer, parseRoom, Player, Room } from '../types/game';
import { useRoom } from '../context/RoomContext';

export interface RoomSocket {
  isConnected: boolean;
  joinRoom: (roomCode: string) => void;
}

export const useRoomSocket = (
  navigateToGame: (roomId: string) => void
): RoomSocket => {
  const { player } = useAuth();
  const { setRoom, setRoomPlayers } = useRoom();
  const { socket, isConnected, emit, on, off } = useSocket({
    url:
      `${process.env.REACT_APP_WEBSOCKET_URL}/rooms` ||
      'http://localhost:8000/ws/rooms',
    autoConnect: true,
  });

  const joinRoom = useCallback(
    (roomCode: string) => {
      if (!player) {
        console.error('Player must be authenticated to join a room');
        return;
      }
      console.log('Joining room with code:', roomCode);
      emit('join_room', { roomCode });
    },
    [emit, player]
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdated = (data: any) => {
      console.log('Room updated:', data);

      const room = parseRoom(data);
      setRoom(room);
    };

    const handlePlayerJoined = (data: any) => {
      console.log('Player joined:', data);
      const playersData = data.map((p: any) => parsePlayer(p));
      setRoomPlayers(playersData);
    };

    const handlePlayerLeft = (data: any) => {
      console.log('Player left:', data);
      const playersData = data.map((p: any) => parsePlayer(p));
      setRoomPlayers(playersData);
    };

    const handleGameStarted = (data: any) => {
      console.log('Game started: ', data);
      navigateToGame(data.room_id);
    };

    // Register event listeners
    on('room_updated', handleRoomUpdated);
    on('player_joined', handlePlayerJoined);
    on('player_left', handlePlayerLeft);
    on('game_started', handleGameStarted);

    // Cleanup
    return () => {
      off('room_updated', handleRoomUpdated);
      off('player_joined', handlePlayerJoined);
      off('player_left', handlePlayerLeft);
      off('game_started', handleGameStarted);
    };
  }, [socket, on, off, player]);

  return {
    isConnected,
    joinRoom,
  };
};
