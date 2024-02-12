import { Module } from '@nestjs/common';
import { SportsClassController } from './sports-class.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SportsClass, SportsClassSchema } from './schemas/sports-class.schema';
import { SportsClassService } from './sports-class.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: SportsClass.name, schema: SportsClassSchema },
    ]),
  ],
  controllers: [SportsClassController],
  providers: [SportsClassService, JwtService],
  exports: [SportsClassService],
})
export class SportsClassModule {}
