import {
  FakerModeTeamType,
  GameMode,
  GameStatus,
  Room,
} from 'src/config/redis/model';

export class CreateRoomResponseDto {
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

  constructor(room: Room) {
    this.id = room.id;
    this.host_player_id = room.host_player_id;
    this.game_mode = room.game_mode;
    this.game_status = room.game_status;
    this.round_number = room.round_number;
    this.round_winners = room.round_winners;
    this.keeper_player_ids = room.keeper_player_ids;
    this.fakers_player_ids = room.fakers_player_ids;
    this.response_player_ids = room.response_player_ids;
    this.response_player_inputs = room.response_player_inputs;
    this.response_player_file_ids = room.response_player_file_ids;
    this.turn_player_id = room.turn_player_id;
  }
}
