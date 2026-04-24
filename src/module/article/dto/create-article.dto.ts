import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @ApiProperty({ default: "HTML" })
    title!: string;

    @IsString()
    @ApiProperty({ default: "HTML is cool" })
    content!: string;



}
