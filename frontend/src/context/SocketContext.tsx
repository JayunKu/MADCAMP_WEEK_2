import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from './AuthContext';
import { GameMode, parsePlayer, parseRoom, Player, Room } from '../types/game';
import { useRoom } from './RoomContext';
import { useUI } from './UIContext';
import { useNavigate } from 'react-router-dom';
import { RoundResultPopup } from '../pages/game/RoundResult';

interface SocketContextType {
  isConnected: boolean;
  joinRoom: (roomCode: string) => void;
  leaveRoom: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { player } = useAuth();
  const { room, setRoom, setRoomPlayers } = useRoom();
  const { setLoading } = useUI();
  const { socket, isConnected, emit, on, off } = useSocket({
    url:
      `${process.env.REACT_APP_WEBSOCKET_URL}/rooms` ||
      'http://localhost:8000/ws/rooms',
    autoConnect: true,
  });

  const [showRoundResult, setShowRoundResult] = useState(false);

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

  const leaveRoom = useCallback(() => {
    if (!room) {
      console.error('No room to leave');
      return;
    }
    if (!isConnected) {
      console.error('Socket is not connected. Cannot leave room.');
      return;
    }
    console.log('Leaving room:', room.id);
    emit('leave_room', { roomCode: room.id });
    setRoom(null);
    setRoomPlayers(null);
  }, [emit, isConnected, room, setRoom, setRoomPlayers]);

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
      setShowRoundResult(true);
    };

    const handleRoundWinnerSubmitted = (data: any) => {
      console.log('Round winner submitted:', data);
      const roomData = parseRoom(data);
      console.log('Parsed room data:', roomData);
      setRoom(roomData);
    };

    const handleRoundStartNext = (data: any) => {
      console.log('Round start next:', data);

      const roomData = parseRoom(data);
      console.log('Parsed room data:', roomData);
      setRoom(roomData);
      setShowRoundResult(false);
    };

    // Register event listeners
    on('room_updated', handleRoomUpdated);
    on('player_joined', handlePlayerJoined);
    on('player_left', handlePlayerLeft);
    on('game_started', handleGameStarted);
    on('turn_changed', handleTurnChanged);
    on('round_finished', handleRoundFinished);
    on('round_winner_submitted', handleRoundWinnerSubmitted);
    on('round_start_next', handleRoundStartNext);

    // Cleanup
    return () => {
      off('room_updated', handleRoomUpdated);
      off('player_joined', handlePlayerJoined);
      off('player_left', handlePlayerLeft);
      off('game_started', handleGameStarted);
      off('turn_changed', handleTurnChanged);
      off('round_finished', handleRoundFinished);
      off('round_winner_submitted', handleRoundWinnerSubmitted);
      off('round_start_next', handleRoundStartNext);
    };
  }, [socket, on, off, player, setRoom, setRoomPlayers]);

  const value: SocketContextType = {
    isConnected,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      <RoundResultPopup open={showRoundResult} setOpen={setShowRoundResult} />
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useRoomSocket must be used within a RoomSocketProvider');
  }
  return ctx;
};
