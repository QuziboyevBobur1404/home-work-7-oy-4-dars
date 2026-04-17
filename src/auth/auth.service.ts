import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './model/auth.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from "bcrypt"
import { Article } from 'src/article/model/article.entity';
@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth) private authModel: typeof Auth ) {}

 async register(createAuthDto: CreateAuthDto) {
  const {username,email,password} = createAuthDto
  const foundedUser = await this.authModel.findOne({where: {email}, raw: true})

  if(foundedUser) throw new BadRequestException("user already exsist")

    const hashPassword = await bcrypt.hash(password, 10)

    const otp = +Array.from({length: 6}, () => Math.floor(Math.random() * 9 )).join("")

  return this.authModel.create({username, email, password: hashPassword, otp});
}

  async findAll() {
    return await this.authModel.findAll({
      attributes: { exclude: ["password"]},
        include: [{ model: Article }]
      }); 
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
