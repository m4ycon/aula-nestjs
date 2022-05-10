import { PrismaService } from './../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);

    prisma = module.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = {
      name: null,
      email: 'teste@teste.teste',
      password: '123456789',
    };

    const user = await service.create(userDto);

    expect(user).toEqual({
      id: expect.any(Number),
      name: null,
      email: userDto.email,
      Post: expect.arrayContaining([]),
      Profile: expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
      }),
    });
  });

  it('should not create a user with a duplicated email', async () => {
    const userDto = {
      name: null,
      email: 'duplicated@duplicated.duplicated',
      password: '123456789',
    };

    const user = await service.create(userDto);
    expect(user.id).toBeDefined();

    // Tenta cadastrar novamente com o mesmo email
    await expect(service.create(userDto)).rejects.toThrowError(
      ForbiddenException,
    );
  });

  it('should update a user', async () => {
    const userDto = {
      name: null,
      email: 'updated@updated.updated',
      password: '123456789',
    };

    const user = await service.create(userDto);
    expect(user.id).toBeDefined();

    const updatedUser = await service.update(user.id, {
      name: 'Updated',
    });

    expect(updatedUser).toEqual({
      id: user.id,
      email: userDto.email,
      name: 'Updated',
    });
  });

  it('should find a user by id', async () => {
    const userDto = {
      name: null,
      email: 'unique@unique.unique',
      password: '123456789',
    };

    const user = await service.create(userDto);
    expect(user.id).toBeDefined();

    const targetId = await service.findOne(user.id);
    expect(targetId).toEqual({ ...user });
  });

  it('should return a list of users', async () => {
    const userDto = {
      name: null,
      email: 'list@list.list',
      password: '123456789',
    };

    const user = await service.create(userDto);
    expect(user.id).toBeDefined();

    const users = await service.findAll();

    expect(users.length).toBeGreaterThan(0);
  });

  it('should delete a user', async () => {
    const userDto = {
      name: null,
      email: 'other@other.other',
      password: '123456789',
    };

    const user = await service.create(userDto);
    expect(user.id).toBeDefined();

    const deletedUser = await service.remove(user.id);
    expect(deletedUser).toEqual({
      ...userDto,
      ...user,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should not find a user that does not exist by id', async () => {
    await expect(service.findOne(7777)).rejects.toThrowError(NotFoundException);
  });
});
