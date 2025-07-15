export interface Player {
  id: string;
  name: string;
  avatarId: number;
  isMember: boolean;
  roomId?: string;
}
export const parsePlayer = (data: any): Player => {
  return {
    id: data.id,
    name: data.name,
    avatarId: data.avatar_id,
    isMember: data.is_member,
    roomId: data.room_id,
  };
};

export enum GameMode {
  BASIC = 0,
  FAKER = 1,
}

export enum GameStatus {
  WAITING = 0,
  ANSWER_INPUT = 1,
  PLAYING = 2,
  FINISHED = 3,
}

export enum FakerModeTeamType {
  KEEPER = 0,
  FAKER = 1,
}
export interface Room {
  id: string;
  hostPlayerId: string;
  gameMode: GameMode;
  gameStatus: GameStatus;
  roundNumber: number;
  roundWinners: FakerModeTeamType[];
  keeperPlayerIds: string[];
  fakersPlayerIds: string[];
  responsePlayerIds: string[];
  responsePlayerInputs: string[];
  responsePlayerFileIds: string[];
  turnPlayerIndex: number;
}

export const parseRoom = (data: any): Room => {
  return {
    id: data.id,
    hostPlayerId: data.host_player_id,
    gameMode: data.game_mode,
    gameStatus: data.game_status,
    roundNumber: data.round_number,
    roundWinners: data.round_winners || [],
    keeperPlayerIds: data.keeper_player_ids || [],
    fakersPlayerIds: data.fakers_player_ids || [],
    responsePlayerIds: data.response_player_ids || [],
    responsePlayerInputs: data.response_player_inputs || [],
    responsePlayerFileIds: data.response_player_file_ids || [],
    turnPlayerIndex: data.turn_player_index,
  };
};
