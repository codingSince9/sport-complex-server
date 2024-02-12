import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const MockAuthService = {
      login: jest.fn((dto) => {
        return {
          token: 'mockedToken',
        };
      }),
      register: jest.fn((dto) => {
        return {
          token: 'mockedToken',
        };
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(MockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@gmail.com',
        password: 'password',
        confirmPassword: 'password',
      };
      const expectedResult = { token: expect.any(String) };
      expect(controller.register(registerDto)).toEqual(expectedResult);
    });
  });
  describe('login', () => {
    it('should log in a user1', async () => {
      const loginDto: LoginDto = {
        email: 'testni@gmail.com',
        password: 'password',
      };
      const expectedResult = { token: expect.any(String) };
      expect(controller.login(loginDto)).toEqual(expectedResult);
    });
  });
});
