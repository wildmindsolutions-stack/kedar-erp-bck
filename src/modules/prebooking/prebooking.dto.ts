import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { normalizePhone } from '../../common/utils/phone.util';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class PreBookingItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsInt({ message: 'Quantity must be a whole number' })
  @Min(1)
  @Max(999)
  qty: number;
}

export class CreatePreBookingDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80, { message: 'Please enter your full name' })
  name: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? normalizePhone(value) : value,
  )
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Please enter a valid 10-digit mobile number',
  })
  phone: string;

  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === ''
      ? undefined
      : trim({ value }),
  )
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email?: string;

  @Transform(trim)
  @IsString()
  @Length(5, 300, { message: 'Please enter your full delivery address' })
  address: string;

  @Transform(trim)
  @IsString()
  @Length(2, 60)
  city: string;

  @Transform(trim)
  @IsString()
  @Length(2, 60)
  state: string;

  @Transform(trim)
  @Matches(/^[1-9]\d{5}$/, { message: 'Please enter a valid 6-digit pincode' })
  pincode: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  /** Honeypot — hidden on the website form; bots fill it, people don't. */
  @IsOptional()
  @IsString()
  website?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Please select at least one product' })
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PreBookingItemDto)
  items: PreBookingItemDto[];
}

export class ConfirmPreBookingDto {
  @IsOptional()
  @IsBoolean()
  generateInvoice?: boolean;

  @IsOptional()
  @IsBoolean()
  withGst?: boolean;
}

export class GenerateInvoiceDto {
  @IsOptional()
  @IsBoolean()
  withGst?: boolean;
}

export class DeliverPreBookingDto {
  @IsOptional()
  @IsBoolean()
  paymentReceived?: boolean;

  @IsOptional()
  @IsBoolean()
  generateInvoice?: boolean;

  @IsOptional()
  @IsBoolean()
  withGst?: boolean;
}
