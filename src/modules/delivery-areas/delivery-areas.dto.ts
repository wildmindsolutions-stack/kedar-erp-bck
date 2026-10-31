import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateDeliveryAreaDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80)
  name: string;

  @IsArray()
  @ArrayMaxSize(500)
  @Matches(/^[1-9]\d{5}$/, {
    each: true,
    message: 'Each pincode must be 6 digits',
  })
  pincodes: string[];

  @IsOptional()
  @IsString()
  supervisorId?: string | null;
}

export class UpdateDeliveryAreaDto {
  @Transform(trim)
  @IsOptional()
  @IsString()
  @Length(2, 80)
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @Matches(/^[1-9]\d{5}$/, {
    each: true,
    message: 'Each pincode must be 6 digits',
  })
  pincodes?: string[];

  @IsOptional()
  @IsString()
  supervisorId?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SetSupervisorDto {
  @IsOptional()
  @IsString()
  supervisorId?: string | null;
}
