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
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: createPostDto.categories },
      },
    });

    if (categories.length !== createPostDto.categories?.length)
      throw new BadRequestException('One or more categories do not exist');

    const post = await this.prisma.post
      .create({
        data: {
          ...createPostDto,
          categories: createPostDto.categories && {
            connect: createPostDto.categories.map((category) => ({
              id: category,
            })),
          },
        },
        include: {
          categories: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientValidationError) {
          throw new BadRequestException();
        }

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025')
            throw new NotFoundException('Category not found');
          if (e.code === 'P2003')
            throw new NotFoundException('Author not found');
        }
      });

    return post;
  }

  findAll(page: number) {
    return this.prisma.post.findMany({
      skip: (page - 1) * 5,
      take: 5,
      include: { categories: true },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async addCategory(id: number, categoryId: number) {
    return this.prisma.post
      .update({
        where: { id },
        data: { categories: { connect: { id: categoryId } } },
        include: { categories: true },
      })
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025')
            throw new NotFoundException(`Category not found`);
          if (e.code === 'P2016') throw new NotFoundException(`Post not found`);
        }
      });
  }

  removeCategory(id: number, categoryId: number) {
    return this.prisma.post.update({
      where: { id },
      data: { categories: { disconnect: { id: categoryId } } },
      include: { categories: true },
    });
  }
}
