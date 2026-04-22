import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @MinLength(3, { message: "Kamida 3 ta harf bo'lsin" })
  @MaxLength(50)
  @ApiProperty({ default: "Ali" })
  username!: string;

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
