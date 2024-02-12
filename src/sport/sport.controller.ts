import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { RoleLevel } from '../role/entities/role-level.enum';
import { Roles } from '../role/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../role/roles.guard';
import { Sport } from './schemas/sport.schema';
import { SportService } from './sport.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SportsClassService } from '../class/sports-class.service';

@ApiTags('Sport')
@Controller('sport')
@Roles(RoleLevel.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SportController {
  constructor(
    private sportService: SportService,
    private sportClassService: SportsClassService,
  ) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The created sport.', type: Sport })
  @Post('/new')
  async createSport(@Body() sport: Sport): Promise<Sport> {
    return this.sportService.create(sport);
  }

  // request for deletion of sport
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The deleted sport.', type: Sport })
  @Delete()
  async deleteSport(@Body() sport: Sport): Promise<Sport> {
    const deletedSport = await this.sportService.delete(sport);
    await this.sportClassService.deleteSportClasses(sport);
    return deletedSport;
  }
}
