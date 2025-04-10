import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MedicineModule } from 'src/modules/medicines/medicine.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { ReminderModule } from 'src/modules/reminders/reminder.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    MedicineModule,
    ReminderModule,
    NotificationsModule,
  ],
})
export class AppModule {}
