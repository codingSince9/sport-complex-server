import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
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
    description: "User's password confirmation",
    type: String,
    required: true,
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly confirmPassword: string;
}
