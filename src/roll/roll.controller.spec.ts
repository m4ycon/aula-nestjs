import { RollService } from './roll.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RollController } from './roll.controller';

describe('RollController', () => {
  let controller: RollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RollController],
      providers: [RollService],
    }).compile();

    controller = module.get<RollController>(RollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
