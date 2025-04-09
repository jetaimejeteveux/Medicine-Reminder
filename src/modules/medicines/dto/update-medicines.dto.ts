import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicineDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  schedule?: string;
}
