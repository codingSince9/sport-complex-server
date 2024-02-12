import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordMismatchException extends HttpException {
  constructor() {
    super('Password Mismatch', HttpStatus.CONFLICT);
  }
}
