import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleLevel } from '../../role/entities/role-level.enum';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'test@gmail.com',
  })
  @Prop({ unique: [true, 'Email already exists'] })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    required: true,
    example: 'password123',
  })
  @Prop()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: RoleLevel,
    required: true,
    example: RoleLevel.USER,
  })
  @Prop({ type: mongoose.Schema.Types.String, ref: 'Role' })
  role: RoleLevel;
}

export const UserSchema = SchemaFactory.createForClass(User);
