import { Test, TestingModule } from '@nestjs/testing';
import { FullfillmentController } from './fullfillment.controller';

describe('FullfillmentController', () => {
  let controller: FullfillmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FullfillmentController],
    }).compile();

    controller = module.get<FullfillmentController>(FullfillmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
