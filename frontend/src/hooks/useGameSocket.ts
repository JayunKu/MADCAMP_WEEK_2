import { useEffect, useCallback, useState } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from '../context/AuthContext';
import { parsePlayer, Player, Room } from '../types/game';

interface UseGameSocketReturn {
  isConnected: boolean;
  // Room related
  joinRoom: (roomCode: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  // Game related
  submitAnswer: (answer: string) => void;
  submitImage: (imageId: string) => void;
}

export const useGameSocket = (
  setRoom: (room: Room) => void,
  setRoomPlayers: (players: Player[]) => void
): UseGameSocketReturn => {
  const { player } = useAuth();
  const { socket, isConnected, emit, on, off } = useSocket({
    url:
      `${process.env.REACT_APP_WEBSOCKET_URL}/rooms` ||
      'http://localhost:8000/ws/rooms',
    autoConnect: true,
  });

  // Room related functions
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

  const leaveRoom = useCallback(() => {
    emit('leave_room');
  }, [emit]);

  const startGame = useCallback(() => {
    emit('start_game');
  }, [emit]);

  // Game related functions
  const submitAnswer = useCallback(
    (answer: string) => {
      emit('submit_answer', { answer });
    },
    [emit]
  );

  const submitImage = useCallback(
    (imageId: string) => {
      emit('submit_image', { imageId });
    },
    [emit]
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdated = (data: any) => {
      console.log('Room updated:', data);
    };

    const handlePlayerJoined = (data: Player[]) => {
      console.log('Player joined:', data);
      const players = data.map(p => parsePlayer(p));
      setRoomPlayers(players);
    };

    const handlePlayerLeft = (data: any) => {
      console.log('Player left:', data);
    };

    // Game events
    const handleGameStarted = (data: any) => {
      console.log('Game started:', data);
    };

    const handleTurnChanged = (data: any) => {
      console.log('Turn changed:', data);
    };

    const handleGameFinished = (data: any) => {
      console.log('Game finished:', data);
    };

    // Register event listeners
    on('room_updated', handleRoomUpdated);
    on('player_joined', handlePlayerJoined);
    on('player_left', handlePlayerLeft);
    on('game_started', handleGameStarted);
    on('turn_changed', handleTurnChanged);
    on('game_finished', handleGameFinished);

    // Cleanup
    return () => {
      off('room_updated', handleRoomUpdated);
      off('player_joined', handlePlayerJoined);
      off('player_left', handlePlayerLeft);
      off('game_started', handleGameStarted);
      off('turn_changed', handleTurnChanged);
      off('game_finished', handleGameFinished);
    };
  }, [socket, on, off, player]);

  return {
    isConnected,
    joinRoom,
    leaveRoom,
    startGame,
    submitAnswer,
    submitImage,
  };
};
