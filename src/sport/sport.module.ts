import { Module } from '@nestjs/common';
import { SportService } from './sport.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Sport, SportSchema } from './schemas/sport.schema';
import { JwtService } from '@nestjs/jwt';
import { SportController } from './sport.controller';
import { SportValidator } from '../class/validators/sport.validator';
import { SportsClassModule } from '../class/sports-class.module';
import { SportsClassService } from '../class/sports-class.service';
import {
  SportsClass,
  SportsClassSchema,
} from '../class/schemas/sports-class.schema';

@Module({
  imports: [
    AuthModule,
    SportsClassModule,
    MongooseModule.forFeature([{ name: Sport.name, schema: SportSchema }]),
    MongooseModule.forFeature([
      { name: SportsClass.name, schema: SportsClassSchema },
    ]),
  ],
  controllers: [SportController],
  providers: [SportService, JwtService, SportValidator, SportsClassService],
  exports: [SportService],
})
export class SportModule {}
