import { Module } from '@nestjs/common';
import { BusinessDateController } from './business-date.controller';
import { BusinessDateService } from '../application/business-date.service';
import { IBusinessDateService } from '../domain/businessDay';

@Module({
  providers: [
    {
      provide: IBusinessDateService, // clase abstracta
      useClass: BusinessDateService, // implementación
    },
  ],
  controllers: [BusinessDateController],
  exports: [
    {
      provide: IBusinessDateService,
      useClass: BusinessDateService,
    },
  ],
})
export class BusinessDateModule {}
