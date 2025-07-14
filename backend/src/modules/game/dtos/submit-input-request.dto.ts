import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SubmitInputRequestDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    @IsString()
    input: string
}