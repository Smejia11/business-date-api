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

  it(`Petición un viernes a las 5:00 p.m. con "hours=1"Resultado esperado: lunes a las 9:00 a.m.
    (hora Colombia) → "2025-XX-XXT14:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      hours: 1,
      date: '2025-09-26T22:00:00Z',
    });
    expect(result).toEqual({ date: '2025-09-29T14:00:00Z' });
  });

  it(`Petición un sábado a las 2:00 p.m. con "hours=1"
Resultado esperado: lunes a las 9:00 a.m. (hora Colombia) → "2025-XX-XXT14:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      hours: 1,
      date: '2025-09-27T19:00:00Z',
    });
    expect(result).toEqual({ date: '2025-09-29T14:00:00Z' });
  });

  it(`Petición con "days=1" y "hours=4" desde un martes a las 3:00 p.m.
Resultado esperado: jueves a las 10:00 a.m. (hora Colombia) → "2025-XX-XXT15:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      days: 1,
      hours: 4,
      date: '2025-09-23T20:00:00Z',
    });
    expect(result).toEqual({ date: '2025-09-25T15:00:00Z' });
  });

  it(`Petición con "days=1" desde un domingo a las 6:00 p.m.
Resultado esperado: lunes a las 5:00 p.m. (hora Colombia) → "2025-XX-XXT22:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      days: 1,
      date: '2025-09-28T23:00:00Z',
    });
    expect(result).toEqual({ date: '2025-09-29T22:00:00Z' });
  });

  it(`Petición con "hours=8"  desde un día laboral a las 8:00 a.m.
Resultado esperado: mismo día a las 5:00 p.m. (hora Colombia) → "2025-XX-XXT22:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      hours: 8,
      date: '2025-09-23T13:00:00Z',
    });
    expect(result).toEqual({ date: '2025-09-23T22:00:00Z' });
  });

  it(`Petición con "days=1"  desde un día laboral a las 8:00 a.m.
Resultado esperado: siguiente día laboral a las 8:00 a.m. (hora Colombia) → "2025-XX-XXT13:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      days: 1,
      date: '2025-09-23T13:00:00Z',
    });
    expect(result).toEqual({ date: '2025-09-24T13:00:00Z' });
  });

  it(`Petición con "days=1"  desde un día laboral a las 12:30 p.m.
Resultado esperado: siguiente día laboral a las 12:00 p.m. (hora Colombia) → "2025-XX-XXT17:00:00Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      days: 1,
      date: '2025-09-23T17:30:00Z',
    });
    expect(result).toEqual({ date: '2025-09-24T17:00:00Z' });
  });

  it(`Petición con "hours=3"  desde un día laboral a las 11:30 p.m. 
Resultado esperado: mismo día laboral a las 3:30 p.m. (hora Colombia) → 2025-XX-XXT20:30:00Z (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      hours: 3,
      date: '2025-09-23T16:30:00Z',
    });
    expect(result).toEqual({ date: '2025-09-23T20:30:00Z' });
  });

  it(`Petición con "date=2025-04-10T15:00:00.000Z" y "days=5" y "hours=4"  (el 17 y 18 de abril son festivos)
Resultado esperado: 21 de abril a las 3:00 p.m. (hora Colombia) → "2025-04-21T20:00:00.000Z" (UTC)`, async () => {
    const result = await controller.getBusinessDate({
      days: 5,
      hours: 4,
      date: '2025-04-10T15:00:00.00Z',
    });
    expect(result).toEqual({ date: '2025-04-21T20:00:00Z' });
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
