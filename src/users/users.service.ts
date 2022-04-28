import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) throw new ForbiddenException('User already exists');

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
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
    });
  }
}
