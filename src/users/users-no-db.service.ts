import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  users: User[];

  constructor() {
    this.users = [];
  }

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: this.users.length + 1,
      ...createUserDto,
    };

    this.users.push(user);

    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const i = this.users.findIndex((user) => user.id === id);

    const user = this.users[i];
    const userUpdated = {
      ...user,
      ...updateUserDto,
    };

    this.users[i] = userUpdated;

    return user;
  }

  remove(id: number) {
    this.users = this.users.filter((user) => user.id !== id);

    return id;
  }
}
