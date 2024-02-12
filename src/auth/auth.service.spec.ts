import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordMismatchException } from '../exceptions/password-mismatch.exception';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const MockUserService = {
      findOne: jest.fn((email) => {
        if (email != 'test@gmail.com') return undefined;
        else
          return {
            _id: Date.now().toString(),
            email: 'test@gmail.com',
            password: 'password',
            role: 'USER',
          };
      }),
      create: jest.fn(() => {
        return {
          email: 'test@gmail.com',
          password: 'password',
          role: 'USER',
        };
      }),
    };
    const MockJwtService = {
      sign: jest.fn(() => 'mockedToken'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue(MockUserService)
      .overrideProvider(JwtService)
      .useValue(MockJwtService)
      .compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if email and password are correct', async () => {
      const email = 'test@gmail.com';
      const password = 'password';
      const expectedResult = {
        _id: expect.any(String),
        email: 'test@gmail.com',
        role: 'USER',
      };
      expect(await authService.validateUser(email, password)).toEqual(
        expectedResult,
      );
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerDto = {
        email: 'test@gmail.com',
        password: 'password',
        confirmPassword: 'password',
      };
      const expectedResult = {
        token: expect.any(String),
      };
      expect(await authService.register(registerDto)).toEqual(expectedResult);
    });

    it('should throw PasswordMismatchException if passwords do not match', async () => {
      const registerDto = {
        email: 'test@gmail.com',
        password: 'password',
        confirmPassword: 'differentPassword',
      };

      await expect(authService.register(registerDto)).rejects.toThrow(
        PasswordMismatchException,
      );
    });
  });

  describe('login', () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((passwordToCheck, password) => {
        return passwordToCheck === password;
      });

    it('should login a user successfully', async () => {
      const loginDto = {
        email: 'test@gmail.com',
        password: 'password',
      };
      const expectedResult = {
        token: expect.any(String),
      };
      expect(await authService.login(loginDto)).toEqual(expectedResult);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto = {
        email: 'wrong_email@gmail.com',
        password: 'password',
      };
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user password is incorrect', async () => {
      const loginDto = {
        email: 'test@gmail.com',
        password: 'wrong_password',
      };
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
