import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { SportService } from '../../sport/sport.service';

@ValidatorConstraint({ name: 'sportValidator' })
@Injectable()
export class SportValidator implements ValidatorConstraintInterface {
  constructor(private readonly sportService: SportService) {}

  async validate(value: string): Promise<boolean> {
    const sportExsits = await this.sportService.findOne({ name: value });
    return sportExsits ? true : false;
  }

  defaultMessage(): string {
    return 'Sport does not exist. You need to create it first.';
  }
}

export const isSportExist = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: SportValidator,
    });
  };
};
