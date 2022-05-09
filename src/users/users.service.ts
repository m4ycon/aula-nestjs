import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';

type userIdentifier =
  | {
      id: number;
      email?: never;
    }
  | {
      id?: never;
      email: string;
    };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (userExists) throw new ForbiddenException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        Profile: { create: {} },
      },
      select: {
        id: true,
        email: true,
        name: true,
        Profile: true,
        Post: true,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      // select: {
      //   id: true,
      //   email: true,
      //   name: true,
      //   Post: true,
      //   Profile: true,
      // },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        Profile: true,
        Post: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findHashByEmail(email: string) {
    const hash = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!hash) throw new NotFoundException('User not found');

    return hash;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // checa se o usuário existe
    await this.findOne(id);

    const userUpdated = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return userUpdated;
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: {
        id,
      },
      include: {
        Profile: true,
        Post: true,
      },
    });
  }
}
