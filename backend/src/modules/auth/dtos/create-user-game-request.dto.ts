import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateUserGameRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  is_win: boolean;
}
