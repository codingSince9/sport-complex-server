import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'deadlineValidator' })
@Injectable()
export class StartDateValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const dateObject = new Date();
    return Date.parse(value) >= Date.parse(dateObject.toLocaleDateString());
  }

  defaultMessage(): string {
    return 'Class start date cannot be in the past.';
  }
}

export const isStartDateValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: StartDateValidator,
    });
  };
};
