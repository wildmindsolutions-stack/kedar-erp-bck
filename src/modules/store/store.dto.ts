import {
  IsArray, IsEmail, IsNumber, IsOptional, IsString, MinLength, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StoreLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class StoreResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class StoreRegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

class StoreOrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  qty: number;

  @IsNumber()
  rate: number;
}

export class StorePlaceOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StoreOrderItemDto)
  items: StoreOrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class StoreUpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class StoreContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;
}
