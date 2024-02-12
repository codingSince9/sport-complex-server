import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyAppliedException extends HttpException {
  constructor() {
    super('Already Applied', HttpStatus.CONFLICT);
  }
}
