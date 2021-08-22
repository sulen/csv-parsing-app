import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string | null;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  roleDescription: string | null;

  @IsString()
  @IsOptional()
  team: string | null;
}
