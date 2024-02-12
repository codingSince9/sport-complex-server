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
export class EndDateValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const dtoObject = args.object as SportsClassDto;
    return Date.parse(value) >= Date.parse(dtoObject.startDate);
  }

  defaultMessage(): string {
    return 'Class end date cannot be before the start date.';
  }
}

export const isEndDateValid = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EndDateValidator,
    });
  };
};
