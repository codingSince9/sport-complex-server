import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RoleLevel } from '../role/entities/role-level.enum';
import { PasswordMismatchException } from '../exceptions/password-mismatch.exception';

const SALT_ROUNDS = 10;
const ADMIN_DOMAIN = '@victorious.com';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (user && passwordCheck) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, password, confirmPassword } = registerDto;
    if (password !== confirmPassword) {
      throw new PasswordMismatchException();
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const userRole = email.endsWith(ADMIN_DOMAIN)
      ? RoleLevel.ADMIN
      : RoleLevel.USER;
    const user = await this.userService.create({
      email,
      password: passwordHash,
      role: userRole,
    });

    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      const payload = { email: user.email, role: user.role, id: user._id };
      const token = this.jwtService.sign(payload);
      return { token };
    }

    throw new UnauthorizedException('Invalid email or password.');
  }
}
