import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitAnswerRequestDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  answer: string;
}
