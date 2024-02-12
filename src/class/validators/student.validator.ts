import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserService } from '../../user/user.service';

@ValidatorConstraint({ name: 'studentValidator' })
@Injectable()
export class StudentValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(value: string): Promise<boolean> {
    const allUsers = await this.userService.findAll();
    return allUsers.some((user: any) => user._id === value);
  }

  defaultMessage(): string {
    return 'User you added does not exist.';
  }
}

export const isStudentExist = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: StudentValidator,
    });
  };
};
