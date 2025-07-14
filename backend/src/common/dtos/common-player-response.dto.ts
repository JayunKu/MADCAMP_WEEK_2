import { Player } from 'src/config/redis/model';

export class CommonPlayerResponseDto {
  id: string;
  name: string;
  avatar_id: number;
  is_member: boolean;
  room_id: string | null;

  constructor(player: Player) {
    this.id = player.id;
    this.name = player.name;
    this.avatar_id = player.avatar_id;
    this.is_member = player.is_member;
    this.room_id = player.room_id;
  }
}
