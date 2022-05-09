import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
  async cleanDb() {
    await this.user.deleteMany();
    await this.post.deleteMany();
    await this.category.deleteMany();
    await this.profile.deleteMany();
  }
}
