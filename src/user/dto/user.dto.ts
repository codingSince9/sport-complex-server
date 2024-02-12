import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RoleLevel } from '../../role/entities/role-level.enum';
import { Role } from '../../role/schemas/role.schema';

export class UserDto {
  @ApiProperty({
    description: "User's email address",
    type: String,
    required: true,
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;

  @ApiProperty({
    description: "User's password",
    type: String,
    required: true,
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly password: string;

  @ApiProperty({
    description: "User's role",
    enum: RoleLevel,
    required: true,
    example: RoleLevel.USER,
  })
  @IsNotEmpty()
  @IsString()
  readonly role: RoleLevel;
}
