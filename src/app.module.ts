import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RollModule } from './roll/roll.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RollModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
