import { IsInt, IsOptional, IsPositive, IsISO8601, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBusinessDateDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(30, { message: 'days cannot be greater than 30' })
  days?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(24, { message: 'hours cannot be greater than 24' })
  hours?: number;

  @IsOptional()
  @IsISO8601()
  date?: string;
}
