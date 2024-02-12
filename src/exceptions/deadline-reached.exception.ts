import { HttpException, HttpStatus } from '@nestjs/common';

export class DeadlineReachedException extends HttpException {
  constructor() {
    super('Deadline Reached', HttpStatus.FORBIDDEN);
  }
}
