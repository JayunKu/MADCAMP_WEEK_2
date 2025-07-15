import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitImageRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  input: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  file_url: string;
}
