import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MedicineModule } from 'src/modules/medicines/medicine.module';
import { ReminderModule } from 'src/modules/reminders/reminder.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MedicineModule,
    ReminderModule,
  ],
})
export class AppModule {}
