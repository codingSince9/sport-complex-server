import * as mongoose from 'mongoose';
import { Sport } from '../../sport/schemas/sport.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class SportsClass {
  @ApiProperty({
    description: 'Name of the class',
    type: String,
    required: true,
    example: 'Football HIIT Class',
  })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'Duration of the class in minutes',
    type: Number,
    required: true,
    example: 60,
  })
  @Prop()
  duration: number;

  @ApiProperty({
    description:
      'Deadline for the application to the class in the format MM/DD/YYYY',
    type: Number,
    required: true,
    example: '12/31/2024',
  })
  @Prop()
  applicationDeadline: string;

  @ApiProperty({
    description: 'Weekly schedule of the class',
    type: [String],
    required: true,
    example: ['Monday', 'Wednesday', 'Friday'],
  })
  @Prop([String])
  weekSchedule: string[];

  @ApiProperty({
    description: 'Start date of the class in the format MM/DD/YYYY',
    type: String,
    required: true,
    example: '10/05/2024',
  })
  @Prop()
  startDate: string;

  @ApiProperty({
    description: 'End date of the class in the format MM/DD/YYYY',
    type: String,
    required: true,
    example: '01/01/2026',
  })
  @Prop()
  endDate: string;

  @ApiProperty({
    description: 'Start time of the class in the format HH:MM',
    type: String,
    required: true,
    example: '15:00',
  })
  @Prop()
  startTime: string;

  @ApiProperty({
    description: 'Sport the class is about',
    type: String,
    required: true,
    example: 'Tennis',
  })
  @Prop({ type: mongoose.Schema.Types.String, ref: 'Sport' })
  sport: String;

  @ApiProperty({
    description: 'End time of the class in the format HH:MM',
    type: Array,
    required: false,
    example: ['5f9d7e3e6f6e4d0017f3b3e5'],
  })
  @Prop({ type: mongoose.Schema.Types.Array, ref: 'User' })
  students: mongoose.Schema.Types.ObjectId[];
}

export const SportsClassSchema = SchemaFactory.createForClass(SportsClass);
