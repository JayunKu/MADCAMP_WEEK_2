import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitAnswerRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  answer: string;
}
