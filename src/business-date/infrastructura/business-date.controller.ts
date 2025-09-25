import { Controller, Get, Query } from '@nestjs/common';
import { IBusinessDateService } from '../domain/businessDay';
import { GetBusinessDateDto } from './dto-business-date';
import type { BusinessDateResponse } from './business-date.interface';

@Controller('api/v1/business-date')
export class BusinessDateController {
  constructor(private readonly service: IBusinessDateService) {}

  @Get()
  async getBusinessDate(
    @Query() query: GetBusinessDateDto,
  ): Promise<BusinessDateResponse> {
    const result: string = await this.service.calculate(
      query.days,
      query.hours,
      query.date,
    );
    return { date: result };
  }
}
