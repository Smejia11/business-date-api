import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDateService } from './business-date.service';

describe('BusinessDateService', () => {
  let service: BusinessDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessDateService],
    }).compile();

    service = module.get<BusinessDateService>(BusinessDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
