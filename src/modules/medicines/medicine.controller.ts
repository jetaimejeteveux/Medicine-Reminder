import { Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/common/types/current-user-payload.interface';
import { CreateMedicineDto } from './dto/create-medicines.dto';
import { UpdateMedicineDto } from './dto/update-medicines.dto';

@UseGuards(JwtAuthGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    createMedicineDto: CreateMedicineDto,
  ) {
    return this.medicineService.create(user.userId, createMedicineDto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.medicineService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.medicineService.findOne(user.userId, +id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(user.userId, +id, updateMedicineDto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.medicineService.delete(user.userId, +id);
  }
}
