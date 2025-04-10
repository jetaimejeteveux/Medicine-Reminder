import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [ReminderService],
})
export class ReminderModule {}
