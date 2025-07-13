import { useEffect, useCallback, useState } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from '../context/AuthContext';

interface GamePlayer {
  id: string;
  username: string;
  avatarId: number;
  isReady: boolean;
  isHost: boolean;
  isMember: boolean;
  totalGames?: number;
  totalWins?: number;
}

interface GameRoom {
  id: string;
  code: string;
  players: GamePlayer[];
  maxPlayers: number;
  gameMode: number;
  status: 'waiting' | 'playing' | 'finished';
  currentRound?: number;
  currentTurn?: number;
  hostId: string;
}

interface GameState {
  room: GameRoom | null;
  currentPlayer: GamePlayer | null;
  isMyTurn: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
}

interface UseGameSocketReturn {
  gameState: GameState;
  isConnected: boolean;
  // Room related
  joinRoom: (roomCode: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  // Game related
  submitAnswer: (answer: string) => void;
  submitImage: (imageId: string) => void;
}

export const useGameSocket = (): UseGameSocketReturn => {
  const { player } = useAuth();
  const { socket, isConnected, emit, on, off } = useSocket({
    autoConnect: true,
  });

  const [gameState, setGameState] = useState<GameState>({
    room: null,
    currentPlayer: null,
    isMyTurn: false,
    gameStatus: 'waiting',
  });

  // Room related functions
  const joinRoom = useCallback(
    (roomCode: string) => {
      if (!player) {
        console.error('Player must be authenticated to join a room');
        return;
      }

      emit('join_room', {
        roomCode,
        player: {
          id: player.id.toString(),
          username: player.name,
          avatarId: player.avatarId,
          isMember: true,
        },
      });
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

  // Player related functions
  const updatePlayerInfo = useCallback(
    (username: string, avatarId: number) => {
      emit('update_player_info', { username, avatarId });
    },
    [emit]
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Room events
    const handleRoomJoined = (data: { room: GameRoom; player: GamePlayer }) => {
      console.log('Room joined:', data);
      setGameState(prev => ({
        ...prev,
        room: data.room,
        currentPlayer: data.player,
        gameStatus: data.room.status,
      }));
    };

    const handleRoomUpdated = (data: { room: GameRoom }) => {
      console.log('Room updated:', data);
      setGameState(prev => ({
        ...prev,
        room: data.room,
        gameStatus: data.room.status,
      }));
    };

    const handlePlayerJoined = (data: { player: GamePlayer }) => {
      console.log('Player joined:', data);
      setGameState(prev => ({
        ...prev,
        room: prev.room
          ? {
              ...prev.room,
              players: [...prev.room.players, data.player],
            }
          : null,
      }));
    };

    const handlePlayerLeft = (data: { playerId: string }) => {
      console.log('Player left:', data);
      setGameState(prev => ({
        ...prev,
        room: prev.room
          ? {
              ...prev.room,
              players: prev.room.players.filter(p => p.id !== data.playerId),
            }
          : null,
      }));
    };

    // Game events
    const handleGameStarted = (data: { room: GameRoom }) => {
      console.log('Game started:', data);
      setGameState(prev => ({
        ...prev,
        room: data.room,
        gameStatus: 'playing',
      }));
    };

    const handleTurnChanged = (data: { currentPlayerId: string }) => {
      console.log('Turn changed:', data);
      setGameState(prev => ({
        ...prev,
        isMyTurn: data.currentPlayerId === player?.id.toString(),
      }));
    };

    const handleGameFinished = (data: { room: GameRoom; results: any }) => {
      console.log('Game finished:', data);
      setGameState(prev => ({
        ...prev,
        room: data.room,
        gameStatus: 'finished',
      }));
    };

    // Error events
    const handleError = (error: { message: string; code?: string }) => {
      console.error('Socket error:', error);
      // 여기서 에러 처리 로직 추가 (예: 토스트 메시지 표시)
    };

    // Register event listeners
    on('room_joined', handleRoomJoined);
    on('room_updated', handleRoomUpdated);
    on('player_joined', handlePlayerJoined);
    on('player_left', handlePlayerLeft);
    on('game_started', handleGameStarted);
    on('turn_changed', handleTurnChanged);
    on('game_finished', handleGameFinished);
    on('error', handleError);

    // Cleanup
    return () => {
      off('room_joined', handleRoomJoined);
      off('room_updated', handleRoomUpdated);
      off('player_joined', handlePlayerJoined);
      off('player_left', handlePlayerLeft);
      off('game_started', handleGameStarted);
      off('turn_changed', handleTurnChanged);
      off('game_finished', handleGameFinished);
      off('error', handleError);
    };
  }, [socket, on, off, player]);

  return {
    gameState,
    isConnected,
    joinRoom,
    leaveRoom,
    startGame,
    submitAnswer,
    submitImage,
  };
};
