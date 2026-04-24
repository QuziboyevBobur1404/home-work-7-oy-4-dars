import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { Auth } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import nodemailer from "nodemailer";
import { VerifyDto } from "./dto/verify.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dto/login.dto";
@Injectable()
export class AuthService {
  private nodemailer: nodemailer.Transporter;
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.nodemailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ayti.xn.9@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
  }
  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password } = createAuthDto;
    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (foundedUser) throw new BadRequestException("user already exsist");

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    const time = Date.now() + 120000;

    await this.nodemailer.sendMail({
      from: "ayti.xn.9@gmail.com",
      to: email,
      subject: "lesson",
      text: "test content",
      html: `<b>${otp}</b>`,
    });

    const user = this.authRepo.create({
      username,
      email,
      password: hashPassword,
      otp,
      otpTime: time,
    });
    await this.authRepo.save(user);
    return { message: "Registered" };
  }

  async verify(dto: VerifyDto) {
    const { email, otp } = dto;
    const foundeduser = await this.authRepo.findOne({ where: { email } });

    const otpValidation = /^\d{6}$/.test(otp);
    if (!otpValidation) throw new BadRequestException("Invaled otp");

    if (!foundeduser) throw new UnauthorizedException("Email not found");

    if (foundeduser.otp !== otp) throw new BadRequestException("Wrong otp!");

    const now = Date.now();

    if (foundeduser.otpTime && foundeduser.otpTime < now)
      throw new BadRequestException("Otp expired");

    await this.authRepo.update(foundeduser.id, { otp: "", otpTime: 0 });

    const payload = { username: foundeduser.username, role: foundeduser.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const foundedUser = await this.authRepo.findOne({ where: { email } });

    if (!foundedUser) throw new BadRequestException("user not found");

    const chekPassword = await bcrypt.compare(password, foundedUser.password);

    if (chekPassword) {
      const otp = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");
      const time = Date.now() + 120000;

      await this.nodemailer.sendMail({
        from: "ayti.xn.9@gmail.com",
        to: email,
        subject: "lesson",
        text: "test content",
        html: `<b>${otp}</b>`,
      });
      const now = Date.now();
      await this.authRepo.update(foundedUser.id, { otp, otpTime: time });
      return { message: "Please check your email" };
    } else {
      throw new BadRequestException("Wrong password");
    }
  }
}
