import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SportsClass } from './schemas/sports-class.schema';
import { SportsClassDto } from './dto/sports-class.dto';
import { Sport } from '../sport/schemas/sport.schema';

@Injectable()
export class SportsClassService {
  constructor(
    @InjectModel('SportsClass') private sportsClassModel: Model<SportsClass>,
  ) {}

  async findAll(): Promise<SportsClass[]> {
    return this.sportsClassModel.find();
  }

  async findOne(name: SportsClass): Promise<SportsClass | undefined> {
    return this.sportsClassModel.findOne(name);
  }

  async findById(id: string): Promise<SportsClass | undefined> {
    return this.sportsClassModel.findById(id);
  }

  async findBySport(sports: string[]): Promise<SportsClass[]> {
    return this.sportsClassModel.find({ sport: { $in: sports } });
  }

  async create(sportsClassDto: SportsClassDto): Promise<SportsClass> {
    const createdSportsClass =
      await this.sportsClassModel.create(sportsClassDto);
    return createdSportsClass;
  }

  async update(
    id: string,
    sportsClassDto: SportsClassDto,
  ): Promise<SportsClass | undefined> {
    return this.sportsClassModel.findByIdAndUpdate(id, sportsClassDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<SportsClass | undefined> {
    return this.sportsClassModel.findByIdAndDelete(id);
  }

  async deleteSportClasses(sport: Sport) {
    const sportClasses = await this.sportsClassModel.find({
      sport: sport.name,
    });
    sportClasses.forEach(async (sportsClass) => {
      await this.sportsClassModel.findByIdAndDelete(sportsClass._id);
    });
  }
}
