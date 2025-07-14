import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";

export class SubmitImageRequestDto {
  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsString()
  input: string;

  @ApiProperty({required: true})
  @IsNotEmpty()
  @IsString()
  file_id: string;
}
