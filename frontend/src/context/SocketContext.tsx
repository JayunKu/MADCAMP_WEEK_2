import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from './AuthContext';
import { parsePlayer, parseRoom, Player, Room } from '../types/game';
import { useRoom } from './RoomContext';
import { useUI } from './UIContext';
import { useNavigate } from 'react-router-dom';

interface SocketContextType {
  isConnected: boolean;
  joinRoom: (roomCode: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { player } = useAuth();
  const { setRoom, setRoomPlayers } = useRoom();
  const { setLoading } = useUI();
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
      if (!isConnected) {
        console.error('Socket is not connected. Cannot join room.');
        return;
      }
      console.log('Joining room with code:', roomCode);
      emit('join_room', { roomCode });
    },
    [emit, player, isConnected]
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
      setLoading(true);
      navigate('/game', { state: { roomId: data.room_id } });
      setLoading(false);
    };

    const handleTurnChanged = (data: any) => {
      console.log('Turn changed event received:', data);
      const roomData = parseRoom(data);
      console.log('Parsed room data:', roomData);
      setRoom(roomData);
    };

    const handleRoundFinished = (data: any) => {
      console.log('Round finished:', data);
      const roomData = parseRoom(data);
      console.log('Parsed room data:', roomData);
      setRoom(roomData);
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
    on('round_finished', handleRoundFinished);
    on('game_finished', handleGameFinished);

    // Cleanup
    return () => {
      off('room_updated', handleRoomUpdated);
      off('player_joined', handlePlayerJoined);
      off('player_left', handlePlayerLeft);
      off('game_started', handleGameStarted);
      off('turn_changed', handleTurnChanged);
      off('round_finished', handleRoundFinished);
      off('game_finished', handleGameFinished);
    };
  }, [socket, on, off, player, setRoom, setRoomPlayers]);

  const value: SocketContextType = {
    isConnected,
    joinRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useRoomSocket must be used within a RoomSocketProvider');
  }
  return ctx;
};
