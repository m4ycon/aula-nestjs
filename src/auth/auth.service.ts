import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(signUpDto.password, salt);

    const user = await this.userService.create({ ...signUpDto, password });

    return this.signToken(user.id, user.email);
  }

  async signin(signInDto: SignInDto) {
    const user = await this.userService.findOne({ email: signInDto.email });

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  async signToken(id: number, email: string) {
    const payload = { id, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
