import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock AuthService
  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginData = {
      username: 'testuser',
      password: 'password123',
    };

    it('should return access token when credentials are valid', async () => {
      const user = { id: 1, username: 'testuser' };
      const expectedResult = { access_token: 'jwt-token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginData);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginData.username,
        loginData.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginData.username,
        loginData.password,
      );
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile from request', () => {
      const req = {
        user: {
          id: 1,
          username: 'testuser',
          roles: ['user'],
        },
      };

      const result = controller.getProfile(req);

      expect(result).toEqual(req.user);
    });
  });
});
