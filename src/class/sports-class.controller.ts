import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { Roles } from '../role/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleLevel } from '../role/entities/role-level.enum';
import { SportsClassService } from './sports-class.service';
import { RolesGuard } from '../role/roles.guard';
import { SportsClass } from './schemas/sports-class.schema';
import { SportsClassDto } from './dto/sports-class.dto';
import { AlreadyAppliedException } from '../exceptions/already-applied.exception';
import { DeadlineReachedException } from '../exceptions/deadline-reached.exception';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ClassDoesNotExistException } from '../exceptions/class-does-not-exist.exception';

@ApiTags('Sport Classes')
@Controller('classes')
export class SportsClassController {
  constructor(private sportsClassService: SportsClassService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'The created class.', type: SportsClass })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Post('/new')
  @Roles(RoleLevel.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createSportsClass(
    @Body() sportsClassDto: SportsClassDto,
  ): Promise<SportsClass> {
    return this.sportsClassService.create(sportsClassDto);
  }

  @ApiOkResponse({ description: 'All class records.', type: [SportsClass] })
  @Get('all')
  async getAllSportsClasses(): Promise<SportsClass[]> {
    return this.sportsClassService.findAll();
  }

  @ApiOkResponse({ description: 'The found class record.', type: SportsClass })
  @Get(':id')
  async getSportsClassById(@Param('id') id: string): Promise<SportsClass> {
    return this.sportsClassService.findById(id);
  }

  @ApiOkResponse({ description: 'Filtered classes.', type: [SportsClass] })
  @Get()
  async getSportsClassByName(
    @Query('sports') sports: string,
  ): Promise<SportsClass[]> {
    const sportsArray = sports.split(',');
    return this.sportsClassService.findBySport(sportsArray);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The updated class record.',
    type: SportsClass,
  })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Put(':id')
  @Roles(RoleLevel.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateSportsClass(
    @Param('id') id: string,
    @Body() sportsClassDto: SportsClassDto,
  ): Promise<
    | SportsClass
    | ClassDoesNotExistException
    | DeadlineReachedException
    | AlreadyAppliedException
  > {
    return this.sportsClassService.update(id, sportsClassDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The class record user applied to.',
    type: SportsClass,
  })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Put('/apply/:id')
  @UseGuards(JwtAuthGuard)
  async applyToSportsClass(
    @Param('id') id: string,
    @Request() req,
  ): Promise<
    | SportsClass
    | ClassDoesNotExistException
    | DeadlineReachedException
    | AlreadyAppliedException
  > {
    return this.sportsClassService.update(id, null, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The deleted class record.',
    type: SportsClass,
  })
  @Delete(':id')
  @Roles(RoleLevel.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteSportsClass(@Param('id') id: string): Promise<SportsClass> {
    return this.sportsClassService.delete(id);
  }
}
