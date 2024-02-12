import * as mongoose from 'mongoose';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { isScheduleValid } from '../../class/validators/schedule.validator';
import { isSportExist } from '../../class/validators/sport.validator';
import { Sport } from '../../sport/schemas/sport.schema';
import { ApiProperty } from '@nestjs/swagger';
import { isDeadlineValid } from '../validators/deadline.validator';
import { isStartDateValid } from '../validators/start-date.validator';
import { isEndDateValid } from '../validators/end-date.validator';
import { isStudentExist } from '../validators/student.validator';

export class SportsClassDto {
  @ApiProperty({
    description: 'Name of the class',
    type: String,
    required: true,
    example: 'Football HIIT Class',
  })
  @IsNotEmpty({ message: 'Description should not be empty.' })
  @IsString({ message: 'Please enter a class description.' })
  readonly description: string;

  @ApiProperty({
    description: 'Duration of the class in minutes',
    type: String,
    required: true,
    example: 60,
  })
  @IsInt({
    message: 'Please enter duration of the class in number of minutes.',
  })
  @Min(30, { message: 'Duration of the class must be at least 30 minutes.' })
  @Max(180, { message: 'Duration of the class must be at most 180 minutes.' })
  readonly duration: number;

  @ApiProperty({
    description:
      'Deadline for the application to the class in the format DD/MM/YYYY',
    type: Number,
    required: true,
    example: '12/31/2024',
  })
  @IsString({ message: 'Application deadline must be a string.' })
  @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: 'Application deadline must be in the format MM/DD/YYYY',
  })
  @isDeadlineValid({ context: this })
  readonly applicationDeadline: string;

  @ApiProperty({
    description: 'Days of the week the class is scheduled',
    type: Array,
    required: true,
    example: ['Monday', 'Wednesday', 'Friday'],
  })
  @IsArray({ message: 'Please enter the days of the week.' })
  @ArrayMinSize(1, { message: 'Please enter at least one day of the week.' })
  @isScheduleValid()
  readonly weekSchedule: string[];

  @ApiProperty({
    description: 'Start date of the class in the format MM/DD/YYYY',
    type: String,
    required: true,
    example: '10/05/2024',
  })
  @IsString({ message: 'Start date must be a string.' })
  @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: 'Start date must be in the format MM/DD/YYYY',
  })
  @isStartDateValid()
  readonly startDate: string;

  @ApiProperty({
    description: 'End date of the class in the format MM/DD/YYYY',
    type: String,
    required: true,
    example: '01/01/2026',
  })
  @IsString({ message: 'End date must be a string.' })
  @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, {
    message: 'End date must be in the format MM/DD/YYYY',
  })
  @isEndDateValid({ context: this })
  readonly endDate: string;

  @ApiProperty({
    description: 'Start time of the class in the format HH:mm',
    type: String,
    required: true,
    example: '18:00',
  })
  @IsString()
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in the format HH:mm',
  })
  readonly startTime: string;

  @ApiProperty({
    description: 'Name of the sport',
    type: String,
    required: true,
    example: 'Tennis',
  })
  @IsNotEmpty({ message: 'Please enter a sport.' })
  @IsString({ message: 'Sport name must be a string.' })
  @isSportExist()
  readonly sport: string;

  @ApiProperty({
    description: 'Array of students that applied to the class',
    type: Number,
    required: false,
    example: ['65c287582568814f7813d85f'],
  })
  @IsOptional()
  @IsArray({
    message: 'Students must be an empty array or an array of student ids.',
  })
  @isStudentExist()
  readonly students: mongoose.Schema.Types.ObjectId[];
}
