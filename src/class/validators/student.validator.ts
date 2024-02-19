import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserService } from '../../user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@ValidatorConstraint({ name: 'studentValidator' })
@Injectable()
export class StudentValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async validate(value: string): Promise<boolean> {
    const student = await this.userModel.findById(value);
    return student ? true : false;
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
