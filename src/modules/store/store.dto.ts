import {
<<<<<<< HEAD
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
=======
  IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StoreRegisterDto {
  @IsString()
  @IsNotEmpty()
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
<<<<<<< HEAD
=======
  @IsNotEmpty()
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
  phone: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

<<<<<<< HEAD
class StoreOrderItemDto {
  @IsString()
=======
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
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
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
<<<<<<< HEAD

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
=======
>>>>>>> 21f639055a5d2dafd5ce9461fd916247f95309b9
