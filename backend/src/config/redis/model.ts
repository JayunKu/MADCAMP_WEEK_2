export enum GameMode {
  BASIC = 0,
  FAKER = 1,
}

export enum GameStatus {
  WAITING = 0,
  STARTED = 1,
  ENDED = 2,
}

export enum FakerModeTeamType {
  KEEPER = 0,
  FAKER = 1,
}

export interface Room {
  id: string;
  host_player_id: string;

  game_mode: GameMode;
  game_status: GameStatus;

  round_number: number | null;
  round_winners: FakerModeTeamType[];

  keeper_player_ids: string[];
  fakers_player_ids: string[];

  response_player_ids: string[];
  response_player_inputs: string[];
  response_player_file_ids: string[];

  turn_player_id: string | null;
}

export interface Player {
  id: string;
  name: string;
  avatar_id: number;
  is_member: boolean;
  room_id: string | null;
}
