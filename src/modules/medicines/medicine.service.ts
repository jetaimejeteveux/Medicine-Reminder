import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicines.dto';
import { UpdateMedicineDto } from './dto/update-medicines.dto';

@Injectable()
export class MedicineService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createMedicineDto: CreateMedicineDto) {
    // Set schedule to every 8 hours for MVP
    const schedule = '0 */8 * * *';

    return this.prisma.medicine.create({
      data: {
        ...createMedicineDto,
        schedule,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.medicine.findMany({
      where: { userId },
    });
  }

  async findOne(userId: number, id: number) {
    return this.prisma.medicine.findFirst({
      where: { id, userId },
    });
  }

  async update(userId: number, id: number, updateMedicineDto: UpdateMedicineDto) {
    const medicine = await this.prisma.medicine.findFirst({
      where: { id, userId },
    });

    if (!medicine) {
      throw new NotFoundException('medicine with id = ${id}  is not found');
    }

    return this.prisma.medicine.update({
      where: { id },
      data: updateMedicineDto,
    });
  }

  async delete(userId: number, id: number) {
    const medicine = await this.prisma.medicine.findFirst({
      where: { id, userId },
    });

    if (!medicine) {
      throw new NotFoundException('medicine with id = ${id}  is not found');
    }

    return this.prisma.medicine.delete({
      where: { id },
    });
  }
}
