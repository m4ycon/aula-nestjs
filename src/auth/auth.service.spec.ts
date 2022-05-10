import { PrismaService } from './../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [AuthService, UsersService, PrismaService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user and return its token', async () => {
    const user = {
      name: null,
      email: 'teste@teste.teste',
      password: '123456789',
    };
    const token = await service.signup(user);

    expect(token.access_token).toBeDefined();
  });

  it('should not sign up a user with a duplicated email', async () => {
    const user = {
      name: null,
      email: 'duplicated-auth@duplicated.duplicated',
      password: '123456789',
    };

    const token = await service.signup(user);
    expect(token.access_token).toBeDefined();

    // Tenta cadastrar novamente com o mesmo email
    await expect(service.signup(user)).rejects.toThrowError(ForbiddenException);
  });

  it('should sign in a user and return its token', async () => {
    const user = {
      email: 'teste@teste.teste',
      password: '123456789',
    };

    const token = await service.signin(user);

    expect(token.access_token).toBeDefined();
  });

  it('should throw an error if user does not exist', async () => {
    const user = {
      email: 'user@doesnt.exist',
      password: '123456789',
    };

    await expect(service.signin(user)).rejects.toThrowError(NotFoundException);
  });

  it('should throw an error if password does not match', async () => {
    const user = {
      name: null,
      email: 'teste@teste.teste',
      password: '123456',
    };

    await expect(service.signin(user)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should return a token', async () => {
    const token = await service.signToken(1, 'outro@teste.com');

    expect(token).toEqual({ access_token: expect.any(String) });
  });
});
