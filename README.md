Tentu! Berikut versi bahasa Inggris dari README-nya dalam format Markdown:

```markdown
# 🩺 Medicine Reminder System

Medicine Reminder System is a backend application built with [NestJS](https://nestjs.com/) to help users remember to take their medicines on time. Email reminders are sent at a fixed interval.

## ✨ Features

- CRUD for Medicines
- Reminder scheduling (cron job every 8 hours)
- Automatic email sending using Nodemailer
- Input validation using `class-validator`
- Environment-based configuration
- Built-in logging with NestJS

## 🛠️ Tech Stack

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemailer](https://nodemailer.com/)
- [Sendinblue SMTP](https://app.sendinblue.com/)
- [Cron Jobs](https://docs.nestjs.com/techniques/tasks)

## 🧪 Manual Cron Testing

To manually trigger a cron job without waiting for the scheduled time, you can call this endpoint:
```

GET /api/test-cron

````

## ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourname/medicine-reminder.git
cd medicine-reminder
````

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/medicine_reminder?schema=public
JWT_SECRET=your-secret-key

EMAIL_USER=your@email.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM="Medicine Reminder <your@email.com>"
EMAIL_HOST=smtp-relay.sendinblue.com
EMAIL_PORT=587
```

> 🛡️ Tip: You can use [Sendinblue](https://www.sendinblue.com/) as a free SMTP provider without needing Gmail.

4. **Generate Prisma Client**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Run the app**

```bash
npm run start:dev
```

## 📫 Example Reminder Email

```text
Subject: Reminder: Time to take Paracetamol

Hello Firman,

It's time to take your medication:

Paracetamol
Dosage: 500mg

Best regards,
Your Medicine Reminder App
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── medicines/
│   └── notifications/
├── common/
├── prisma/
├── main.ts
└── app.module.ts
```

## 🧑‍💻 Contributing

Pull requests are welcome for bug fixes, new features, or documentation improvements.
