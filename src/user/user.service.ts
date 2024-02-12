import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }

  async findOne(email: string): Promise<any | undefined> {
    return this.userModel.findOne({ email });
  }

  async create(user: User): Promise<any> {
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async update(id: string, user: UserDto): Promise<User | undefined> {
    return this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<User | undefined> {
    return this.userModel.findByIdAndDelete(id);
  }
}
