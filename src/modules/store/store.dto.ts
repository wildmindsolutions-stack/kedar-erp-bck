import {
  IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StoreRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

export class StoreLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class StoreOrderItemDto {
  @IsString()
  @IsNotEmpty()
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
