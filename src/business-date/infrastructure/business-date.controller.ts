import { Controller, Get, Query } from '@nestjs/common';
import { IBusinessDateService } from '../domain/businessDay';
import { GetBusinessDateDto } from './dto-business-date';
import type { BusinessDateResponse } from './business-date.interface';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
@Controller('api/v1/business-date')
export class BusinessDateController {
  constructor(private readonly service: IBusinessDateService) {}
  @Get()
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Business days to add (positive integer).',
  })
  @ApiQuery({
    name: 'hours',
    required: false,
    type: Number,
    description: 'Business hours to add (positive integer).',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Starting UTC date (ISO 8601 with Z).',
  })
  @ApiResponse({
    status: 200,
    description: 'Calculated business date in UTC.',
    schema: {
      example: { date: '2025-04-21T20:00:00Z' },
    },
  })
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
