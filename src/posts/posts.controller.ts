import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { isInt, min } from 'class-validator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get(':page')
  findAll(@Param('page') page: string) {
    if (!(isInt(+page) && min(+page, 1)))
      throw new BadRequestException('Page must be a number greater than 0');

    return this.postsService.findAll(+page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Post('/:id/categories')
  addCategory(@Param('id') id: string, @Body() body: { categoryId: number }) {
    return this.postsService.addCategory(+id, body.categoryId);
  }

  @Delete('/:id/categories/:categoryId')
  removeCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.postsService.removeCategory(+id, +categoryId);
  }
}
