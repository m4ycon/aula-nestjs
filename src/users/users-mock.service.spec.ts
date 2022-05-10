import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers: User[] = [];
  let mockIdRef = 0;

  const mockPrismaService = {
    user: {
      create: jest.fn().mockImplementation(
        ({
          data: userDto,
        }: {
          data: User;
          select: {
            id: boolean;
            email: boolean;
            name: boolean;
            Profile: boolean;
            Post: boolean;
          };
        }) => {
          mockIdRef += 1;
          const user: User = {
            ...userDto,
            id: mockIdRef,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          mockUsers.push(user);

          return {
            id: mockIdRef,
            email: userDto.email,
            name: userDto.name,
            Profile: { id: 1, userId: mockIdRef },
            Post: [],
          };
        },
      ),
      findUnique: jest
        .fn()
        .mockImplementation(
          ({
            where: { id, email },
          }: {
            where: { id: number; email: string };
          }) => {
            let user: User;
            if (id) user = mockUsers.find((user) => user.id === id);
            else user = mockUsers.find((user) => user.email === email);

            if (user)
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                Profile: { id: 1, userId: mockIdRef },
                Post: [],
              };

            return user;
          },
        ),
      findMany: jest.fn().mockImplementation(() => mockUsers),
      update: jest.fn().mockImplementation(
        ({
          data: userDto,
          where: { email, id },
        }: {
          data: User;
          where: {
            id: number;
            email: string;
          };
          select: {
            id: boolean;
            email: boolean;
            name: boolean;
          };
        }) => {
          let userIndex = undefined;
          if (id) userIndex = mockUsers.findIndex((user) => user.id === id);
          else userIndex = mockUsers.findIndex((user) => user.email === email);

          mockUsers[userIndex] = { ...mockUsers[userIndex], ...userDto };

          return {
            id: mockUsers[userIndex].id,
            email: mockUsers[userIndex].email,
            name: mockUsers[userIndex].name,
          };
        },
      ),
      delete: jest.fn().mockImplementation(
        ({
          where: { id },
        }: {
          where: {
            id: number;
          };
          include: {
            Profile: boolean;
            Post: boolean;
          };
        }) => {
          const index = mockUsers.findIndex((user) => user.id === id);
          const user = mockUsers.splice(index, 1)[0];
          return {
            ...user,
            Profile: { id: 1, userId: mockIdRef },
            Post: [],
          };
        },
      ),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
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
