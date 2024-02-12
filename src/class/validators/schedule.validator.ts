import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'scheduleValidator' })
@Injectable()
export class ScheduleValidator implements ValidatorConstraintInterface {
  validate(values: string[] = []): boolean {
    const allowedValues = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    if (values.length) {
      return values.every((value) =>
        allowedValues.includes(value.toLowerCase()),
      );
    }
    return false;
  }

  defaultMessage(): string {
    return 'Please enter correct day of the week.';
  }
}

export const isScheduleValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ScheduleValidator,
    });
  };
};
