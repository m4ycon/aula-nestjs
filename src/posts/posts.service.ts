import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const post = await this.prisma.post
      .create({
        data: {
          ...createPostDto,
          categories: {
            connect: createPostDto.categories.map((category) => ({
              id: category,
            })),
          },
        },
        include: {
          categories: true,
          author: true,
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientValidationError) {
          console.log(e.message);
          throw new BadRequestException();
        }

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025')
            throw new NotFoundException('Category not found');
        }
      });

    return post;
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
