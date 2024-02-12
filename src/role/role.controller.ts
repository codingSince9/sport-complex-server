import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './schemas/role.schema';
import { RoleLevel } from './entities/role-level.enum';
import { Roles } from '../role/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The created role.', type: Role })
  @Post()
  @Roles(RoleLevel.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createRole(@Body() role: Role): Promise<Role> {
    return this.roleService.create(role);
  }
}
