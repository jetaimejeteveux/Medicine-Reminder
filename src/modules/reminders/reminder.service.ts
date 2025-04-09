import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 */8 * * *')
  async handleCron() {
    this.logger.debug('Running medicine reminder cron job');

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
      this.logger.log(
        `Sending reminder to ${medicine.user.name} through ${medicine.user.email} for ${medicine.name}`,
      );
      await this.sendReminderEmail(
        medicine.user.email,
        medicine.user.name,
        medicine.name,
        medicine.dosage,
      );
    }
  }

  sendReminderEmail(
    userEmail: string,
    username: string,
    medicineName: string,
    medicineDosage: string,
  ) {
    this.logger.log(
      `Sending email to ${userEmail}. \n\n Hi ${username} do not forget to take your medicine = ${medicineName} with ${medicineDosage}`,
    );
    return Promise.resolve({
      success: true,
      recipient: userEmail,
      message: `Medicine reminder for ${medicineName}`,
    });
  }
}
