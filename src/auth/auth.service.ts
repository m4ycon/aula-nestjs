import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(signUpDto: SignUpDto) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(signUpDto.password, salt);

    const user = await this.userService.create({ ...signUpDto, password });

    return user;
  }

  async signin(signInDto: SignInDto) {
    const user = await this.userService.findOne({ email: signInDto.email });

    const passwordMatches = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    return 'ok';
  }
}
