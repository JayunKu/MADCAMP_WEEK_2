import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoomRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  host_user_id: string;
}
