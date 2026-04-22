import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDto {


    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ default: "ayti.xn.9@gmail.com" })
    email!: string;

    @IsString()
    @Matches(/^[A-Za-z0-9]{6,}$/, {
        message: 'Password must contain only letters and numbers, min 6 chars',
    })
    @ApiProperty({ default: "123456" })
    password!: string;
}
