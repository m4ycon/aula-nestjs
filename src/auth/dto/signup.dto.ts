import { IsOptional, IsString } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  // email
  // password

  @IsOptional()
  @IsString()
  name: string;
}
