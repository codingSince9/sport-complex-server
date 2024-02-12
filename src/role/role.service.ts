import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel('Role') private roleModel: Model<Role>) {}

  async findOne(name: Role): Promise<Role | undefined> {
    return this.roleModel.findOne(name);
  }

  async create(role: Role): Promise<Role> {
    const createdRole = await this.roleModel.create(role);
    return createdRole;
  }
}
