import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as cronParser from 'cron-parser';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  @Cron('* * * * *')
  async handleCron() {
    this.logger.debug('Running medicine reminder cron job');
    const now = new Date();

    const medicinesWithUser = await this.prisma.medicine.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    for (const medicine of medicinesWithUser) {
      if (this.shouldSendReminder(medicine.schedule, now)) {
        this.logger.log(
          `Sending reminder to ${medicine.user.name} through ${medicine.user.email} for ${medicine.name}`,
        );
        await this.email.sendMedicineReminder(
          medicine.user.email,
          medicine.user.name,
          medicine.name,
          medicine.dosage,
        );
      }
    }
  }

  shouldSendReminder(medicineSchedule: string, currentTime: Date): boolean {
    try {
      const interval = cronParser.CronExpressionParser.parse(medicineSchedule);
      const prevDate = interval.prev().toDate();

      // Check if the current time is within 1 minute of the scheduled time
      const diffFromPrev = Math.abs(currentTime.getTime() - prevDate.getTime());
      return diffFromPrev < 60000;
    } catch (error) {
      this.logger.error(`Error parsing cron expression: ${medicineSchedule}`, error);
      return false;
    }
  }
}
