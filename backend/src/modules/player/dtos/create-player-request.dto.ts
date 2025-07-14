import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePlayerRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  player_id?: string;
}
