import { SetMetadata } from '@nestjs/common';
import { RoleLevel } from '../role/entities/role-level.enum';

export const Roles = (...roles: RoleLevel[]) => SetMetadata('roles', roles);
