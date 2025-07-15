import React, { createContext, useContext, useState } from 'react';
import { Room, Player } from '../types/game';

interface RoomContextType {
  room: Room | null;
  setRoom: (room: Room | null) => void;
  roomPlayers: Player[] | null;
  setRoomPlayers: (players: Player[] | null) => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

interface RoomProviderProps {
  children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [roomPlayers, setRoomPlayers] = useState<Player[] | null>(null);

  const value: RoomContextType = {
    room,
    setRoom,
    roomPlayers,
    setRoomPlayers,
  };
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx)
    throw new Error('useRoomContext must be used within a RoomProvider');
  return ctx;
};
