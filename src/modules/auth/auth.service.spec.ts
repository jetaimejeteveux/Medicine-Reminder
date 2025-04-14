// src/modules/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockedHashedPassword = 'hashed_password';
      const mockedUser = {
        id: 1,
        name: registerDto.name,
        email: registerDto.email,
        password: mockedHashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock user check to return null (user does not exist)
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      // Mock bcrypt hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockedHashedPassword);
      // Mock user creation
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockedUser);

      const result = await service.register(registerDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: mockedHashedPassword,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockedUser.id,
        email: mockedUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockedUser.id,
          name: mockedUser.name,
          email: mockedUser.email,
        },
        token: 'test_token',
      });
    });

    it('should throw an error if the user already exists', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock user check to return existing user
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 1,
        name: 'Existing User',
        email: registerDto.email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user and return token if credentials are valid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockedUser = {
        id: 1,
        name: 'Test User',
        email: loginDto.email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock user check
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockedUser);
      // Mock password comparison
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockedUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockedUser.id,
        email: mockedUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockedUser.id,
          name: mockedUser.name,
          email: mockedUser.email,
        },
        token: 'test_token',
      });
    });

    it('should throw an error if user does not exist', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Mock user check to return null
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw an error if password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      const mockedUser = {
        id: 1,
        name: 'Test User',
        email: loginDto.email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock user check
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockedUser);
      // Mock password comparison to return false
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload', () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = service.generateToken(userId, email);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userId,
        email,
      });
      expect(token).toBe('test_token');
    });
  });
});
