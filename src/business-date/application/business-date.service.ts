import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import Holidays from 'date-holidays';
import { IBusinessDateService } from '../domain/businessDay';

@Injectable()
export class BusinessDateService extends IBusinessDateService {
  private hd = new Holidays('CO');

  private isBusinessDay(dt: DateTime): boolean {
    const isWeekend = dt.weekday > 5;
    const isHoliday = !!this.hd.isHoliday(dt.toJSDate());
    return !isWeekend && !isHoliday;
  }

  private addBusinessDays(start: DateTime, days: number): DateTime {
    let d = start;
    console.log({ date: d.toISO() }, 'start date');
    while (days > 0) {
      let hour: number = d.hour ?? 8;
      if (hour > 17) hour = 17;

      d = d.plus({ days: 1 }).set({ hour, minute: 0, second: 0 });
      const isBusinessDay = this.isBusinessDay(d);
      console.log(
        { businessDay: isBusinessDay, date: d.toISODate() },
        'addBusinessDays',
      );
      if (isBusinessDay) days--;
    }
    console.log(d.toISO(), 'end date');
    return d;
  }

  private addBusinessHours(start: DateTime, hours: number): DateTime {
    let d: DateTime = start;
    while (hours > 0) {
      const hour = d.hour;
      d = d.plus({ hours: 1 });
      const inMorning = hour >= 8 && hour < 12;
      const inAfternoon = hour >= 13 && hour < 17;
      console.log(
        { businessDay: this.isBusinessDay(d), date: d.toISODate(), hour },
        'addBusinessDays',
      );
      if (this.isBusinessDay(d) && (inMorning || inAfternoon)) {
        hours--;
      } else if (hour >= 17) {
        d = d.plus({ days: 1 }).set({ hour: 8 });
        while (!this.isBusinessDay(d)) d = d.plus({ days: 1 }).set({ hour: 8 });
      }
    }
    return d;
  }

  calculate(days?: number, hours?: number, date?: string): Promise<string> {
    if (!date && !hours && !days) {
      throw new BadRequestException({
        error: 'InvalidParameters',
        message: "You must provide at least 'date' 'days' or 'hours'.",
      });
    }
    let current = date
      ? DateTime.fromISO(date, { zone: 'utc' }).setZone('America/Bogota')
      : DateTime.now().setZone('America/Bogota');

    if (days) current = this.addBusinessDays(current, days);
    if (hours) current = this.addBusinessHours(current, hours);

    const res = current.setZone('UTC').toISO({ suppressMilliseconds: true });

    if (!res)
      throw new InternalServerErrorException({
        error: 'Internal Server Error',
        message: 'Failed implementation',
      });

    return Promise.resolve(res);
  }
}
