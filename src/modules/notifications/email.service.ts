import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailOptions } from 'src/common/types/send-email-options.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_FROM'),
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to send email ${error.message}`, error.stack);
      } else {
        this.logger.error('Failed to send email', String(error));
      }
      return false;
    }
  }

  async sendMedicineReminder(
    email: string,
    name: string,
    medicineName: string,
    dosage: string,
  ): Promise<boolean> {
    const subject = `Reminder: Time to take ${medicineName}`;
    const text = `Hello ${name},\n\nIt's time to take your ${medicineName} (${dosage}).\n\nBest regards,\nYour Medicine Reminder App`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Medicine Reminder</h2>
        <p>Hello ${name},</p>
        <p>It's time to take your medication:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${medicineName}</h3>
          <p><strong>Dosage:</strong> ${dosage}</p>
        </div>
        <p>Best regards,<br>Your Medicine Reminder App</p>
      </div>
    `;

    return await this.sendEmail({ to: email, subject, text, html });
  }
}
