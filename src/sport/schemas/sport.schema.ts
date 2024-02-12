import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Sport {
  @ApiProperty({
    description: 'Name of the sport',
    type: String,
    required: true,
    example: 'Tennis',
  })
  @Prop({ unique: [true, 'Sport already exists'] })
  name: string;
}

export const SportSchema = SchemaFactory.createForClass(Sport);
