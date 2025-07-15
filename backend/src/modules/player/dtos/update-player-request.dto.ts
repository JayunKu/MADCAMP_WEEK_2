import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlayerRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
