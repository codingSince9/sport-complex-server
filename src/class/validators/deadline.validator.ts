import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { SportsClassDto } from '../dto/sports-class.dto';

@ValidatorConstraint({ name: 'deadlineValidator' })
@Injectable()
export class DeadlineValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const dtoObject = args.object as SportsClassDto;
    return (
      Date.parse(value) >= Date.parse(dtoObject.startDate) &&
      Date.parse(value) <= Date.parse(dtoObject.endDate)
    );
  }

  defaultMessage(): string {
    return 'Class deadline should be at least on the start date or at most on the end date.';
  }
}

export const isDeadlineValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: DeadlineValidator,
    });
  };
};
