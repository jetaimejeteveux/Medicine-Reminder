# 🩺 Medicine Reminder System

Medicine Reminder System adalah aplikasi backend berbasis [NestJS](https://nestjs.com/) yang digunakan untuk mengingatkan pengguna agar tidak lupa mengonsumsi obat sesuai jadwal. Pengingat dikirim melalui email setiap interval tertentu.

## ✨ Fitur

- CRUD Obat (Medicine)
- Penjadwalan pengingat (cron job) setiap 8 jam
- Pengiriman email otomatis menggunakan Nodemailer
- Validasi data menggunakan class-validator
- Konfigurasi environment dengan dotenv
- Logging bawaan NestJS

## 🛠️ Teknologi

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemailer](https://nodemailer.com/)
- [Sendinblue SMTP](https://app.sendinblue.com/)
- [Cron Job](https://docs.nestjs.com/techniques/tasks)

## 🧪 Testing Manual Cron

Untuk menguji fungsi cron tanpa menunggu waktu tertentu, tersedia endpoint:

```

GET /api/test-cron

```

## ⚙️ Instalasi

1. **Clone repositori**

```bash
git clone https://github.com/namamu/medicine-reminder.git
cd medicine-reminder
```

2. **Instal dependensi**

```bash
npm install
```

3. **Konfigurasi environment**

Buat file `.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/medicine_reminder?schema=public
JWT_SECRET=your-secret-key

EMAIL_USER=your@email.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM="Medicine Reminder <your@email.com>"
EMAIL_HOST=smtp-relay.sendinblue.com
EMAIL_PORT=587
```

> 🛡️ Tips: Gunakan aplikasi seperti [Sendinblue](https://www.sendinblue.com/) untuk SMTP gratis tanpa harus pakai Gmail.

4. **Generate Prisma**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Jalankan aplikasi**

```bash
npm run start:dev
```

## 📫 Contoh Email Reminder

```html
Subject: Reminder: Time to take Paracetamol Hello Firman, It's time to take your medication:
Paracetamol Dosage: 500mg Best regards, Your Medicine Reminder App
```

## 📁 Struktur Folder

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

## 🚀 Rencana Pengembangan

- [ ] Reminder berdasarkan interval spesifik per obat
- [ ] Dashboard pengguna
- [ ] Reminder via WhatsApp/Telegram
- [ ] Autentikasi & RBAC

## 🧑‍💻 Kontribusi

Pull Request terbuka untuk perbaikan bug, penambahan fitur, atau peningkatan dokumentasi!

## 📄 Lisensi

MIT License.

```

Kalau kamu butuh README versi berbahasa Inggris atau ingin ditambah badge dan gambar diagram arsitektur, tinggal bilang aja ya.
```
