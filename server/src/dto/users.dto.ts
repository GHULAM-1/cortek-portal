import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import type { UserRole } from '../types/users-types';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(['superAdmin', 'admin', 'team', 'client'])
  role: UserRole;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['superAdmin', 'admin', 'team', 'client'])
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}