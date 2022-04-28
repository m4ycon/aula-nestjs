import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  categories?: number[];
}
