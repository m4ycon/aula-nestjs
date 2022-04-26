import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RollModule } from './roll/roll.module';

@Module({
  imports: [RollModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
