import { Module } from '@nestjs/common';
import { RollController } from './roll.controller';
import { RollService } from './roll.service';

@Module({
  controllers: [RollController],
  providers: [RollService],
})
export class RollModule {}
