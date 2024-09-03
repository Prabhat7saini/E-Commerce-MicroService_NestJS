import { Test, TestingModule } from '@nestjs/testing';
import { FullfillmentService } from './fullfillment.service';

describe('FullfillmentService', () => {
  let service: FullfillmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FullfillmentService],
    }).compile();

    service = module.get<FullfillmentService>(FullfillmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
