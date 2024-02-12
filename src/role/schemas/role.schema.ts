import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleLevel } from '../entities/role-level.enum';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Role {
  @ApiProperty({
    description: 'Name of the role',
    enum: RoleLevel,
    required: true,
    example: RoleLevel.USER,
  })
  @Prop({ unique: [true, 'Role already exists'] })
  name: RoleLevel;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
