import { HttpException, HttpStatus } from '@nestjs/common';

export class ClassDoesNotExistException extends HttpException {
  constructor() {
    super('Class Does Not Exist', HttpStatus.NOT_FOUND);
  }
}
