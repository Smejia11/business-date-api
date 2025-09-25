import { Module } from '@nestjs/common';
import { BusinessDateModule } from './business-date/infrastructura/business-date.module';

@Module({
  imports: [BusinessDateModule],
})
export class AppModule {}
