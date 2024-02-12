import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sport } from './schemas/sport.schema';

@Injectable()
export class SportService {
  constructor(@InjectModel('Sport') private sportModel: Model<Sport>) {}

  async findOne(name: Sport): Promise<Sport | undefined> {
    return this.sportModel.findOne(name);
  }

  async create(sport: Sport): Promise<Sport> {
    const createdSport = await this.sportModel.create(sport);
    return createdSport;
  }

  async delete(sport: Sport): Promise<Sport> {
    const sportToDelete = await this.findOne(sport);
    return this.sportModel.findByIdAndDelete(sportToDelete);
  }
}
