import { IsEmail, IsString, Length, Min, minLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
