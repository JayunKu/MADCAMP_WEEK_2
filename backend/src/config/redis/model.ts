export enum GameMode {
  BASIC = 0,
  FAKER = 1,
}

export enum GameStatus {
  WAITING = 0,
  ANSWER_INPUT = 1,
  STARTED = 2,
  FINISHED = 3,
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

  round_number: number;
  round_answer: string;
  round_winners: FakerModeTeamType[];

  keeper_player_ids: string[];
  fakers_player_ids: string[];

  response_player_ids: string[];
  response_player_inputs: string[];
  response_player_file_urls: string[];

  turn_player_index: number;
}

export interface Player {
  id: string;
  name: string;
  avatar_id: number;
  is_member: boolean;
  room_id: string | null;
}
