import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FakerModeTeamType } from 'src/config/redis/model';

export class SubmitRoundWinnerRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(FakerModeTeamType)
  winner_type: FakerModeTeamType;
}
