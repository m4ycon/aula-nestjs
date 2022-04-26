import { Controller, Get, Param } from '@nestjs/common';
import { RollService } from './roll.service';

@Controller('roll')
export class RollController {
  constructor(private rollService: RollService) {}

  @Get()
  roll10(): number {
    return this.rollService.roll(10);
  }

  @Get(':num')
  roll(@Param('num') num: number): number {
    return this.rollService.roll(num);
  }
}
