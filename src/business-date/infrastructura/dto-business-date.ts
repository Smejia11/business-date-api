import { IsInt, IsOptional, IsPositive, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBusinessDateDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  days?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  hours?: number;

  @IsOptional()
  @IsISO8601()
  date?: string;
}
