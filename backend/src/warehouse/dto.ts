import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateRackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity: number;
}

export class CreateShelfDto extends CreateRackDto {
  @IsUUID()
  rackId: string;
}

export class CreateContainerDto extends CreateRackDto {
  @IsUUID()
  shelfId: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateBoxDto extends CreateRackDto {
  @IsUUID()
  containerId: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateStorageDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minQuantity?: number;

  @IsUUID()
  boxId: string;

  @IsOptional()
  @IsString()
  imageKey?: string | null;
}

export class UpdateUnitDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minQuantity?: number;

  @IsOptional()
  @IsString()
  imageKey?: string | null;
}

export class ReorderUnitsDto {
  @IsUUID()
  boxId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  unitIds: string[];
}
