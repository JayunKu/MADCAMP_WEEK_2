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
  host_user_id: string;

  game_mode: GameMode;
  game_status: GameStatus;

  round_number: number | null;
  round_winners: FakerModeTeamType[];

  keeper_user_ids: string[];
  fakers_user_ids: string[];

  response_user_ids: string[];
  response_user_inputs: string[];
  response_user_file_ids: string[];

  turn_player_id: string | null;
}

export interface User {
  is_member: boolean;
  room_id: string | null;
  id: string;
}
