import { Test, TestingModule } from '@nestjs/testing';
import { BusinessDateController } from './business-date.controller';
import { IBusinessDateService } from '../domain/businessDay';
import { BusinessDateService } from '../application/business-date.service';
import { BadRequestException } from '@nestjs/common';

describe('BusinessDateController', () => {
  let controller: BusinessDateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessDateController],
      providers: [
        {
          provide: IBusinessDateService, // 👈 token = clase abstracta
          useClass: BusinessDateService, // implementación
        },
      ],
    }).compile();

    controller = module.get<BusinessDateController>(BusinessDateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the calculated date from the service', async () => {
    const result = await controller.getBusinessDate({
      days: 5,
      hours: 4,
      date: '2025-04-10T15:00:00.000Z',
    });
    expect(result).toEqual({ date: '2025-04-21T20:00:00.000Z' });
  });
  it('should throw BadRequestException when days and hours are missing', async () => {
    await expect(controller.getBusinessDate({})).rejects.toThrow(
      new BadRequestException({
        error: 'InvalidParameters',
        message: "You must provide at least 'date' 'days' or 'hours'.",
      }),
    );
  });
});
