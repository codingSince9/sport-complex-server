import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../role/roles.guard';
import { Roles } from '../role/roles.decorator';
import { RoleLevel } from '../role/entities/role-level.enum';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@Roles(RoleLevel.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ description: 'All user records.', type: [User] })
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOkResponse({ description: 'The found user record.', type: User })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @ApiOkResponse({ description: 'The updated user record.', type: User })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UserDto,
  ): Promise<User> {
    return this.userService.update(id, user);
  }

  @ApiOkResponse({ description: 'The deleted user record.', type: User })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
