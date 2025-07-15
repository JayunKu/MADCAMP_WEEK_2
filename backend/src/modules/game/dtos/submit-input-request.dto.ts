import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitInputRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  input: string;
}
