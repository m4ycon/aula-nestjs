import { Injectable } from '@nestjs/common';

@Injectable()
export class RollService {
  roll(num: number): number {
    return Math.ceil(Math.random() * num);
  }
}
